-- =====================================================================
-- API de lectura (equivalente a los métodos index/show de los controladores
-- y a DashboardService, IndicatorService, ReportService y AuditService).
-- Las funciones SECURITY INVOKER respetan la visibilidad RLS de cada usuario
-- (scope forUserScope / visibleToUser del modelo Incident).
-- =====================================================================

-- Serializadores --------------------------------------------------------
create or replace function public._role_json(p_role_id bigint) returns jsonb
language sql stable as $$
    select case when r.id is null then null else jsonb_build_object(
        'id', r.id, 'name', r.name, 'slug', r.slug, 'description', r.description,
        'color', r.color, 'badge_bg', r.badge_bg, 'badge_text', r.badge_text,
        'badge_border', r.badge_border, 'is_protected', r.is_protected
    ) end
    from (select 1) d left join public.roles r on r.id = p_role_id
$$;

create or replace function public._user_json(p_user_id bigint) returns jsonb
language sql stable as $$
    select case when u.id is null then null else jsonb_build_object(
        'id', u.id, 'name', u.name, 'username', u.username, 'email', u.email,
        'badge_number', u.badge_number, 'is_active', u.is_active,
        'role_id', u.role_id, 'role', public._role_json(u.role_id),
        'role_tag', public.user_role_tag(u.id)
    ) end
    from (select 1) d left join public.users u on u.id = p_user_id
$$;

create or replace function public._incident_json(i public.incidents) returns jsonb
language sql stable as $$
    select jsonb_build_object(
        'id', i.id,
        'folio', i.folio,
        'title', i.title,
        'description', i.description,
        'location', i.location,
        'assigned_specialist', i.assigned_specialist,
        'solution_description', i.solution_description,
        'rejection_reason', i.rejection_reason,
        'reported_at', i.reported_at,
        'assigned_at', i.assigned_at,
        'attended_at', i.attended_at,
        'resolved_at', i.resolved_at,
        'closed_at', i.closed_at,
        'created_at', i.created_at,
        'updated_at', i.updated_at,
        'category', (select jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'icon', c.icon, 'color', c.color)
                     from public.categories c where c.id = i.category_id),
        'priority', (select jsonb_build_object('id', p.id, 'name', p.name, 'slug', p.slug, 'level', p.level,
                                               'color', p.color, 'sla_minutes', p.sla_minutes)
                     from public.priorities p where p.id = i.priority_id),
        'status', (select jsonb_build_object('id', s.id, 'code', s.code, 'name', s.name, 'step_order', s.step_order,
                                             'is_terminal', s.is_terminal, 'color', s.color)
                   from public.statuses s where s.id = i.status_id),
        'reported_by', public._user_json(i.reported_by_user_id),
        'assigned_to', public._user_json(i.assigned_to_user_id),
        'origin_group', public.user_origin_group(i.reported_by_user_id),
        'assigned_areas', coalesce((
            select jsonb_agg(jsonb_build_object(
                'id', a.id, 'area_code', a.area_code, 'area_name', a.area_name,
                'role_id', a.role_id, 'role', public._role_json(a.role_id)
            ) order by a.id)
            from public.incident_assigned_areas a where a.incident_id = i.id
        ), '[]')
    )
$$;

create or replace function public._paginate_meta(p_total bigint, p_page integer, p_per_page integer) returns jsonb
language sql immutable as $$
    select jsonb_build_object(
        'total', p_total,
        'per_page', p_per_page,
        'current_page', p_page,
        'last_page', greatest(1, ceil(p_total::numeric / p_per_page)::integer),
        'from', case when p_total = 0 then 0 else (p_page - 1) * p_per_page + 1 end,
        'to', least(p_total, p_page * p_per_page)
    )
$$;

-- Límites de fecha en la zona horaria institucional
create or replace function public._day_start(p_date date) returns timestamptz
language sql stable as $$ select (p_date::timestamp) at time zone public.app_tz() $$;

create or replace function public._day_end(p_date date) returns timestamptz
language sql stable as $$ select ((p_date + 1)::timestamp at time zone public.app_tz()) - interval '1 microsecond' $$;

create or replace function public._today() returns date
language sql stable as $$ select (now() at time zone public.app_tz())::date $$;

create or replace function public._month_name(p_month integer) returns text
language sql immutable as $$
    select (array['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
                  'septiembre', 'octubre', 'noviembre', 'diciembre'])[p_month]
$$;

create or replace function public._fmt_date(p_date date) returns text
language sql immutable as $$ select to_char(p_date, 'DD/MM/YYYY') $$;

-- Minutos entre dos marcas (Carbon::diffInMinutes con fracción)
create or replace function public._minutes_between(p_from timestamptz, p_to timestamptz) returns numeric
language sql immutable as $$ select abs(extract(epoch from (p_to - p_from)) / 60.0) $$;

-- Término de búsqueda (Incident::scopeSearch)
create or replace function public._incident_matches_search(i public.incidents, p_term text) returns boolean
language sql stable as $$
    select p_term is null or p_term = '' or (
        i.folio ilike '%' || p_term || '%'
        or i.title ilike '%' || p_term || '%'
        or i.location ilike '%' || p_term || '%'
        or i.description ilike '%' || p_term || '%'
        or exists (select 1 from public.categories c where c.id = i.category_id and c.name ilike '%' || p_term || '%')
        or exists (select 1 from public.users u where u.id = i.reported_by_user_id
                   and (u.name ilike '%' || p_term || '%' or coalesce(u.badge_number, '') ilike '%' || p_term || '%'))
        or exists (select 1 from public.users u where u.id = i.assigned_to_user_id and u.name ilike '%' || p_term || '%')
        or exists (select 1 from public.incident_assigned_areas a where a.incident_id = i.id
                   and (a.area_name ilike '%' || p_term || '%' or a.area_code ilike '%' || p_term || '%'))
        or coalesce(i.assigned_specialist, '') ilike '%' || p_term || '%'
    )
$$;

create or replace function public._status_code_of(p_status_id bigint) returns text
language sql stable as $$ select code from public.statuses where id = p_status_id $$;

create or replace function public._priority_slug_of(p_priority_id bigint) returns text
language sql stable as $$ select slug from public.priorities where id = p_priority_id $$;

create or replace function public._jbigint(p_filters jsonb, p_key text) returns bigint
language sql immutable as $$
    select case when coalesce(p_filters ->> p_key, '') ~ '^[0-9]+$' then (p_filters ->> p_key)::bigint else null end
$$;

create or replace function public._jtext(p_filters jsonb, p_key text) returns text
language sql immutable as $$ select nullif(trim(coalesce(p_filters ->> p_key, '')), '') $$;

create or replace function public._jdate(p_filters jsonb, p_key text) returns date
language sql immutable as $$
    select case when coalesce(p_filters ->> p_key, '') ~ '^\d{4}-\d{2}-\d{2}$' then (p_filters ->> p_key)::date else null end
$$;

-- ---------------------------------------------------------------------
-- Sesión: perfil, permisos y alcances del usuario autenticado
-- ---------------------------------------------------------------------
create or replace function public.app_bootstrap() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype;
    v_admin boolean;
begin
    if auth.uid() is null then
        return null;
    end if;

    select * into v_user from public.users where auth_id = auth.uid();
    if not found then
        return null;
    end if;

    if not v_user.is_active then
        return jsonb_build_object('user', jsonb_build_object('id', v_user.id, 'is_active', false));
    end if;

    v_admin := public.user_is_admin(v_user.id);

    return jsonb_build_object(
        'user', public._user_json(v_user.id),
        'role_tag', public.user_role_tag(v_user.id),
        'tagged_name', public.user_tagged_name(v_user.id),
        'permissions', case
            when v_admin then coalesce((select jsonb_agg(slug order by slug) from public.permissions), '[]')
            else coalesce((
                select jsonb_agg(p.slug order by p.slug)
                from public.role_permissions rp join public.permissions p on p.id = rp.permission_id
                where rp.role_id = v_user.role_id
            ), '[]')
        end,
        'flags', jsonb_build_object(
            'is_admin', v_admin,
            'is_gts', public.user_is_gts(v_user.id),
            'is_apoc', public.user_is_apoc(v_user.id),
            'is_apoc_cco', public.user_is_apoc_cco(v_user.id),
            'is_apoc_csa', public.user_is_apoc_csa(v_user.id)
        ),
        'scopes', jsonb_build_object(
            'view', to_jsonb(public.user_scope_role_ids(v_user.id, 'view')),
            'attend', to_jsonb(public.user_scope_role_ids(v_user.id, 'attend')),
            'assign', to_jsonb(public.user_scope_role_ids(v_user.id, 'assign'))
        )
    );
end;
$$;

-- Catálogos para selectores de formularios y filtros
create or replace function public.app_lookups() returns jsonb
language sql stable as $$
    select jsonb_build_object(
        'categories', coalesce((select jsonb_agg(to_jsonb(c) order by c.name) from public.categories c where c.is_active), '[]'),
        'all_categories', coalesce((select jsonb_agg(to_jsonb(c) order by c.name) from public.categories c), '[]'),
        'priorities', coalesce((select jsonb_agg(to_jsonb(p) order by p.level) from public.priorities p where p.is_active), '[]'),
        'statuses', coalesce((select jsonb_agg(to_jsonb(s) order by s.step_order) from public.statuses s), '[]')
    )
$$;

-- Centro de notificaciones (componente notifications-dropdown)
create or replace function public.notifications_list() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_items jsonb;
begin
    select coalesce(jsonb_agg(jsonb_build_object(
        'id', n.id, 'data', n.data, 'read_at', n.read_at, 'created_at', n.created_at
    ) order by n.created_at desc), '[]')
    into v_items
    from (
        select * from public.notifications n
        where n.user_id = v_user.id
          and (n.data ->> 'folio' is null or exists (select 1 from public.incidents i where i.folio = n.data ->> 'folio'))
        order by n.created_at desc
        limit 15
    ) n;

    return jsonb_build_object(
        'notifications', v_items,
        'unread_count', (select count(*) from jsonb_array_elements(v_items) e where e ->> 'read_at' is null)
    );
end;
$$;

-- ---------------------------------------------------------------------
-- Listado de incidencias (IncidentController@index / @myIncidents)
-- p_mode: 'all' (Todas las incidencias) | 'my' (Mis incidencias)
-- ---------------------------------------------------------------------
create or replace function public.incidents_list(
    p_filters jsonb default '{}',
    p_mode text default 'all',
    p_page integer default 1,
    p_per_page integer default 15
) returns jsonb
language plpgsql stable as $$
declare
    v_uid bigint := public.current_user_id();
    v_filters jsonb := coalesce(p_filters, '{}');
    v_is_admin boolean;
    v_is_gts boolean;
    v_is_apoc boolean;
    v_attend boolean;
    v_search text;
    v_status bigint;
    v_priority bigint;
    v_category bigint;
    v_assigned bigint;
    v_reported bigint;
    v_metric_assigned bigint;
    v_metric_reported bigint;
    v_page integer := greatest(coalesce(p_page, 1), 1);
    v_per_page integer := least(greatest(coalesce(p_per_page, 15), 1), 100);
    v_total bigint;
    v_rows jsonb;
    v_metrics jsonb;
begin
    if v_uid is null then
        raise exception 'No autenticado.' using errcode = '42501';
    end if;
    if not public.user_can_view_any_incident(v_uid) then
        raise exception 'Esta acción no está autorizada.' using errcode = '42501';
    end if;

    v_is_admin := public.user_is_admin(v_uid);
    v_is_gts := public.user_is_gts(v_uid);
    v_is_apoc := public.user_is_apoc(v_uid);
    v_attend := public.user_has_permission(v_uid, 'incidents.attend');

    if p_mode = 'my' then
        if v_is_gts or (v_attend and not v_is_admin and not v_is_apoc) then
            v_filters := v_filters || jsonb_build_object('assigned_to', v_uid::text);
        elsif v_is_apoc or (not v_is_admin and not v_attend) then
            v_filters := v_filters || jsonb_build_object('reported_by', v_uid::text);
        elsif v_is_admin and not (v_filters ? 'assigned_to') and not (v_filters ? 'reported_by') then
            v_filters := v_filters || jsonb_build_object('reported_by', v_uid::text);
        end if;
    end if;

    if v_filters ? 'assigned_to' and v_is_apoc then
        raise exception 'Acceso denegado: El perfil APOC no tiene asignaciones técnicas.' using errcode = '42501';
    end if;

    v_search := public._jtext(v_filters, 'search');
    v_status := public._jbigint(v_filters, 'status_id');
    v_priority := public._jbigint(v_filters, 'priority_id');
    v_category := public._jbigint(v_filters, 'category_id');
    v_assigned := public._jbigint(v_filters, 'assigned_to');
    v_reported := public._jbigint(v_filters, 'reported_by');

    select count(*) into v_total
    from public.incidents i
    where public._incident_matches_search(i, v_search)
      and (v_status is null or i.status_id = v_status)
      and (v_priority is null or i.priority_id = v_priority)
      and (v_category is null or i.category_id = v_category)
      and (v_assigned is null or i.assigned_to_user_id = v_assigned)
      and (v_reported is null or i.reported_by_user_id = v_reported);

    select coalesce(jsonb_agg(public._incident_json(inc) order by q.ord, inc.created_at desc, inc.id desc), '[]')
    into v_rows
    from (
        select i.id, case when s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION') then 1 else 2 end as ord
        from public.incidents i
        join public.statuses s on s.id = i.status_id
        where public._incident_matches_search(i, v_search)
          and (v_status is null or i.status_id = v_status)
          and (v_priority is null or i.priority_id = v_priority)
          and (v_category is null or i.category_id = v_category)
          and (v_assigned is null or i.assigned_to_user_id = v_assigned)
          and (v_reported is null or i.reported_by_user_id = v_reported)
        order by ord, i.created_at desc, i.id desc
        limit v_per_page offset (v_page - 1) * v_per_page
    ) q
    join public.incidents inc on inc.id = q.id;

    -- Telemetría de guardia (baseMetricsQuery)
    if p_mode = 'my' then
        if (v_is_gts or v_attend) and v_assigned is not null then
            v_metric_assigned := v_assigned;
        elsif v_reported is not null then
            v_metric_reported := v_reported;
        end if;
    end if;

    select jsonb_build_object(
        'total', count(*),
        'nuevas', count(*) filter (where s.code = 'NUEVA'),
        'en_atencion', count(*) filter (where s.code = 'EN_ATENCION'),
        'criticas', count(*) filter (where p.slug = 'critica' and not s.is_terminal),
        'resueltas', count(*) filter (where s.code = 'RESUELTA')
    )
    into v_metrics
    from public.incidents i
    join public.statuses s on s.id = i.status_id
    join public.priorities p on p.id = i.priority_id
    where (v_metric_assigned is null or i.assigned_to_user_id = v_metric_assigned)
      and (v_metric_reported is null or i.reported_by_user_id = v_metric_reported);

    return jsonb_build_object(
        'data', v_rows,
        'meta', public._paginate_meta(v_total, v_page, v_per_page),
        'metrics', v_metrics,
        'filters', v_filters
    );
end;
$$;

-- ---------------------------------------------------------------------
-- Expediente de una incidencia (IncidentController@show)
-- ---------------------------------------------------------------------
create or replace function public._incident_exists(p_folio text) returns boolean
language sql stable security definer set search_path = public as $$
    select exists (select 1 from public.incidents where folio = p_folio)
$$;

create or replace function public.incident_detail(p_folio text) returns jsonb
language plpgsql stable as $$
declare
    v_uid bigint := public.current_user_id();
    v_inc public.incidents%rowtype;
    v_abilities jsonb;
    v_closer jsonb;
begin
    if v_uid is null then
        raise exception 'No autenticado.' using errcode = '42501';
    end if;

    select * into v_inc from public.incidents where folio = p_folio;
    if not found then
        if public._incident_exists(p_folio) then
            raise exception 'Esta acción no está autorizada.' using errcode = '42501';
        end if;
        raise exception 'La incidencia solicitada no existe.' using errcode = 'P0002';
    end if;

    v_abilities := public.incident_abilities(v_uid, v_inc.id);
    if not coalesce((v_abilities ->> 'view')::boolean, false) then
        raise exception 'Esta acción no está autorizada.' using errcode = '42501';
    end if;

    select jsonb_build_object('tagged_name', public.user_tagged_name(h.user_id), 'role_tag', public.user_role_tag(h.user_id))
    into v_closer
    from public.incident_histories h
    where h.incident_id = v_inc.id and h.action = 'CERRADA'
    order by h.created_at, h.id
    limit 1;

    return public._incident_json(v_inc) || jsonb_build_object(
        'is_assigned_to_tics', public._incident_is_tics(v_inc.id),
        'abilities', v_abilities,
        'closer', v_closer,
        'histories', coalesce((
            select jsonb_agg(jsonb_build_object(
                'id', h.id, 'action', h.action, 'field_name', h.field_name,
                'old_value', h.old_value, 'new_value', h.new_value, 'comment', h.comment,
                'created_at', h.created_at,
                'user', case when h.user_id is null then null else jsonb_build_object(
                    'id', h.user_id, 'name', public._user_name(h.user_id),
                    'role_tag', public.user_role_tag(h.user_id),
                    'tagged_name', public.user_tagged_name(h.user_id),
                    'role', public._role_json((select role_id from public.users where id = h.user_id))
                ) end
            ) order by h.created_at, h.id)
            from public.incident_histories h where h.incident_id = v_inc.id
        ), '[]'),
        'attachments', coalesce((
            select jsonb_agg(jsonb_build_object(
                'id', a.id, 'original_filename', a.original_filename, 'stored_path', a.stored_path,
                'mime_type', a.mime_type, 'file_size_bytes', a.file_size_bytes, 'created_at', a.created_at,
                'uploaded_by', jsonb_build_object('id', a.uploaded_by_user_id, 'name', public._user_name(a.uploaded_by_user_id))
            ) order by a.id)
            from public.incident_attachments a where a.incident_id = v_inc.id
        ), '[]'),
        'available_areas', case when (v_abilities ->> 'assign')::boolean
            then public.incident_assignable_areas(v_uid, v_inc.id) else '[]'::jsonb end,
        'available_technicians', case when (v_abilities ->> 'assign')::boolean
            then public.incident_available_technicians(v_uid, v_inc.id) else '[]'::jsonb end
    );
end;
$$;

-- Formulario de nueva incidencia (IncidentController@create)
create or replace function public.incident_create_form() returns jsonb
language plpgsql stable as $$
declare
    v_uid bigint := public.current_user_id();
begin
    if v_uid is null then
        raise exception 'No autenticado.' using errcode = '42501';
    end if;
    if not (public.user_is_admin(v_uid) or public.user_has_permission(v_uid, 'incidents.create')) then
        raise exception 'Esta acción no está autorizada.' using errcode = '42501';
    end if;

    return jsonb_build_object(
        'preliminary_folio', public.folio_preview(),
        'categories', coalesce((select jsonb_agg(to_jsonb(c) order by c.name) from public.categories c where c.is_active), '[]'),
        'priorities', coalesce((select jsonb_agg(to_jsonb(p) order by p.level) from public.priorities p where p.is_active), '[]')
    );
end;
$$;

-- ---------------------------------------------------------------------
-- Dashboard operativo (DashboardService)
-- ---------------------------------------------------------------------
create or replace function public.dashboard_recent_incidents(p_limit integer default 6) returns jsonb
language sql stable as $$
    select coalesce(jsonb_agg(public._incident_json(i) order by i.created_at desc, i.id desc), '[]')
    from (
        select * from public.incidents order by created_at desc, id desc limit greatest(coalesce(p_limit, 6), 1)
    ) i
$$;

create or replace function public.dashboard_data(p_period text default 'today') returns jsonb
language plpgsql stable as $$
declare
    v_uid bigint := public.current_user_id();
    v_period text := case when p_period in ('today', '24h', 'week') then p_period else 'today' end;
    v_start timestamptz;
    v_end timestamptz;
    v_metrics jsonb;
    v_mttr integer;
    v_count bigint;
    v_sum numeric;
    v_distribution jsonb;
    v_total_active bigint;
    v_priorities jsonb;
    v_technicians bigint;
    v_assignable bigint[];
    v_hour integer;
    v_systems jsonb;
    v_cat_total bigint;
    v_cat_active bigint;
    v_pct numeric;
begin
    if v_uid is null then
        raise exception 'No autenticado.' using errcode = '42501';
    end if;

    if v_period = '24h' then
        v_start := now() - interval '24 hours';
        v_end := now();
    elsif v_period = 'week' then
        v_start := public._day_start(public._today() - 7);
        v_end := public._day_end(public._today());
    else
        v_start := public._day_start(public._today());
        v_end := public._day_end(public._today());
    end if;

    -- MTTR
    select count(*), sum(public._minutes_between(i.created_at, i.resolved_at))
    into v_count, v_sum
    from public.incidents i
    where i.resolved_at is not null and i.resolved_at between v_start and v_end;

    if v_count > 0 then
        v_mttr := round(v_sum / v_count);
    else
        select count(*), sum(public._minutes_between(x.created_at, x.resolved_at))
        into v_count, v_sum
        from (select created_at, resolved_at from public.incidents where resolved_at is not null limit 20) x;
        v_mttr := case when v_count > 0 then round(v_sum / v_count) else 18 end;
    end if;

    select jsonb_build_object(
        'period', v_period,
        'total', count(*),
        'new', count(*) filter (where s.code = 'NUEVA'),
        'in_process', count(*) filter (where s.code in ('ASIGNADA', 'EN_ATENCION')),
        'resolved', count(*) filter (where s.code in ('RESUELTA', 'CERRADA')),
        'critical', count(*) filter (where s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION') and p.slug = 'critica'),
        'total_open', count(*) filter (where s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION')),
        'open_critical', count(*) filter (where s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION') and p.slug = 'critica'),
        'open_high', count(*) filter (where s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION') and p.slug = 'alta'),
        'in_attention', count(*) filter (where s.code = 'EN_ATENCION'),
        'resolved_in_period', count(*) filter (where s.code in ('RESUELTA', 'CERRADA') and i.resolved_at between v_start and v_end),
        'pending_vobo', count(*) filter (where s.code = 'RESUELTA'),
        'mttr_minutes', v_mttr,
        'mttr_within_target', v_mttr <= 25
    )
    into v_metrics
    from public.incidents i
    join public.statuses s on s.id = i.status_id
    join public.priorities p on p.id = i.priority_id;

    -- Distribución por categoría (incidencias activas)
    select count(*) into v_total_active
    from public.incidents i join public.statuses s on s.id = i.status_id
    where s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION');

    select coalesce(jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'slug', c.slug, 'icon', coalesce(c.icon, 'category'),
        'color', coalesce(c.color, '#06B6D4'), 'count', x.cnt,
        'percentage', case when v_total_active > 0 then round(x.cnt::numeric / v_total_active * 100) else 0 end
    ) order by c.id), '[]')
    into v_distribution
    from public.categories c
    cross join lateral (
        select count(*) as cnt from public.incidents i join public.statuses s on s.id = i.status_id
        where i.category_id = c.id and s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION')
    ) x
    where c.is_active;

    -- Desglose por prioridad (activas)
    select coalesce(jsonb_agg(jsonb_build_object(
        'name', p.name, 'slug', p.slug, 'level', p.level, 'count', x.cnt,
        'percentage', case when v_total_active > 0 then round(x.cnt::numeric / v_total_active * 100) else 0 end
    ) order by p.level desc), '[]')
    into v_priorities
    from public.priorities p
    cross join lateral (
        select count(*) as cnt from public.incidents i join public.statuses s on s.id = i.status_id
        where i.priority_id = p.id and s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION')
    ) x;

    -- Técnicos activos
    v_assignable := public.user_scope_role_ids(v_uid, 'assign');
    if not public.user_is_admin(v_uid) and cardinality(v_assignable) > 0 then
        select count(*) into v_technicians from public.users where role_id = any (v_assignable) and is_active;
    else
        select count(*) into v_technicians
        from public.users u join public.roles r on r.id = u.role_id
        where r.slug = 'gts' and u.is_active;
    end if;

    v_hour := extract(hour from (now() at time zone public.app_tz()))::integer;

    -- Salud de sistemas (catálogo)
    select count(*), count(*) filter (where status = 'ACTIVO') into v_cat_total, v_cat_active from public.categories;
    v_pct := case when v_cat_total > 0 then round(v_cat_active::numeric / v_cat_total * 100, 1) else 0 end;

    v_systems := jsonb_build_object(
        'total', v_cat_total,
        'active', v_cat_active,
        'percentage', v_pct,
        'state', case when v_cat_total = 0 then null when v_pct >= 95 then 'ÓPTIMO' when v_pct >= 80 then 'INTERMITENTE' else 'CRÍTICO' end,
        'color', case when v_cat_total = 0 then '#707B8A' when v_pct >= 95 then '#20C997' when v_pct >= 80 then '#E0A21A' else '#D83B52' end,
        'badge_bg', case when v_cat_total = 0 then 'rgba(112, 123, 138, 0.15)' when v_pct >= 95 then 'rgba(32, 201, 151, 0.15)'
                         when v_pct >= 80 then 'rgba(224, 162, 26, 0.15)' else 'rgba(216, 59, 82, 0.15)' end,
        'badge_border', case when v_cat_total = 0 then 'rgba(112, 123, 138, 0.3)' when v_pct >= 95 then 'rgba(32, 201, 151, 0.3)'
                             when v_pct >= 80 then 'rgba(224, 162, 26, 0.3)' else 'rgba(216, 59, 82, 0.3)' end,
        'systems', coalesce((
            select jsonb_agg(jsonb_build_object(
                'id', c.id, 'name', c.name, 'code', c.code, 'icon', coalesce(nullif(c.icon, ''), 'hub'),
                'status', coalesce(nullif(c.status, ''), case when c.is_active then 'ACTIVO' else 'INACTIVO' end),
                'status_label', case c.status when 'INACTIVO' then 'Inactivo' when 'FUERA DE SERVICIO' then 'Fuera de servicio' else 'Operativo' end,
                'status_color', case c.status when 'INACTIVO' then '#E0A21A' when 'FUERA DE SERVICIO' then '#D83B52' else '#20C997' end
            ) order by c.name)
            from public.categories c
        ), '[]')
    );

    return jsonb_build_object(
        'metrics', v_metrics,
        'recent_incidents', public.dashboard_recent_incidents(6),
        'immediate_attention', coalesce((
            select jsonb_agg(public._incident_json(inc) order by q.level desc, inc.created_at asc)
            from (
                select i.id, p.level from public.incidents i
                join public.statuses s on s.id = i.status_id
                join public.priorities p on p.id = i.priority_id
                where s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION') and p.slug in ('critica', 'alta')
                order by p.level desc, i.created_at asc
                limit 3
            ) q
            join public.incidents inc on inc.id = q.id
        ), '[]'),
        'distribution', jsonb_build_object('total_active', v_total_active, 'categories', v_distribution),
        'active_technicians', v_technicians,
        'current_shift', case when v_hour >= 7 and v_hour < 19
            then jsonb_build_object('name', 'Guardia A (07:00 - 19:00)', 'label', 'Diurna', 'type', 'A')
            else jsonb_build_object('name', 'Guardia B (19:00 - 07:00)', 'label', 'Nocturna', 'type', 'B') end,
        'priorities_summary', jsonb_build_object('total', v_total_active, 'items', v_priorities),
        'recent_activities', coalesce((
            select jsonb_agg(jsonb_build_object(
                'id', h.id, 'action', h.action, 'comment', h.comment, 'created_at', h.created_at,
                'incident', jsonb_build_object('id', h.incident_id, 'folio', (select folio from public.incidents where id = h.incident_id)),
                'user', jsonb_build_object('id', h.user_id, 'name', public._user_name(h.user_id))
            ) order by h.id desc)
            from (select * from public.incident_histories order by id desc limit 4) h
        ), '[]'),
        'systems_health', v_systems
    );
end;
$$;

-- ---------------------------------------------------------------------
-- Indicadores (IndicatorService)
-- ---------------------------------------------------------------------
create or replace function public.indicators_data(p_filters jsonb default '{}') returns jsonb
language plpgsql volatile as $$
declare
    v_uid bigint := public.current_user_id();
    v_preset text := coalesce(public._jtext(p_filters, 'period_preset'), 'week');
    v_from date := public._jdate(p_filters, 'date_from');
    v_to date := public._jdate(p_filters, 'date_to');
    v_category bigint := public._jbigint(p_filters, 'category_id');
    v_start timestamptz;
    v_end timestamptz;
    v_label text;
    v_total bigint;
    v_by_status jsonb := '{}';
    v_by_priority jsonb := '{}';
    v_open bigint;
    v_resolved bigint;
    v_rec record;
    v_count bigint;
    v_sum numeric;
    v_mttr integer := 0;
    v_mtta integer := 0;
    v_resolved_sample bigint;
    v_attended_sample bigint;
    v_health jsonb;
    v_assets bigint;
    v_active_assets bigint;
begin
    if v_uid is null then
        raise exception 'No autenticado.' using errcode = '42501';
    end if;

    if v_from is not null and v_to is not null then
        v_start := public._day_start(v_from);
        v_end := public._day_end(v_to);
        v_label := public._fmt_date(v_from) || ' - ' || public._fmt_date(v_to);
    elsif v_preset = 'today' then
        v_start := public._day_start(public._today());
        v_end := public._day_end(public._today());
        v_label := 'Hoy (' || public._fmt_date(public._today()) || ')';
    elsif v_preset = 'month' then
        v_start := public._day_start(date_trunc('month', public._today())::date);
        v_end := public._day_end((date_trunc('month', public._today()) + interval '1 month - 1 day')::date);
        v_label := 'Mes en curso (' || public._month_name(extract(month from public._today())::integer) || ' '
            || extract(year from public._today())::integer || ')';
    elsif v_preset = 'all' then
        v_label := 'Histórico Completo';
    else
        v_start := public._day_start(public._today() - 7);
        v_end := public._day_end(public._today());
        v_label := 'Últimos 7 días';
    end if;

    create temporary table if not exists _ind_scope (id bigint, status_code text, is_terminal boolean, priority_slug text,
        category_id bigint, created_at timestamptz, resolved_at timestamptz, attended_at timestamptz, assigned_at timestamptz)
        on commit drop;
    truncate _ind_scope;

    insert into _ind_scope
    select i.id, s.code, s.is_terminal, p.slug, i.category_id, i.created_at, i.resolved_at, i.attended_at, i.assigned_at
    from public.incidents i
    join public.statuses s on s.id = i.status_id
    join public.priorities p on p.id = i.priority_id
    where (v_start is null or i.created_at between v_start and v_end)
      and (v_category is null or i.category_id = v_category);

    select count(*) into v_total from _ind_scope;

    for v_rec in select * from public.statuses order by step_order loop
        select count(*) into v_count from _ind_scope where status_code = v_rec.code;
        v_by_status := v_by_status || jsonb_build_object(v_rec.code, jsonb_build_object(
            'name', v_rec.name, 'count', v_count,
            'percentage', case when v_total > 0 then round(v_count::numeric / v_total * 100, 1) else 0 end,
            'is_terminal', v_rec.is_terminal,
            'step_order', v_rec.step_order
        ));
    end loop;

    v_open := coalesce((v_by_status -> 'NUEVA' ->> 'count')::bigint, 0)
        + coalesce((v_by_status -> 'ASIGNADA' ->> 'count')::bigint, 0)
        + coalesce((v_by_status -> 'EN_ATENCION' ->> 'count')::bigint, 0);
    v_resolved := coalesce((v_by_status -> 'RESUELTA' ->> 'count')::bigint, 0)
        + coalesce((v_by_status -> 'CERRADA' ->> 'count')::bigint, 0);

    for v_rec in select * from public.priorities order by level loop
        select count(*) into v_count from _ind_scope where priority_slug = v_rec.slug;
        v_by_priority := v_by_priority || jsonb_build_object(v_rec.slug, jsonb_build_object(
            'name', v_rec.name, 'count', v_count,
            'percentage', case when v_total > 0 then round(v_count::numeric / v_total * 100, 1) else 0 end,
            'level', v_rec.level,
            'color', case v_rec.slug when 'critica' then '#EF4444' when 'alta' then '#F97316'
                                     when 'media' then '#10B981' when 'baja' then '#3B82F6' else '#94A3B8' end
        ));
    end loop;

    select count(*), sum(public._minutes_between(created_at, resolved_at)) into v_resolved_sample, v_sum
    from _ind_scope where resolved_at is not null;
    if v_resolved_sample > 0 then
        v_mttr := round(v_sum / v_resolved_sample);
    end if;

    select count(*), sum(public._minutes_between(created_at, coalesce(attended_at, assigned_at))) into v_attended_sample, v_sum
    from _ind_scope where attended_at is not null or assigned_at is not null;
    if v_attended_sample > 0 then
        v_mtta := round(v_sum / v_attended_sample);
    end if;

    select count(*), count(*) filter (where status = 'ACTIVO') into v_assets, v_active_assets from public.categories;

    select coalesce(jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'code', c.code, 'slug', c.slug,
        'icon', coalesce(nullif(c.icon, ''), 'hub'), 'color', coalesce(nullif(c.color, ''), '#3D82C6'),
        'location', c.location, 'status', coalesce(nullif(c.status, ''), 'ACTIVO'),
        'total_incidents', x.total, 'open_incidents', x.open, 'resolved_incidents', x.closed,
        'health_state', case
            when c.status in ('FUERA DE SERVICIO', 'INACTIVO') then 'down'
            when c.status = 'ACTIVO' and x.open > 0 then 'degraded'
            else 'optimal' end,
        'health_label', case
            when c.status in ('FUERA DE SERVICIO', 'INACTIVO') then 'Fuera de Servicio'
            when c.status = 'ACTIVO' and x.open > 0 then 'Con Incidencias'
            else 'Óptimo 100%' end
    ) order by c.name), '[]')
    into v_health
    from public.categories c
    cross join lateral (
        select count(*) as total,
               count(*) filter (where not is_terminal) as open,
               count(*) filter (where is_terminal) as closed
        from _ind_scope s where s.category_id = c.id
    ) x;

    return jsonb_build_object(
        'period_label', v_label,
        'preset', v_preset,
        'date_from', p_filters ->> 'date_from',
        'date_to', p_filters ->> 'date_to',
        'category_id', v_category,
        'total', v_total,
        'open_count', v_open,
        'resolved_count', v_resolved,
        'resolution_rate', case when v_total > 0 then round(v_resolved::numeric / v_total * 100, 1) else 0 end,
        'by_status', v_by_status,
        'by_priority', v_by_priority,
        'mttr_minutes', v_mttr,
        'mttr_target', 25,
        'mttr_within_target', v_resolved_sample > 0 and v_mttr <= 25,
        'resolved_sample_count', v_resolved_sample,
        'mtta_minutes', v_mtta,
        'mtta_target', 10,
        'mtta_within_target', v_attended_sample > 0 and v_mtta <= 10,
        'attended_sample_count', v_attended_sample,
        'infrastructure_health', v_health,
        'global_availability', case when v_assets > 0 then round(v_active_assets::numeric / v_assets * 100, 1) else 100.0 end,
        'total_assets', v_assets,
        'active_assets', v_active_assets,
        'categories', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name) order by name) from public.categories), '[]')
    );
end;
$$;

-- ---------------------------------------------------------------------
-- Reportes (ReportService::buildQuery / calculateSummary / getFilterLabels)
-- ---------------------------------------------------------------------
create or replace function public._report_matches(i public.incidents, p_filters jsonb) returns boolean
language plpgsql stable as $$
declare
    v_search text := coalesce(public._jtext(p_filters, 'search'), '');
    v_folio text := public._jtext(p_filters, 'folio');
    v_is_specific boolean;
    v_preset text := public._jtext(p_filters, 'period_preset');
    v_from date := public._jdate(p_filters, 'date_from');
    v_to date := public._jdate(p_filters, 'date_to');
    v_type text := public._jtext(p_filters, 'report_type');
    v_status_code text;
    v_terminal boolean;
    v_priority_slug text;
begin
    v_is_specific := v_folio is not null or v_search ~* '^INC-\d{4}-\d+';

    if not v_is_specific and v_preset is not null and v_from is null and v_to is null then
        if v_preset = 'today' then
            if i.created_at not between public._day_start(public._today()) and public._day_end(public._today()) then return false; end if;
        elsif v_preset in ('last_7_days', 'week') then
            if i.created_at not between public._day_start(public._today() - 7) and public._day_end(public._today()) then return false; end if;
        elsif v_preset in ('this_month', 'month') then
            if i.created_at not between public._day_start(date_trunc('month', public._today())::date)
                and public._day_end((date_trunc('month', public._today()) + interval '1 month - 1 day')::date) then return false; end if;
        end if;
    end if;

    if v_from is not null and i.created_at < public._day_start(v_from) then return false; end if;
    if v_to is not null and i.created_at > public._day_end(v_to) then return false; end if;
    if public._jbigint(p_filters, 'status_id') is not null and i.status_id <> public._jbigint(p_filters, 'status_id') then return false; end if;
    if public._jbigint(p_filters, 'priority_id') is not null and i.priority_id <> public._jbigint(p_filters, 'priority_id') then return false; end if;
    if public._jbigint(p_filters, 'category_id') is not null and i.category_id <> public._jbigint(p_filters, 'category_id') then return false; end if;
    if public._jbigint(p_filters, 'assigned_to') is not null and i.assigned_to_user_id is distinct from public._jbigint(p_filters, 'assigned_to') then return false; end if;
    if public._jbigint(p_filters, 'reported_by') is not null and i.reported_by_user_id <> public._jbigint(p_filters, 'reported_by') then return false; end if;

    if v_type is not null then
        select s.code, s.is_terminal into v_status_code, v_terminal from public.statuses s where s.id = i.status_id;
        v_priority_slug := public._priority_slug_of(i.priority_id);
        if v_type = 'critical' and v_priority_slug <> 'critica' then return false; end if;
        if v_type = 'high' and v_priority_slug <> 'alta' then return false; end if;
        if v_type = 'open' and v_terminal then return false; end if;
        if v_type = 'resolved' and v_status_code not in ('RESUELTA', 'CERRADA') then return false; end if;
    end if;

    if v_folio is not null then
        return i.folio = upper(v_folio);
    elsif v_search <> '' then
        if v_is_specific then
            return i.folio = upper(v_search);
        end if;
        return public._incident_matches_search(i, v_search);
    end if;

    return true;
end;
$$;

create or replace function public._format_minutes_report(p_minutes integer) returns text
language sql immutable as $$
    select case
        when p_minutes <= 0 then 'N/D'
        when p_minutes < 60 then p_minutes || ' min'
        when p_minutes % 60 > 0 then (p_minutes / 60) || 'h ' || (p_minutes % 60) || 'm'
        else (p_minutes / 60) || 'h'
    end
$$;

create or replace function public._report_summary(p_ids bigint[]) returns jsonb
language plpgsql stable as $$
declare
    v_total bigint;
    v_by_status jsonb;
    v_by_priority jsonb;
    v_by_category jsonb;
    v_completed bigint;
    v_count bigint;
    v_sum numeric;
    v_avg integer := 0;
begin
    select count(*) into v_total from public.incidents where id = any (p_ids);

    select jsonb_build_object('NUEVA', 0, 'ASIGNADA', 0, 'EN_ATENCION', 0, 'RESUELTA', 0, 'CERRADA', 0)
        || coalesce(jsonb_object_agg(x.code, x.cnt), '{}')
    into v_by_status
    from (
        select s.code, count(*) as cnt from public.incidents i join public.statuses s on s.id = i.status_id
        where i.id = any (p_ids) group by s.code
    ) x;

    select jsonb_build_object('Crítica', 0, 'Alta', 0, 'Media', 0, 'Baja', 0)
        || coalesce(jsonb_object_agg(x.name, x.cnt), '{}')
    into v_by_priority
    from (
        select p.name, count(*) as cnt from public.incidents i join public.priorities p on p.id = i.priority_id
        where i.id = any (p_ids) group by p.name
    ) x;

    select coalesce(jsonb_object_agg(x.name, x.cnt), '{}') into v_by_category
    from (
        select c.name, count(*) as cnt from public.incidents i join public.categories c on c.id = i.category_id
        where i.id = any (p_ids) group by c.name
    ) x;

    v_completed := coalesce((v_by_status ->> 'RESUELTA')::bigint, 0) + coalesce((v_by_status ->> 'CERRADA')::bigint, 0);

    select count(*), sum(public._minutes_between(created_at, resolved_at)) into v_count, v_sum
    from public.incidents where id = any (p_ids) and resolved_at is not null;
    if v_count > 0 then
        v_avg := round(v_sum / v_count);
    end if;

    return jsonb_build_object(
        'total', v_total,
        'by_status', v_by_status,
        'by_priority', v_by_priority,
        'by_category', v_by_category,
        'completed', v_completed,
        'resolution_rate', case when v_total > 0 then round(v_completed::numeric / v_total * 100, 1) else 0 end,
        'avg_resolution_time_minutes', v_avg,
        'avg_resolution_time_formatted', public._format_minutes_report(v_avg)
    );
end;
$$;

create or replace function public._report_filter_labels(p_filters jsonb) returns jsonb
language plpgsql stable as $$
declare
    v_labels jsonb := '{}';
    v_name text;
    v_preset text := public._jtext(p_filters, 'period_preset');
begin
    if public._jtext(p_filters, 'folio') is not null then
        v_labels := v_labels || jsonb_build_object('Folio Específico', upper(public._jtext(p_filters, 'folio')));
    end if;
    if v_preset is not null then
        v_labels := v_labels || jsonb_build_object('Período', case
            when v_preset = 'today' then 'Turno de Hoy'
            when v_preset in ('last_7_days', 'week') then 'Últimos 7 Días'
            when v_preset in ('this_month', 'month') then 'Mes en Curso'
            else initcap(v_preset) end);
    end if;
    if public._jtext(p_filters, 'date_from') is not null or public._jtext(p_filters, 'date_to') is not null then
        v_labels := v_labels || jsonb_build_object('Rango Manual',
            coalesce(public._jtext(p_filters, 'date_from'), 'Inicio histórico') || ' al ' || coalesce(public._jtext(p_filters, 'date_to'), 'Fecha actual'));
    end if;
    if public._jbigint(p_filters, 'status_id') is not null then
        select name into v_name from public.statuses where id = public._jbigint(p_filters, 'status_id');
        if v_name is not null then v_labels := v_labels || jsonb_build_object('Estado', v_name); end if;
    end if;
    if public._jbigint(p_filters, 'priority_id') is not null then
        select name into v_name from public.priorities where id = public._jbigint(p_filters, 'priority_id');
        if v_name is not null then v_labels := v_labels || jsonb_build_object('Prioridad', v_name); end if;
    end if;
    if public._jbigint(p_filters, 'category_id') is not null then
        select name into v_name from public.categories where id = public._jbigint(p_filters, 'category_id');
        if v_name is not null then v_labels := v_labels || jsonb_build_object('Subsistema', v_name); end if;
    end if;
    if public._jbigint(p_filters, 'assigned_to') is not null then
        select name into v_name from public.users where id = public._jbigint(p_filters, 'assigned_to');
        if v_name is not null then v_labels := v_labels || jsonb_build_object('Especialista GTS', v_name); end if;
    end if;
    if public._jbigint(p_filters, 'reported_by') is not null then
        select name into v_name from public.users where id = public._jbigint(p_filters, 'reported_by');
        if v_name is not null then v_labels := v_labels || jsonb_build_object('Reportante APOC', v_name); end if;
    end if;
    if public._jtext(p_filters, 'search') is not null then
        v_labels := v_labels || jsonb_build_object('Término', '"' || public._jtext(p_filters, 'search') || '"');
    end if;
    if v_labels = '{}'::jsonb then
        v_labels := jsonb_build_object('Criterio', 'Todas las incidencias (Sin filtros)');
    end if;
    return v_labels;
end;
$$;

create or replace function public._require_report_permission(p_permission text) returns bigint
language plpgsql stable as $$
declare
    v_uid bigint := public.current_user_id();
begin
    if v_uid is null then
        raise exception 'Usuario inactivo.' using errcode = '42501';
    end if;
    if not (public.user_is_admin(v_uid) or public.user_has_permission(v_uid, p_permission)) then
        raise exception '%', case when p_permission = 'reports.view'
            then 'Acceso denegado: No posee permisos para consultar reportes.'
            else 'Acceso denegado: No posee permisos para exportar reportes.' end
            using errcode = '42501';
    end if;
    return v_uid;
end;
$$;

create or replace function public.reports_data(p_filters jsonb default '{}', p_page integer default 1) returns jsonb
language plpgsql stable as $$
declare
    v_uid bigint := public._require_report_permission('reports.view');
    v_filters jsonb := coalesce(p_filters, '{}');
    v_ids bigint[];
    v_page integer := greatest(coalesce(p_page, 1), 1);
    v_term text;
    v_warning text;
    v_total bigint;
    v_rows jsonb;
    v_apoc jsonb;
begin
    select coalesce(array_agg(i.id order by i.created_at desc), '{}') into v_ids
    from public.incidents i where public._report_matches(i, v_filters);
    v_total := cardinality(v_ids);

    v_term := coalesce(public._jtext(v_filters, 'folio'), public._jtext(v_filters, 'search'));
    if v_term is not null and v_term ~* '^INC' then
        if v_term !~* '^INC-\d{4}-\d{3,6}$' then
            v_warning := 'No se encontró una incidencia válida con ese folio.';
        elsif not exists (select 1 from public.incidents where folio = upper(v_term)) then
            v_warning := 'No se encontró ninguna incidencia con ese folio.';
        end if;
    end if;

    select coalesce(jsonb_agg(public._incident_json(i) order by i.created_at desc, i.id desc), '[]') into v_rows
    from (
        select * from public.incidents where id = any (v_ids)
        order by created_at desc, id desc
        limit 15 offset (v_page - 1) * 15
    ) i;

    if public.user_is_apoc_cco(v_uid) then
        select coalesce(jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name) order by u.name), '[]') into v_apoc
        from public.users u where u.is_active and public.user_is_apoc_cco(u.id);
    elsif public.user_is_apoc_csa(v_uid) then
        select coalesce(jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name) order by u.name), '[]') into v_apoc
        from public.users u where u.is_active and public.user_is_apoc_csa(u.id);
    else
        select coalesce(jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name) order by u.name), '[]') into v_apoc
        from public.users u join public.roles r on r.id = u.role_id
        where u.is_active and r.slug in ('apoc', 'apoc-cco', 'apoc-csa');
    end if;

    return jsonb_build_object(
        'filters', v_filters,
        'applied_filters', public._report_filter_labels(v_filters),
        'summary', public._report_summary(v_ids),
        'data', v_rows,
        'meta', public._paginate_meta(v_total, v_page, 15),
        'search_warning', v_warning,
        'can_export', public.user_is_admin(v_uid) or public.user_has_permission(v_uid, 'reports.export'),
        'gts_users', coalesce((
            select jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name) order by u.name)
            from public.users u join public.roles r on r.id = u.role_id
            where r.slug = 'gts' and u.is_active
        ), '[]'),
        'apoc_users', v_apoc,
        'requester_email', (select email from public.users where id = v_uid)
    );
end;
$$;

-- Datos completos del reporte PDF (ReportService::generatePdf)
create or replace function public.reports_export(p_filters jsonb default '{}', p_selected_ids bigint[] default null) returns jsonb
language plpgsql volatile as $$
declare
    v_uid bigint := public._require_report_permission('reports.export');
    v_filters jsonb := coalesce(p_filters, '{}');
    v_ids bigint[];
    v_labels jsonb;
    v_rows jsonb;
begin
    if p_selected_ids is not null then
        if cardinality(p_selected_ids) = 0 then
            raise exception 'Debe seleccionar al menos una incidencia para generar el reporte.';
        end if;
        select coalesce(array_agg(id order by created_at desc), '{}') into v_ids
        from public.incidents where id = any (p_selected_ids);
        if cardinality(v_ids) = 0 then
            raise exception 'No se encontraron incidencias válidas para los identificadores seleccionados.';
        end if;
    else
        select coalesce(array_agg(i.id order by i.created_at desc), '{}') into v_ids
        from public.incidents i where public._report_matches(i, v_filters);
    end if;

    v_labels := public._report_filter_labels(v_filters);
    if p_selected_ids is not null then
        v_labels := v_labels || jsonb_build_object('Selección', cardinality(v_ids) || ' incidencias seleccionadas');
    end if;

    select coalesce(jsonb_agg(public._incident_json(i) || jsonb_build_object(
        'is_assigned_to_tics', public._incident_is_tics(i.id),
        'histories', coalesce((
            select jsonb_agg(jsonb_build_object(
                'action', h.action, 'field_name', h.field_name, 'old_value', h.old_value,
                'new_value', h.new_value, 'comment', h.comment, 'created_at', h.created_at,
                'user', jsonb_build_object('name', public._user_name(h.user_id),
                    'role', public._role_json((select role_id from public.users where id = h.user_id)))
            ) order by h.created_at, h.id)
            from public.incident_histories h where h.incident_id = i.id
        ), '[]'),
        'attachments', coalesce((
            select jsonb_agg(jsonb_build_object(
                'original_filename', a.original_filename, 'file_size_bytes', a.file_size_bytes,
                'mime_type', a.mime_type, 'uploaded_by', public._user_name(a.uploaded_by_user_id)
            ) order by a.id)
            from public.incident_attachments a where a.incident_id = i.id
        ), '[]')
    ) order by i.created_at desc, i.id desc), '[]')
    into v_rows
    from public.incidents i where i.id = any (v_ids);

    return jsonb_build_object(
        'report_folio', 'REP-' || to_char(now() at time zone public.app_tz(), 'YYYYMMDD') || '-'
            || upper(substr(encode(extensions.gen_random_bytes(2), 'hex'), 1, 4)),
        'generated_at', to_char(now() at time zone public.app_tz(), 'DD/MM/YYYY HH24:MI:SS'),
        'requester', public._user_json(v_uid),
        'applied_filters', v_labels,
        'summary', public._report_summary(v_ids),
        'incidents', v_rows
    );
end;
$$;

-- ---------------------------------------------------------------------
-- Auditoría (AuditController@index + AuditService) — conjunto completo del sistema
-- ---------------------------------------------------------------------
create or replace function public.audit_data(
    p_filters jsonb default '{}',
    p_incidents_page integer default 1,
    p_histories_page integer default 1
) returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_f jsonb := coalesce(p_filters, '{}');
    v_search text := public._jtext(v_f, 'search');
    v_folio text := public._jtext(v_f, 'folio');
    v_action text := public._jtext(v_f, 'action');
    v_user_filter bigint := public._jbigint(v_f, 'user_id');
    v_status bigint := public._jbigint(v_f, 'status_id');
    v_category bigint := public._jbigint(v_f, 'category_id');
    v_priority bigint := public._jbigint(v_f, 'priority_id');
    v_incident bigint := public._jbigint(v_f, 'incident_id');
    v_from date := public._jdate(v_f, 'date_from');
    v_to date := public._jdate(v_f, 'date_to');
    v_inc_page integer := greatest(coalesce(p_incidents_page, 1), 1);
    v_hist_page integer := greatest(coalesce(p_histories_page, 1), 1);
    v_inc_total bigint;
    v_hist_total bigint;
    v_incidents jsonb;
    v_histories jsonb;
begin
    if not (public.user_is_admin(v_user.id) or public.user_has_permission(v_user.id, 'audit.view')) then
        perform public._deny('Acceso denegado: No posee permisos para consultar la bitácora de auditoría.');
    end if;

    create temporary table if not exists _audit_inc (id bigint, created_at timestamptz) on commit drop;
    truncate _audit_inc;
    insert into _audit_inc
    select i.id, i.created_at
    from public.incidents i
    where (v_search is null or (
            i.folio ilike '%' || v_search || '%' or i.title ilike '%' || v_search || '%'
            or i.location ilike '%' || v_search || '%' or i.description ilike '%' || v_search || '%'
            or exists (select 1 from public.categories c where c.id = i.category_id and c.name ilike '%' || v_search || '%')
            or exists (select 1 from public.statuses s where s.id = i.status_id and s.name ilike '%' || v_search || '%')
            or exists (select 1 from public.users u where u.id = i.reported_by_user_id
                       and (u.name ilike '%' || v_search || '%' or coalesce(u.badge_number, '') ilike '%' || v_search || '%'))
            or exists (select 1 from public.users u where u.id = i.assigned_to_user_id and u.name ilike '%' || v_search || '%')
          ))
      and (v_folio is null or i.folio = v_folio)
      and (v_status is null or i.status_id = v_status)
      and (v_category is null or i.category_id = v_category)
      and (v_priority is null or i.priority_id = v_priority)
      and (v_action is null or exists (select 1 from public.incident_histories h where h.incident_id = i.id and h.action = v_action))
      and (v_user_filter is null or i.reported_by_user_id = v_user_filter or i.assigned_to_user_id = v_user_filter)
      and (v_from is null or i.created_at >= public._day_start(v_from))
      and (v_to is null or i.created_at <= public._day_end(v_to));

    select count(*) into v_inc_total from _audit_inc;

    select coalesce(jsonb_agg(public._incident_json(i) order by i.created_at desc, i.id desc), '[]') into v_incidents
    from (
        select inc.* from public.incidents inc join _audit_inc a on a.id = inc.id
        order by inc.created_at desc, inc.id desc
        limit 20 offset (v_inc_page - 1) * 20
    ) i;

    create temporary table if not exists _audit_hist (id bigint, created_at timestamptz) on commit drop;
    truncate _audit_hist;
    insert into _audit_hist
    select h.id, h.created_at
    from public.incident_histories h
    left join public.incidents i on i.id = h.incident_id
    where (v_search is null or (
            coalesce(h.comment, '') ilike '%' || v_search || '%'
            or coalesce(h.field_name, '') ilike '%' || v_search || '%'
            or coalesce(h.old_value, '') ilike '%' || v_search || '%'
            or coalesce(h.new_value, '') ilike '%' || v_search || '%'
            or coalesce(i.folio, '') ilike '%' || v_search || '%'
            or coalesce(i.title, '') ilike '%' || v_search || '%'
          ))
      and (v_action is null or h.action = v_action)
      and (v_user_filter is null or h.user_id = v_user_filter)
      and (v_incident is null or h.incident_id = v_incident)
      and (v_folio is null or i.folio = v_folio)
      and (v_from is null or h.created_at >= public._day_start(v_from))
      and (v_to is null or h.created_at <= public._day_end(v_to));

    select count(*) into v_hist_total from _audit_hist;

    select coalesce(jsonb_agg(jsonb_build_object(
        'id', h.id, 'incident_id', h.incident_id, 'action', h.action, 'field_name', h.field_name,
        'old_value', h.old_value, 'new_value', h.new_value, 'comment', h.comment, 'created_at', h.created_at,
        'incident', (select jsonb_build_object('id', i.id, 'folio', i.folio,
                        'category', (select jsonb_build_object('name', c.name) from public.categories c where c.id = i.category_id))
                     from public.incidents i where i.id = h.incident_id),
        'user', public._user_json(h.user_id)
    ) order by h.created_at desc, h.id desc), '[]')
    into v_histories
    from (
        select ih.* from public.incident_histories ih join _audit_hist a on a.id = ih.id
        order by ih.created_at desc, ih.id desc
        limit 20 offset (v_hist_page - 1) * 20
    ) h;

    return jsonb_build_object(
        'incidents', v_incidents,
        'incidents_meta', public._paginate_meta(v_inc_total, v_inc_page, 20),
        'histories', v_histories,
        'histories_meta', public._paginate_meta(v_hist_total, v_hist_page, 20),
        'statistics', jsonb_build_object(
            'total_incidents', (select count(*) from public.incidents),
            'total_events', (select count(*) from public.incident_histories),
            'state_changes', (select count(*) from public.incident_histories where action = 'CAMBIO_ESTADO'),
            'technical_notes', (select count(*) from public.incident_histories where action = 'NOTA_TECNICA'),
            'resolutions', (select count(*) from public.incident_histories where action = 'RESOLUCION'),
            'rejections', (select count(*) from public.incident_histories where action = 'RECHAZO_SOLUCION'),
            'closures', (select count(*) from public.incident_histories where action = 'CERRADA')
        ),
        'users', coalesce((
            select jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name, 'role', public._role_json(u.role_id)) order by u.name)
            from public.users u
        ), '[]'),
        'statuses', coalesce((select jsonb_agg(to_jsonb(s) order by s.step_order) from public.statuses s), '[]'),
        'categories', coalesce((select jsonb_agg(to_jsonb(c) order by c.name) from public.categories c where c.is_active), '[]'),
        'can_delete', public.user_is_admin(v_user.id) or public.user_has_permission(v_user.id, 'incidents.delete')
    );
end;
$$;
