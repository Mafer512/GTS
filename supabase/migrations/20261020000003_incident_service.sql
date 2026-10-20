-- =====================================================================
-- Servicios de incidencias — equivalente a:
--   App\Services\IncidentService, FolioGeneratorService, AuditService,
--   NotificationService y las validaciones de App\Http\Requests\*.
-- Cada función pública es un "endpoint" RPC (POST /rest/v1/rpc/<nombre>).
-- =====================================================================

-- Utilidades internas --------------------------------------------------
create or replace function public._require_user() returns public.users
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype;
begin
    if auth.uid() is null then
        raise exception 'No autenticado.' using errcode = '42501';
    end if;

    select * into v_user from public.users where auth_id = auth.uid();
    if not found then
        raise exception 'No autenticado.' using errcode = '42501';
    end if;

    if not v_user.is_active then
        raise exception 'Usuario inactivo.' using errcode = '42501';
    end if;

    return v_user;
end;
$$;

create or replace function public._deny(p_message text default 'Esta acción no está autorizada.') returns void
language plpgsql as $$
begin
    raise exception '%', p_message using errcode = '42501';
end;
$$;

create or replace function public._fail(p_message text) returns void
language plpgsql as $$
begin
    raise exception '%', p_message using errcode = 'P0001';
end;
$$;

-- Carbon::toIso8601String() en la zona horaria institucional (ej. 2026-10-20T12:34:56-06:00)
create or replace function public._iso8601(p_ts timestamptz) returns text
language sql stable as $$
    select to_char(local_ts, 'YYYY-MM-DD"T"HH24:MI:SS')
        || case when offset_value < interval '0' then '-' else '+' end
        || to_char(case when offset_value < interval '0' then -offset_value else offset_value end, 'HH24:MI')
    from (
        select p_ts at time zone public.app_tz() as local_ts,
               (p_ts at time zone public.app_tz()) - (p_ts at time zone 'UTC') as offset_value
    ) s
$$;

create or replace function public._status_id(p_code text) returns bigint
language sql stable security definer set search_path = public as $$
    select id from public.statuses where code = p_code
$$;

create or replace function public._status_name(p_code text) returns text
language sql stable security definer set search_path = public as $$
    select name from public.statuses where code = p_code
$$;

-- AuditService::logAction
create or replace function public._log_action(
    p_incident_id bigint,
    p_user_id bigint,
    p_action text,
    p_field_name text default null,
    p_old_value text default null,
    p_new_value text default null,
    p_comment text default null
) returns void
language sql security definer set search_path = public as $$
    insert into public.incident_histories (incident_id, user_id, action, field_name, old_value, new_value, comment, created_at)
    values (p_incident_id, p_user_id, p_action, p_field_name, p_old_value, p_new_value, p_comment, clock_timestamp())
$$;

-- IncidentNotification (canal database)
create or replace function public._notify(
    p_user_id bigint,
    p_type text,
    p_title text,
    p_message text,
    p_incident_id bigint,
    p_folio text,
    p_icon text,
    p_level text
) returns void
language sql security definer set search_path = public as $$
    insert into public.notifications (user_id, data)
    values (
        p_user_id,
        jsonb_build_object(
            'type', p_type,
            'title', p_title,
            'message', p_message,
            'incident_id', p_incident_id,
            'folio', p_folio,
            'action_url', '#/incidencias/' || p_folio,
            'icon', p_icon,
            'level', p_level
        )
    )
$$;

create or replace function public._active_admin_ids(p_exclude bigint[] default '{}') returns setof bigint
language sql stable security definer set search_path = public as $$
    select u.id
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.is_active and r.slug = 'admin'
      and not (u.id = any (coalesce(array_remove(p_exclude, null), '{}')))
$$;

create or replace function public._is_active_user(p_user_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce((select is_active from public.users where id = p_user_id), false)
$$;

create or replace function public._user_name(p_user_id bigint) returns text
language sql stable security definer set search_path = public as $$
    select name from public.users where id = p_user_id
$$;

-- Incident::isAssignedToTics
create or replace function public._incident_is_tics(p_incident_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce((select assigned_specialist = 'TICS' from public.incidents where id = p_incident_id), false)
        or exists (
            select 1 from public.incident_assigned_areas
            where incident_id = p_incident_id and lower(area_code) = 'tics'
        )
$$;

-- ---------------------------------------------------------------------
-- FolioGeneratorService
-- ---------------------------------------------------------------------
create or replace function public._format_folio(p_year integer, p_number integer) returns text
language sql immutable as $$
    select 'INC-' || lpad(p_year::text, 4, '0') || '-'
        || case when p_number < 10000 then lpad(p_number::text, 4, '0') else p_number::text end
$$;

create or replace function public._next_folio() returns text
language plpgsql security definer set search_path = public as $$
declare
    v_year integer := extract(year from (now() at time zone public.app_tz()))::integer;
    v_number integer;
begin
    insert into public.folio_sequences (year, last_number, updated_at)
    values (v_year, 1, now())
    on conflict (year) do update
        set last_number = public.folio_sequences.last_number + 1,
            updated_at = now()
    returning last_number into v_number;

    return public._format_folio(v_year, v_number);
end;
$$;

create or replace function public.folio_preview() returns text
language sql stable security definer set search_path = public as $$
    select public._format_folio(
        extract(year from (now() at time zone public.app_tz()))::integer,
        coalesce((
            select last_number from public.folio_sequences
            where year = extract(year from (now() at time zone public.app_tz()))::integer
        ), 0) + 1
    )
$$;

-- ---------------------------------------------------------------------
-- Despacho de notificaciones (NotificationService)
-- ---------------------------------------------------------------------
create or replace function public._notify_incident_created(p_incident_id bigint) returns void
language plpgsql security definer set search_path = public as $$
declare
    v record;
    v_critical boolean;
    v_agent bigint;
    v_admin bigint;
begin
    select i.id, i.folio, i.location, i.reported_by_user_id, c.name as category_name, p.slug as priority_slug,
           ru.name as reporter_name
    into v
    from public.incidents i
    left join public.categories c on c.id = i.category_id
    left join public.priorities p on p.id = i.priority_id
    left join public.users ru on ru.id = i.reported_by_user_id
    where i.id = p_incident_id;

    v_critical := v.priority_slug = 'critica';

    if public._is_active_user(v.reported_by_user_id) then
        perform public._notify(v.reported_by_user_id, 'incident_created', 'Incidencia Registrada',
            format('La incidencia %s ha sido despachada exitosamente a GTS.', v.folio),
            v.id, v.folio, 'task_alt', 'success');
    end if;

    for v_agent in
        select u.id from public.users u join public.roles r on r.id = u.role_id
        where u.is_active and r.slug = 'gts' and u.id <> v.reported_by_user_id
    loop
        perform public._notify(v_agent, 'new_incident_available',
            case when v_critical then '⚠️ Incidencia Crítica Disponible' else 'Nueva Incidencia Disponible' end,
            format('Se registró %s en %s (%s).', v.folio, v.location, coalesce(v.category_name, '')),
            v.id, v.folio,
            case when v_critical then 'emergency' else 'notification_important' end,
            case when v_critical then 'critical' else 'warning' end);
    end loop;

    for v_admin in select * from public._active_admin_ids(array[v.reported_by_user_id]) loop
        perform public._notify(v_admin, 'incident_created_admin', format('Nueva Incidencia: %s', v.folio),
            format('Apertura de ticket por %s (%s).', coalesce(v.reporter_name, ''), coalesce(v.category_name, '')),
            v.id, v.folio, 'fiber_new',
            case when v_critical then 'critical' else 'info' end);
    end loop;
end;
$$;

create or replace function public._notify_incident_assigned(
    p_incident_id bigint, p_assigner_id bigint, p_technician_id bigint, p_is_reassignment boolean
) returns void
language plpgsql security definer set search_path = public as $$
declare
    v record;
    v_tech_name text := public._user_name(p_technician_id);
    v_assigner_name text := public._user_name(p_assigner_id);
    v_admin bigint;
begin
    select i.id, i.folio, i.location, i.reported_by_user_id, p.slug as priority_slug
    into v
    from public.incidents i left join public.priorities p on p.id = i.priority_id
    where i.id = p_incident_id;

    if p_assigner_id <> p_technician_id and public._is_active_user(p_technician_id) then
        perform public._notify(p_technician_id,
            case when p_is_reassignment then 'incident_reassigned' else 'incident_assigned' end,
            case when p_is_reassignment then 'Incidencia Reasignada' else 'Incidencia Asignada' end,
            format('Has sido asignado como responsable técnico de %s (%s).', v.folio, v.location),
            v.id, v.folio, 'assignment_ind', 'info');
    end if;

    if public._is_active_user(v.reported_by_user_id) and v.reported_by_user_id <> p_assigner_id then
        perform public._notify(v.reported_by_user_id, 'incident_assigned_reporter', 'Especialista Asignado',
            format('La incidencia %s fue asignada a %s para su atención.', v.folio, v_tech_name),
            v.id, v.folio, 'engineering', 'info');
    end if;

    if p_is_reassignment or v.priority_slug = 'critica' then
        for v_admin in select * from public._active_admin_ids(array[p_assigner_id, p_technician_id, v.reported_by_user_id]) loop
            perform public._notify(v_admin, 'incident_assignment_admin', format('Asignación Técnica: %s', v.folio),
                format('Incidencia %s asignada a %s por %s.', v.folio, v_tech_name, v_assigner_name),
                v.id, v.folio, 'swap_horiz', 'info');
        end loop;
    end if;
end;
$$;

create or replace function public._notify_attention_started(p_incident_id bigint, p_technician_id bigint) returns void
language plpgsql security definer set search_path = public as $$
declare
    v record;
begin
    select id, folio, reported_by_user_id into v from public.incidents where id = p_incident_id;

    if public._is_active_user(v.reported_by_user_id) and v.reported_by_user_id <> p_technician_id then
        perform public._notify(v.reported_by_user_id, 'attention_started', 'Atención Técnica Iniciada',
            format('El especialista %s ha comenzado los trabajos en %s.', public._user_name(p_technician_id), v.folio),
            v.id, v.folio, 'build', 'info');
    end if;
end;
$$;

create or replace function public._excerpt(p_text text) returns text
language sql immutable as $$
    select substr(p_text, 1, 80) || case when char_length(p_text) > 80 then '...' else '' end
$$;

create or replace function public._notify_technical_note(p_incident_id bigint, p_author_id bigint, p_note text) returns void
language plpgsql security definer set search_path = public as $$
declare
    v record;
    v_message text;
begin
    select id, folio, reported_by_user_id, assigned_to_user_id into v from public.incidents where id = p_incident_id;
    v_message := public._user_name(p_author_id) || ': ' || public._excerpt(p_note);

    if public._is_active_user(v.reported_by_user_id) and v.reported_by_user_id <> p_author_id then
        perform public._notify(v.reported_by_user_id, 'technical_note_added', format('Nota Técnica en %s', v.folio),
            v_message, v.id, v.folio, 'note_alt', 'info');
    end if;

    if v.assigned_to_user_id is not null and public._is_active_user(v.assigned_to_user_id) and v.assigned_to_user_id <> p_author_id then
        perform public._notify(v.assigned_to_user_id, 'technical_note_added', format('Nota Técnica en %s', v.folio),
            v_message, v.id, v.folio, 'note_alt', 'info');
    end if;
end;
$$;

create or replace function public._notify_incident_resolved(p_incident_id bigint, p_technician_id bigint) returns void
language plpgsql security definer set search_path = public as $$
declare
    v record;
    v_name text := public._user_name(p_technician_id);
    v_admin bigint;
begin
    select id, folio, reported_by_user_id into v from public.incidents where id = p_incident_id;

    if public._is_active_user(v.reported_by_user_id) then
        perform public._notify(v.reported_by_user_id, 'incident_resolved', 'Incidencia Resuelta',
            format('La incidencia %s fue resuelta por %s. Pendiente de visto bueno de APOC.', v.folio, v_name),
            v.id, v.folio, 'task_alt', 'success');
    end if;

    for v_admin in select * from public._active_admin_ids(array[p_technician_id, v.reported_by_user_id]) loop
        perform public._notify(v_admin, 'incident_resolved_admin', format('Incidencia Resuelta: %s', v.folio),
            format('%s marcó como resuelta la incidencia %s.', v_name, v.folio),
            v.id, v.folio, 'check_circle', 'success');
    end loop;
end;
$$;

create or replace function public._notify_resolution_rejected(p_incident_id bigint, p_rejecter_id bigint, p_reason text) returns void
language plpgsql security definer set search_path = public as $$
declare
    v record;
    v_name text := public._user_name(p_rejecter_id);
    v_admin bigint;
begin
    select id, folio, assigned_to_user_id into v from public.incidents where id = p_incident_id;

    if v.assigned_to_user_id is not null and public._is_active_user(v.assigned_to_user_id) then
        perform public._notify(v.assigned_to_user_id, 'resolution_rejected', 'Solución No Aprobada',
            format('APOC (%s) rechazó la solución de %s. Motivo: %s', v_name, v.folio, public._excerpt(p_reason)),
            v.id, v.folio, 'cancel', 'warning');
    end if;

    for v_admin in select * from public._active_admin_ids(array[p_rejecter_id, v.assigned_to_user_id]) loop
        perform public._notify(v_admin, 'resolution_rejected_admin', format('Solución Rechazada: %s', v.folio),
            format('APOC (%s) devolvió a atención la incidencia %s.', v_name, v.folio),
            v.id, v.folio, 'report_problem', 'warning');
    end loop;
end;
$$;

create or replace function public._notify_incident_closed(p_incident_id bigint, p_closer_id bigint) returns void
language plpgsql security definer set search_path = public as $$
declare
    v record;
    v_tagged text := public.user_tagged_name(p_closer_id);
    v_admin bigint;
begin
    select id, folio, assigned_to_user_id into v from public.incidents where id = p_incident_id;

    if v.assigned_to_user_id is not null and public._is_active_user(v.assigned_to_user_id) and v.assigned_to_user_id <> p_closer_id then
        perform public._notify(v.assigned_to_user_id, 'incident_closed', 'Incidencia Cerrada',
            format('%s recibió el visto bueno de cierre por %s.', v.folio, v_tagged),
            v.id, v.folio, 'verified', 'success');
    end if;

    for v_admin in select * from public._active_admin_ids(array[p_closer_id, v.assigned_to_user_id]) loop
        perform public._notify(v_admin, 'incident_closed_admin', format('Incidencia Cerrada: %s', v.folio),
            format('El ticket %s fue cerrado formalmente por %s.', v.folio, v_tagged),
            v.id, v.folio, 'lock', 'info');
    end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Registrar incidencia (IncidentController@store + StoreIncidentRequest)
-- ---------------------------------------------------------------------
create or replace function public.incident_create(
    p_title text,
    p_description text,
    p_location text,
    p_category_id bigint,
    p_priority_id bigint
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_title text := trim(coalesce(p_title, ''));
    v_description text := trim(coalesce(p_description, ''));
    v_location text := trim(coalesce(p_location, ''));
    v_folio text;
    v_status_id bigint := public._status_id('NUEVA');
    v_incident_id bigint;
begin
    if not (public.user_is_admin(v_user.id) or public.user_has_permission(v_user.id, 'incidents.create')) then
        perform public._deny();
    end if;

    if v_title = '' then perform public._fail('El título o asunto de la incidencia es obligatorio.'); end if;
    if char_length(v_title) < 5 then perform public._fail('El título debe contener al menos 5 caracteres.'); end if;
    if char_length(v_title) > 255 then perform public._fail('El título no puede exceder los 255 caracteres.'); end if;
    if v_description = '' then perform public._fail('La descripción detallada del problema es obligatoria.'); end if;
    if char_length(v_description) < 10 then perform public._fail('La descripción debe contener al menos 10 caracteres explicativos.'); end if;
    if char_length(v_description) > 3000 then perform public._fail('La descripción no puede exceder los 3000 caracteres.'); end if;
    if v_location = '' then perform public._fail('La ubicación o área afectada en el aeropuerto es obligatoria.'); end if;
    if char_length(v_location) < 3 then perform public._fail('La ubicación debe contener al menos 3 caracteres.'); end if;
    if char_length(v_location) > 255 then perform public._fail('La ubicación no puede exceder los 255 caracteres.'); end if;
    if p_category_id is null then perform public._fail('Debe seleccionar un subsistema tecnológico válido.'); end if;
    if not exists (select 1 from public.categories where id = p_category_id and is_active) then
        perform public._fail('El subsistema seleccionado no es válido o está inactivo.');
    end if;
    if p_priority_id is null then perform public._fail('Debe seleccionar un nivel de prioridad.'); end if;
    if not exists (select 1 from public.priorities where id = p_priority_id and is_active) then
        perform public._fail('El nivel de prioridad seleccionado no es válido.');
    end if;

    v_folio := public._next_folio();

    insert into public.incidents (folio, title, description, location, category_id, priority_id, status_id, reported_by_user_id, reported_at)
    values (v_folio, v_title, v_description, v_location, p_category_id, p_priority_id, v_status_id, v_user.id, now())
    returning id into v_incident_id;

    perform public._log_action(v_incident_id, v_user.id, 'CREADA', 'status_id', null, public._status_name('NUEVA'),
        format('Incidencia despachada con Folio %s desde canal APOC.', v_folio));

    perform public._notify_incident_created(v_incident_id);

    return jsonb_build_object(
        'id', v_incident_id,
        'folio', v_folio,
        'message', format('Incidencia %s creada y despachada a GTS exitosamente.', v_folio)
    );
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Registrar evidencias ya cargadas en Storage (FileStorageService + StoreAttachmentRequest)
-- p_files: [{original_filename, stored_path, mime_type, file_size_bytes}]
-- p_context: 'create' (alta de incidencia) | 'upload' (expediente existente)
-- ---------------------------------------------------------------------
create or replace function public.incident_attachments_register(
    p_incident_id bigint,
    p_files jsonb,
    p_context text default 'upload'
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_file jsonb;
    v_count integer := 0;
    v_ext text;
    v_name text;
    v_path text;
    v_size bigint;
    v_folio text;
begin
    select folio into v_folio from public.incidents where id = p_incident_id;
    if v_folio is null then
        perform public._fail('La incidencia no existe.');
    end if;

    if not public.user_can(v_user.id, 'uploadAttachment', p_incident_id) then
        perform public._deny();
    end if;

    if p_files is null or jsonb_typeof(p_files) <> 'array' or jsonb_array_length(p_files) = 0 then
        perform public._fail('Debe seleccionar al menos un archivo de evidencia.');
    end if;

    if jsonb_array_length(p_files) > 5 then
        perform public._fail('No puede adjuntar más de 5 archivos simultáneamente.');
    end if;

    for v_file in select * from jsonb_array_elements(p_files) loop
        v_name := coalesce(v_file ->> 'original_filename', '');
        v_path := coalesce(v_file ->> 'stored_path', '');
        v_size := coalesce((v_file ->> 'file_size_bytes')::bigint, 0);
        v_ext := lower(regexp_replace(v_name, '^.*\.', ''));

        if v_ext not in ('jpg', 'jpeg', 'png', 'pdf', 'txt') or position('.' in v_name) = 0 then
            perform public._fail('Solo se admiten evidencias con extensión: JPG, PNG, PDF o TXT.');
        end if;
        if v_size > 10485760 then
            perform public._fail('Cada archivo de evidencia no debe superar los 10 MB.');
        end if;
        if public.storage_path_incident_id(v_path) is distinct from p_incident_id then
            perform public._fail('La ruta de almacenamiento de la evidencia no es válida.');
        end if;
        if not exists (select 1 from storage.objects where bucket_id = 'evidencias' and name = v_path) then
            perform public._fail('El archivo físico no se encuentra disponible.');
        end if;

        insert into public.incident_attachments (incident_id, uploaded_by_user_id, original_filename, stored_path, mime_type, file_size_bytes)
        values (p_incident_id, v_user.id, left(v_name, 255), v_path,
                coalesce(nullif(v_file ->> 'mime_type', ''), 'application/octet-stream'), v_size);
        v_count := v_count + 1;
    end loop;

    perform public._log_action(p_incident_id, v_user.id, 'ADJUNTOS_CARGADOS', 'attachments', null, null,
        case when p_context = 'create'
            then format('%s archivo(s) de evidencia adjuntado(s) al expediente.', v_count)
            else format('%s archivo(s) de evidencia adjuntado(s) por %s.', v_count, v_user.name)
        end);

    return jsonb_build_object(
        'count', v_count,
        'message', format('%s archivo(s) de evidencia adjuntado(s) exitosamente al expediente.', v_count)
    );
end;
$$;

-- ---------------------------------------------------------------------
-- IncidentService::getAssignableAreas / getAvailableTechnicians
-- ---------------------------------------------------------------------
create or replace function public.incident_assignable_areas(p_user_id bigint, p_incident_id bigint) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_creator_role bigint;
    v_assignable bigint[];
    v_result jsonb;
begin
    select u.role_id into v_creator_role
    from public.incidents i left join public.users u on u.id = i.reported_by_user_id
    where i.id = p_incident_id;

    if public.user_is_admin(p_user_id) then
        select coalesce(jsonb_agg(public._area_json(r) order by r.name), '[]') into v_result
        from public.roles r
        where r.slug <> 'admin' and (v_creator_role is null or r.id <> v_creator_role);
    else
        v_assignable := public.user_scope_role_ids(p_user_id, 'assign');
        if cardinality(v_assignable) > 0 then
            select coalesce(jsonb_agg(public._area_json(r) order by r.name), '[]') into v_result
            from public.roles r
            where r.slug <> 'admin' and (v_creator_role is null or r.id <> v_creator_role)
              and r.id = any (v_assignable);
        else
            select coalesce(jsonb_agg(public._area_json(r)), '[]') into v_result
            from public.roles r
            where r.slug = 'gts' and (v_creator_role is null or r.id <> v_creator_role);
        end if;
    end if;

    return v_result;
end;
$$;

create or replace function public._area_json(r public.roles) returns jsonb
language sql immutable as $$
    select jsonb_build_object(
        'code', r.slug,
        'name', r.name,
        'role_id', r.id,
        'badge_bg', coalesce(r.badge_bg, 'bg-slate-50'),
        'badge_text', coalesce(r.badge_text, 'text-slate-700'),
        'badge_border', coalesce(r.badge_border, 'border-slate-200')
    )
$$;

create or replace function public.incident_available_technicians(p_user_id bigint, p_incident_id bigint) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_creator_role bigint;
    v_assignable bigint[] := public.user_scope_role_ids(p_user_id, 'assign');
    v_admin boolean := public.user_is_admin(p_user_id);
begin
    select u.role_id into v_creator_role
    from public.incidents i left join public.users u on u.id = i.reported_by_user_id
    where i.id = p_incident_id;

    return coalesce((
        select jsonb_agg(jsonb_build_object(
            'id', u.id::text,
            'name', u.name,
            'badge', coalesce(u.badge_number, public.user_role_tag(u.id)),
            'role_slug', lower(r.slug),
            'role_name', coalesce(r.name, 'GTS')
        ) order by u.name)
        from public.users u
        join public.roles r on r.id = u.role_id
        where u.is_active
          and r.slug <> 'admin'
          and (v_creator_role is null or u.role_id <> v_creator_role)
          and (
              case
                  when cardinality(v_assignable) > 0 and v_admin then
                      u.role_id = any (v_assignable)
                      and (
                          exists (
                              select 1 from public.role_permissions rp
                              join public.permissions p on p.id = rp.permission_id
                              where rp.role_id = u.role_id and p.slug = 'incidents.attend'
                          )
                          or r.slug = 'gts'
                      )
                  when cardinality(v_assignable) > 0 then u.role_id = any (v_assignable)
                  else r.slug = 'gts'
              end
          )
    ), '[]');
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Asignar / reasignar áreas y especialista (AssignIncidentRequest + IncidentService::assign)
-- ---------------------------------------------------------------------
create or replace function public.incident_assign(
    p_incident_id bigint,
    p_areas text[] default null,
    p_technician_id bigint default null,
    p_comment text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_inc public.incidents%rowtype;
    v_status_code text;
    v_creator_role bigint;
    v_creator_slug text;
    v_assignable bigint[] := public.user_scope_role_ids(v_user.id, 'assign');
    v_is_admin boolean := public.user_is_admin(v_user.id);
    v_areas text[] := '{}';
    v_area text;
    v_code text;
    v_tech public.users%rowtype;
    v_tech_role public.roles%rowtype;
    v_comment text := nullif(trim(coalesce(p_comment, '')), '');
    v_role public.roles%rowtype;
    v_resolved jsonb := '[]';
    v_seen text[] := '{}';
    v_area_names text[] := '{}';
    v_area_labels text;
    v_is_initial boolean;
    v_previous_technician text;
    v_previous_status text;
    v_status_comment text;
    v_audit_comment text;
    v_new_value text;
    v_item jsonb;
    v_message text;
    v_gts public.roles%rowtype;
begin
    select * into v_inc from public.incidents where id = p_incident_id for update;
    if not found then
        perform public._fail('La incidencia no existe.');
    end if;

    if not public.user_can(v_user.id, 'assign', p_incident_id) then
        perform public._deny();
    end if;

    select s.code into v_status_code from public.statuses s where s.id = v_inc.status_id;
    select u.role_id, r.slug into v_creator_role, v_creator_slug
    from public.users u left join public.roles r on r.id = u.role_id
    where u.id = v_inc.reported_by_user_id;
    v_creator_slug := lower(coalesce(v_creator_slug, ''));

    -- prepareForValidation: compatibilidad con la toma directa (solo especialista)
    if p_areas is null then
        if p_technician_id is not null then
            select * into v_tech from public.users where id = p_technician_id;
            if found and v_tech.role_id is not null
               and (cardinality(v_assignable) = 0 or v_tech.role_id = any (v_assignable) or v_is_admin) then
                v_areas := array[(select slug from public.roles where id = v_tech.role_id)];
            else
                v_areas := array['gts'];
            end if;
        end if;
    else
        foreach v_area in array p_areas loop
            v_area := trim(coalesce(v_area, ''));
            if v_area <> '' and not (v_area = any (v_areas)) then
                v_areas := v_areas || v_area;
            end if;
        end loop;
    end if;

    -- Validación: áreas (required_without:assigned_to_user_id | array | min:1)
    if (cardinality(v_areas) = 0 and p_technician_id is null)
       or (p_areas is not null and cardinality(v_areas) = 0) then
        perform public._fail('Debe seleccionar al menos un área responsable para la asignación.');
    end if;

    foreach v_area in array v_areas loop
        v_code := lower(trim(v_area));

        if v_code = 'tics' then
            perform public._fail('El área TICS no es un destino válido para la asignación de incidencias.');
        end if;
        if v_code = 'admin' then
            perform public._fail('El rol Administrador no es un área válida para asignación de incidencias.');
        end if;
        if v_creator_slug <> '' and v_code = v_creator_slug then
            perform public._fail(format('No se puede asignar la incidencia a su rol de procedencia (%s).', v_area));
        end if;

        if v_is_admin then
            if not exists (
                select 1 from public.roles r
                where lower(r.slug) = v_code and r.slug <> 'admin'
                  and (v_creator_role is null or r.id <> v_creator_role)
            ) then
                perform public._fail(format('El área seleccionada (%s) no es válida o no está autorizada.', v_area));
            end if;
        else
            if not exists (
                select 1 from public.roles r
                where lower(r.slug) = v_code and r.slug <> 'admin'
                  and (v_creator_role is null or r.id <> v_creator_role)
                  and (
                      (cardinality(v_assignable) > 0 and r.id = any (v_assignable))
                      or (cardinality(v_assignable) = 0 and r.slug = 'gts')
                  )
            ) then
                perform public._fail(format('No tiene autorización para asignar al área seleccionada (%s).', v_area));
            end if;
        end if;
    end loop;

    -- Validación: especialista
    if p_technician_id is not null then
        select * into v_tech from public.users where id = p_technician_id and is_active;
        if not found then
            perform public._fail('El técnico seleccionado no existe, no pertenece a un área asignable o se encuentra inactivo.');
        end if;
        select * into v_tech_role from public.roles where id = v_tech.role_id;

        if public.user_is_admin(v_tech.id) then
            perform public._fail('El rol Administrador no puede ser seleccionado como especialista técnico.');
        end if;
        if v_creator_role is not null and v_tech.role_id = v_creator_role then
            perform public._fail('No se puede asignar un técnico perteneciente al rol que originó la incidencia.');
        end if;
        if not v_is_admin then
            if cardinality(v_assignable) > 0 then
                if v_tech.role_id is null or not (v_tech.role_id = any (v_assignable)) then
                    perform public._fail('El técnico seleccionado no pertenece a sus alcances de asignación autorizados.');
                end if;
            elsif coalesce(v_tech_role.slug, '') <> 'gts' then
                perform public._fail('El técnico seleccionado no pertenece a GTS.');
            end if;
        end if;
        if cardinality(v_areas) > 0
           and not (lower(coalesce(v_tech_role.slug, '')) = any (array(select lower(a) from unnest(v_areas) a))) then
            perform public._fail('El especialista seleccionado debe pertenecer a una de las áreas responsables elegidas.');
        end if;
    end if;

    if v_comment is not null and char_length(v_comment) > 500 then
        perform public._fail('El comentario de asignación no debe exceder los 500 caracteres.');
    end if;

    -- IncidentService::assign — normalización de áreas (minúsculas, sin duplicados, orden de captura)
    v_areas := array(
        select x from (
            select lower(trim(a)) as x, min(n) as n
            from unnest(v_areas) with ordinality as t(a, n)
            group by lower(trim(a))
        ) q order by n
    );

    if p_technician_id is not null and v_tech_role.id is not null then
        if not (lower(v_tech_role.slug) = any (v_areas)) then
            v_areas := v_areas || lower(v_tech_role.slug);
        end if;
    end if;

    foreach v_code in array v_areas loop
        if v_code in ('tics', 'admin') then
            continue;
        end if;

        select * into v_role from public.roles where lower(slug) = v_code limit 1;
        if not found then
            select * into v_role from public.roles where lower(name) = v_code limit 1;
        end if;

        if found then
            if v_role.slug = 'admin' or (v_creator_role is not null and v_role.id = v_creator_role) then
                continue;
            end if;
            if not (v_role.slug = any (v_seen)) then
                v_seen := v_seen || v_role.slug;
                v_resolved := v_resolved || jsonb_build_array(jsonb_build_object('code', v_role.slug, 'name', v_role.name, 'role_id', v_role.id));
            end if;
        else
            if not (v_code = any (v_seen)) then
                v_seen := v_seen || v_code;
                v_resolved := v_resolved || jsonb_build_array(jsonb_build_object('code', v_code, 'name', upper(v_code), 'role_id', null));
            end if;
        end if;
    end loop;

    if jsonb_array_length(v_resolved) = 0 then
        select * into v_gts from public.roles where slug = 'gts';
        v_resolved := jsonb_build_array(jsonb_build_object('code', 'gts', 'name', coalesce(v_gts.name, 'GTS'), 'role_id', v_gts.id));
    end if;

    v_is_initial := v_inc.assigned_to_user_id is null
        and not public._incident_is_tics(p_incident_id)
        and not exists (select 1 from public.incident_assigned_areas where incident_id = p_incident_id);

    select string_agg(area_name, ', ' order by id) into v_area_labels
    from public.incident_assigned_areas where incident_id = p_incident_id;

    v_previous_technician := coalesce(
        public._user_name(v_inc.assigned_to_user_id),
        case
            when public._incident_is_tics(p_incident_id) then 'TICS'
            when v_area_labels is not null then v_area_labels
            else 'Sin asignar'
        end
    );
    select name into v_previous_status from public.statuses where id = v_inc.status_id;

    select array_agg(e ->> 'name' order by n) into v_area_names
    from jsonb_array_elements(v_resolved) with ordinality as t(e, n);
    v_area_labels := array_to_string(v_area_names, ', ');

    -- A. NUEVA → ASIGNADA
    if v_status_code = 'NUEVA' then
        v_status_comment := v_comment;
        if v_status_comment is null then
            if p_technician_id is not null then
                v_status_comment := case
                    when v_user.id = v_tech.id then format('Incidencia tomada directamente por %s.', v_tech.name)
                    else format('Incidencia asignada a %s (%s).', v_tech.name, v_area_labels)
                end;
            elsif jsonb_array_length(v_resolved) = 1 and v_resolved -> 0 ->> 'code' = 'tics' then
                v_status_comment := 'Incidencia asignada al especialista TICS.';
            else
                v_status_comment := format('Incidencia asignada al área responsable %s.', v_area_labels);
            end if;
        end if;

        update public.incidents set status_id = public._status_id('ASIGNADA') where id = p_incident_id;
        perform public._log_action(p_incident_id, v_user.id, 'CAMBIO_ESTADO', 'status_id', v_previous_status,
            public._status_name('ASIGNADA'), v_status_comment);
    end if;

    -- B. Sincronizar áreas asignadas
    delete from public.incident_assigned_areas where incident_id = p_incident_id;
    for v_item in select * from jsonb_array_elements(v_resolved) loop
        insert into public.incident_assigned_areas (incident_id, area_code, area_name, role_id)
        values (p_incident_id, v_item ->> 'code', left(v_item ->> 'name', 100), nullif(v_item ->> 'role_id', '')::bigint);
    end loop;

    -- C. Columnas de la incidencia
    if p_technician_id is not null then
        update public.incidents
        set assigned_to_user_id = v_tech.id,
            assigned_specialist = null,
            assigned_at = coalesce(assigned_at, now())
        where id = p_incident_id;
    else
        update public.incidents
        set assigned_to_user_id = null,
            assigned_specialist = left(v_area_labels, 50),
            assigned_at = coalesce(assigned_at, now())
        where id = p_incident_id;
    end if;

    -- D. Auditoría de asignación / reasignación
    if p_technician_id is not null then
        v_audit_comment := coalesce(v_comment, case
            when v_is_initial and v_user.id = v_tech.id then
                format('El especialista %s tomó la responsabilidad técnica de la incidencia.', v_tech.name)
            when v_is_initial then
                format('Asignado a %s (%s) por %s.', v_tech.name, v_area_labels, v_user.name)
            else
                format('Reasignado de %s a %s (%s) por %s.', v_previous_technician, v_tech.name, v_area_labels, v_user.name)
        end);
        perform public._log_action(p_incident_id, v_user.id,
            case when v_is_initial then 'ASIGNADA' else 'REASIGNADA' end,
            'assigned_to_user_id', v_previous_technician, v_tech.name, v_audit_comment);
    else
        v_new_value := case
            when jsonb_array_length(v_resolved) = 1 and v_resolved -> 0 ->> 'code' = 'tics' then 'TICS'
            else v_area_labels
        end;
        v_audit_comment := coalesce(v_comment, case
            when v_is_initial then format('Asignado a %s por %s.', v_new_value, v_user.name)
            else format('Reasignado de %s a %s por %s.', v_previous_technician, v_new_value, v_user.name)
        end);
        perform public._log_action(p_incident_id, v_user.id,
            case when v_is_initial then 'ASIGNADA' else 'REASIGNADA' end,
            'assigned_specialist', v_previous_technician, v_new_value, v_audit_comment);
    end if;

    -- E. Notificaciones
    if p_technician_id is not null then
        perform public._notify_incident_assigned(p_incident_id, v_user.id, v_tech.id, not v_is_initial);
        v_message := case
            when v_user.id = v_tech.id then format('Has tomado la responsabilidad técnica de la incidencia %s.', v_inc.folio)
            else format('Incidencia %s asignada al especialista %s exitosamente.', v_inc.folio, v_tech.name)
        end;
    else
        v_message := format('Incidencia %s asignada exitosamente al área responsable: %s.', v_inc.folio,
            coalesce(nullif(v_area_labels, ''), 'las áreas seleccionadas'));
    end if;

    return jsonb_build_object('success', true, 'message', v_message, 'folio', v_inc.folio);
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Iniciar atención técnica (EN_ATENCION)
-- ---------------------------------------------------------------------
create or replace function public.incident_start_attention(p_incident_id bigint, p_comment text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_inc public.incidents%rowtype;
    v_role public.roles%rowtype;
    v_previous_status text;
    v_comment text := nullif(trim(coalesce(p_comment, '')), '');
begin
    select * into v_inc from public.incidents where id = p_incident_id for update;
    if not found then
        perform public._fail('La incidencia no existe.');
    end if;

    if not public.user_can(v_user.id, 'startAttention', p_incident_id) then
        perform public._deny();
    end if;

    select name into v_previous_status from public.statuses where id = v_inc.status_id;

    if v_inc.assigned_to_user_id is null and not public._incident_is_tics(p_incident_id) then
        update public.incidents
        set assigned_to_user_id = v_user.id, assigned_at = coalesce(assigned_at, now())
        where id = p_incident_id;

        select * into v_role from public.roles where id = v_user.role_id;
        if found and not exists (
            select 1 from public.incident_assigned_areas
            where incident_id = p_incident_id and lower(area_code) = lower(v_role.slug)
        ) then
            insert into public.incident_assigned_areas (incident_id, area_code, area_name, role_id)
            values (p_incident_id, v_role.slug, v_role.name, v_role.id)
            on conflict (incident_id, area_code) do nothing;
        end if;

        perform public._log_action(p_incident_id, v_user.id, 'ASIGNADA', 'assigned_to_user_id', 'Sin asignar', v_user.name,
            'Incidencia asumida directamente al iniciar atención técnica.');
    end if;

    update public.incidents
    set status_id = public._status_id('EN_ATENCION'), attended_at = now()
    where id = p_incident_id;

    perform public._log_action(p_incident_id, v_user.id, 'CAMBIO_ESTADO', 'status_id', v_previous_status,
        public._status_name('EN_ATENCION'),
        coalesce(v_comment, format('Atención técnica iniciada por el especialista %s.', v_user.name)));

    perform public._notify_attention_started(p_incident_id, v_user.id);

    return jsonb_build_object('message',
        format('Atención técnica iniciada. La incidencia %s se encuentra activamente EN ATENCIÓN.', v_inc.folio));
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Nota técnica de campo
-- ---------------------------------------------------------------------
create or replace function public.incident_add_note(p_incident_id bigint, p_note text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_note text := trim(coalesce(p_note, ''));
begin
    if not exists (select 1 from public.incidents where id = p_incident_id) then
        perform public._fail('La incidencia no existe.');
    end if;

    if not public.user_can(v_user.id, 'addNote', p_incident_id) then
        perform public._deny();
    end if;

    if v_note = '' then perform public._fail('El contenido de la nota técnica es obligatorio.'); end if;
    if char_length(v_note) < 5 then perform public._fail('La nota técnica debe contener al menos 5 caracteres.'); end if;
    if char_length(v_note) > 1000 then perform public._fail('La nota técnica no puede superar los 1000 caracteres.'); end if;

    perform public._log_action(p_incident_id, v_user.id, 'NOTA_TECNICA', null, null, null, v_note);
    perform public._notify_technical_note(p_incident_id, v_user.id, v_note);

    return jsonb_build_object('message', 'Nota técnica de campo registrada exitosamente en la bitácora.');
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Resolver (RESUELTA)
-- ---------------------------------------------------------------------
create or replace function public.incident_resolve(p_incident_id bigint, p_solution_description text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_inc public.incidents%rowtype;
    v_solution text := trim(coalesce(p_solution_description, ''));
    v_previous_status text;
begin
    select * into v_inc from public.incidents where id = p_incident_id for update;
    if not found then
        perform public._fail('La incidencia no existe.');
    end if;

    if not public.user_can(v_user.id, 'resolve', p_incident_id) then
        perform public._deny();
    end if;

    if v_solution = '' then perform public._fail('La descripción de la solución técnica aplicada es obligatoria.'); end if;
    if char_length(v_solution) < 15 then perform public._fail('La solución técnica debe contener al menos 15 caracteres descriptivos del arreglo realizado.'); end if;
    if char_length(v_solution) > 3000 then perform public._fail('La descripción de la solución no puede exceder los 3000 caracteres.'); end if;

    select name into v_previous_status from public.statuses where id = v_inc.status_id;

    update public.incidents
    set status_id = public._status_id('RESUELTA'), solution_description = v_solution, resolved_at = now()
    where id = p_incident_id;

    perform public._log_action(p_incident_id, v_user.id, 'CAMBIO_ESTADO', 'status_id', v_previous_status,
        public._status_name('RESUELTA'), format('Incidencia marcada como RESUELTA por el especialista %s.', v_user.name));
    perform public._log_action(p_incident_id, v_user.id, 'RESUELTA', 'solution_description', null, null, v_solution);

    perform public._notify_incident_resolved(p_incident_id, v_user.id);

    return jsonb_build_object('message',
        format('Incidencia %s resuelta exitosamente. Pendiente de validación y visto bueno por APOC.', v_inc.folio));
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Rechazar solución (regresa a EN_ATENCION)
-- ---------------------------------------------------------------------
create or replace function public.incident_reject_resolution(p_incident_id bigint, p_rejection_reason text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_inc public.incidents%rowtype;
    v_reason text := trim(coalesce(p_rejection_reason, ''));
    v_previous_status text;
begin
    select * into v_inc from public.incidents where id = p_incident_id for update;
    if not found then
        perform public._fail('La incidencia no existe.');
    end if;

    if not public.user_can(v_user.id, 'rejectResolution', p_incident_id) then
        perform public._deny();
    end if;

    if v_reason = '' then perform public._fail('Debe indicar el motivo por el cual la solución fue rechazada.'); end if;
    if char_length(v_reason) < 10 then perform public._fail('El motivo de rechazo debe contener al menos 10 caracteres explicando la persistencia de la falla.'); end if;
    if char_length(v_reason) > 1000 then perform public._fail('El motivo de rechazo no puede superar los 1000 caracteres.'); end if;

    select name into v_previous_status from public.statuses where id = v_inc.status_id;

    update public.incidents
    set status_id = public._status_id('EN_ATENCION'), rejection_reason = v_reason, resolved_at = null
    where id = p_incident_id;

    perform public._log_action(p_incident_id, v_user.id, 'CAMBIO_ESTADO', 'status_id', v_previous_status,
        public._status_name('EN_ATENCION'),
        format('Solución rechazada por %s (APOC). Incidencia reingresada a atención técnica.', v_user.name));
    perform public._log_action(p_incident_id, v_user.id, 'RECHAZO_SOLUCION', 'rejection_reason', null, null, v_reason);

    perform public._notify_resolution_rejected(p_incident_id, v_user.id, v_reason);

    return jsonb_build_object('message', format(
        'Solución de la incidencia %s rechazada. El expediente ha retornado al estado EN ATENCIÓN para nuevo diagnóstico por GTS.',
        v_inc.folio));
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Visto bueno y cierre definitivo (CERRADA)
-- ---------------------------------------------------------------------
create or replace function public.incident_close(p_incident_id bigint, p_comment text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_inc public.incidents%rowtype;
    v_comment text := nullif(trim(coalesce(p_comment, '')), '');
    v_previous_status text;
    v_closed_at timestamptz := now();
    v_tagged text := public.user_tagged_name(v_user.id);
begin
    select * into v_inc from public.incidents where id = p_incident_id for update;
    if not found then
        perform public._fail('La incidencia no existe.');
    end if;

    if not public.user_can(v_user.id, 'close', p_incident_id) then
        perform public._deny();
    end if;

    if v_comment is not null and char_length(v_comment) > 1000 then
        perform public._fail('Las observaciones de cierre no pueden exceder los 1000 caracteres.');
    end if;

    select name into v_previous_status from public.statuses where id = v_inc.status_id;

    update public.incidents
    set status_id = public._status_id('CERRADA'), closed_at = v_closed_at
    where id = p_incident_id;

    perform public._log_action(p_incident_id, v_user.id, 'CAMBIO_ESTADO', 'status_id', v_previous_status,
        public._status_name('CERRADA'),
        coalesce(v_comment, format('Visto bueno operacional otorgado por %s. Incidencia cerrada definitivamente.', v_tagged)));
    perform public._log_action(p_incident_id, v_user.id, 'CERRADA', 'closed_at', null,
        public._iso8601(v_closed_at),
        coalesce(v_comment, format('Expediente archivado en modo inmutable con visto bueno de %s.', v_tagged)));

    perform public._notify_incident_closed(p_incident_id, v_user.id);

    return jsonb_build_object('message', format(
        'Incidencia %s cerrada definitivamente con visto bueno de %s. Expediente archivado en modo inmutable.',
        v_inc.folio, v_tagged));
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Eliminación definitiva de expediente (Administrador / incidents.delete)
-- Los archivos físicos se eliminan desde el cliente con la API de Storage
-- (Supabase no permite borrar storage.objects con SQL); esta función purga
-- notificaciones, áreas, bitácora y adjuntos de la base de datos.
-- ---------------------------------------------------------------------
create or replace function public.incident_destroy(p_incident_id bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_folio text;
begin
    if not (public.user_is_admin(v_user.id) or public.user_has_permission(v_user.id, 'incidents.delete')) then
        perform public._deny('Acceso denegado: No posee permisos para eliminar incidencias.');
    end if;

    select folio into v_folio from public.incidents where id = p_incident_id;
    if v_folio is null then
        perform public._fail('La incidencia no existe.');
    end if;

    delete from public.notifications
    where data ->> 'folio' = v_folio or data ->> 'incident_id' = p_incident_id::text;

    perform set_config('gts.allow_history_rewrite', 'on', true);
    delete from public.incidents where id = p_incident_id;
    perform set_config('gts.allow_history_rewrite', 'off', true);

    return jsonb_build_object('folio', v_folio);
end;
$$;

-- Rutas de evidencias a eliminar antes de purgar el expediente
create or replace function public.incident_attachment_paths(p_incident_id bigint) returns text[]
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
begin
    if not (public.user_is_admin(v_user.id) or public.user_has_permission(v_user.id, 'incidents.delete')) then
        perform public._deny('Acceso denegado: No posee permisos para eliminar incidencias.');
    end if;

    return coalesce((select array_agg(stored_path) from public.incident_attachments where incident_id = p_incident_id), '{}')
        || coalesce((
            select array_agg(o.name) from storage.objects o
            where o.bucket_id = 'evidencias' and o.name like 'incidents/' || p_incident_id || '/%'
        ), '{}');
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: Notificaciones (NotificationController)
-- ---------------------------------------------------------------------
create or replace function public.notifications_mark_read(p_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
begin
    update public.notifications set read_at = coalesce(read_at, now())
    where id = p_id and user_id = v_user.id;

    return jsonb_build_object(
        'success', true,
        'unread_count', (select count(*) from public.notifications where user_id = v_user.id and read_at is null)
    );
end;
$$;

create or replace function public.notifications_mark_all_read() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
begin
    update public.notifications set read_at = now() where user_id = v_user.id and read_at is null;
    return jsonb_build_object('success', true, 'unread_count', 0);
end;
$$;
