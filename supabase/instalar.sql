-- =====================================================================
-- GTS AIFA — INSTALADOR COMPLETO PARA SUPABASE (generado)
-- Contiene supabase/migrations/*.sql + supabase/seed.sql en orden.
-- Uso: Supabase → SQL Editor → New query → pegar todo → Run.
-- ⚠️  Antes de ejecutar, cambie la CONTRASEÑA INICIAL en la sección de datos iniciales (busque 'CONTRASEÑA INICIAL').
-- Para regenerarlo: cat migrations/*.sql seed.sql > instalar.sql (más este encabezado).
-- =====================================================================


-- >>>>> migrations/20261020000001_schema.sql
-- =====================================================================
-- GTS AIFA — Esquema de base de datos para Supabase (PostgreSQL)
-- Equivalente a database/migrations/* del proyecto Laravel original.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- Zona horaria institucional (config('app.timezone') en Laravel)
create or replace function public.app_tz() returns text
language sql immutable as $$ select 'America/Mexico_City'::text $$;

-- Mantener updated_at como los timestamps de Eloquent
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Roles institucionales
-- ---------------------------------------------------------------------
create table public.roles (
    id bigserial primary key,
    name varchar(50) not null,
    slug varchar(30) not null unique,
    description varchar(255),
    color varchar(50),
    badge_bg varchar(50),
    badge_text varchar(50),
    badge_border varchar(50),
    is_protected boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Usuarios (perfil operativo). La credencial vive en auth.users (Supabase Auth);
-- el login sigue siendo por "usuario" y se traduce a {usuario}@gts.local.
-- ---------------------------------------------------------------------
create table public.users (
    id bigserial primary key,
    auth_id uuid unique references auth.users (id) on delete set null,
    role_id bigint references public.roles (id) on delete restrict,
    name varchar(255) not null,
    username varchar(50) not null unique,
    email varchar(255) unique,
    badge_number varchar(50) unique,
    is_active boolean not null default true,
    shift_status varchar(30) not null default 'ACTIVO',
    shift_status_updated_at timestamptz default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint users_username_format check (username ~ '^[a-z0-9._-]+$')
);

-- ---------------------------------------------------------------------
-- Catálogo de subsistemas / infraestructura tecnológica
-- ---------------------------------------------------------------------
create table public.categories (
    id bigserial primary key,
    name varchar(100) not null unique,
    slug varchar(50) not null unique,
    code varchar(50) unique,
    description text,
    location varchar(255),
    technical_specs text,
    icon varchar(50) not null default 'category',
    color varchar(20) not null default '#06B6D4',
    status varchar(30) not null default 'ACTIVO',
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint categories_status_valid check (status in ('ACTIVO', 'INACTIVO', 'FUERA DE SERVICIO'))
);

-- Equivalente al hook saving() de App\Models\Category
create or replace function public.categories_sync_status() returns trigger
language plpgsql as $$
begin
    if new.status = 'ACTIVO' then
        new.is_active := true;
    elsif new.status in ('INACTIVO', 'FUERA DE SERVICIO') then
        new.is_active := false;
    elsif new.is_active = false and coalesce(new.status, '') = '' then
        new.status := 'INACTIVO';
    elsif coalesce(new.status, '') = '' then
        new.status := 'ACTIVO';
    end if;
    return new;
end;
$$;

create trigger categories_sync_status
    before insert or update on public.categories
    for each row execute function public.categories_sync_status();

-- ---------------------------------------------------------------------
-- Prioridades, estados y secuencia de folios
-- ---------------------------------------------------------------------
create table public.priorities (
    id bigserial primary key,
    name varchar(50) not null,
    slug varchar(30) not null unique,
    level smallint not null unique,
    color varchar(20) not null default '#64748B',
    sla_minutes integer not null default 60,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.statuses (
    id bigserial primary key,
    code varchar(30) not null unique,
    name varchar(50) not null,
    color varchar(20) not null default '#64748B',
    step_order smallint not null unique,
    is_terminal boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.folio_sequences (
    year smallint primary key,
    last_number integer not null default 0,
    updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Incidencias
-- ---------------------------------------------------------------------
create table public.incidents (
    id bigserial primary key,
    folio varchar(30) not null unique,
    title varchar(255) not null,
    description text not null,
    location varchar(255) not null,
    category_id bigint not null references public.categories (id) on delete restrict,
    priority_id bigint not null references public.priorities (id) on delete restrict,
    status_id bigint not null references public.statuses (id) on delete restrict,
    reported_by_user_id bigint not null references public.users (id) on delete restrict,
    assigned_to_user_id bigint references public.users (id) on delete restrict,
    assigned_specialist varchar(50),
    solution_description text,
    rejection_reason text,
    reported_at timestamptz not null default now(),
    assigned_at timestamptz,
    attended_at timestamptz,
    resolved_at timestamptz,
    closed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index incidents_status_priority_created_idx on public.incidents (status_id, priority_id, created_at);
create index incidents_reported_created_idx on public.incidents (reported_by_user_id, created_at);
create index incidents_assigned_created_idx on public.incidents (assigned_to_user_id, created_at);

-- Bitácora pericial (append-only)
create table public.incident_histories (
    id bigserial primary key,
    incident_id bigint not null references public.incidents (id) on delete cascade,
    user_id bigint not null references public.users (id) on delete restrict,
    action varchar(50) not null,
    field_name varchar(100),
    old_value text,
    new_value text,
    comment text,
    created_at timestamptz not null default now()
);

create index incident_histories_incident_created_idx on public.incident_histories (incident_id, created_at);

-- Inmutabilidad física de la bitácora (RN-04 / RF-05).
-- Solo las funciones del sistema pueden reescribirla, activando gts.allow_history_rewrite
-- (purga de usuario o eliminación definitiva de un expediente).
create or replace function public.incident_histories_guard() returns trigger
language plpgsql as $$
begin
    if coalesce(current_setting('gts.allow_history_rewrite', true), '') = 'on' then
        return coalesce(new, old);
    end if;

    if tg_op = 'DELETE' and not exists (select 1 from public.incidents where id = old.incident_id) then
        -- Borrado en cascada por la eliminación autorizada del expediente
        return old;
    end if;

    if tg_op = 'UPDATE' then
        raise exception 'La bitácora de auditoría es estrictamente inmutable (Append-Only) por normativa aeronáutica.';
    end if;

    raise exception 'La eliminación de registros de auditoría histórica está terminantemente prohibida.';
end;
$$;

create trigger incident_histories_guard
    before update or delete on public.incident_histories
    for each row execute function public.incident_histories_guard();

create table public.incident_attachments (
    id bigserial primary key,
    incident_id bigint not null references public.incidents (id) on delete cascade,
    uploaded_by_user_id bigint not null references public.users (id) on delete restrict,
    original_filename varchar(255) not null,
    stored_path varchar(500) not null,
    mime_type varchar(100) not null,
    file_size_bytes bigint not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index incident_attachments_incident_created_idx on public.incident_attachments (incident_id, created_at);

create table public.incident_assigned_areas (
    id bigserial primary key,
    incident_id bigint not null references public.incidents (id) on delete cascade,
    area_code varchar(50) not null,
    area_name varchar(100) not null,
    role_id bigint references public.roles (id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (incident_id, area_code)
);

create index incident_assigned_areas_incident_role_idx on public.incident_assigned_areas (incident_id, role_id);

-- ---------------------------------------------------------------------
-- Notificaciones por perfil (equivalente a la tabla notifications de Laravel)
-- ---------------------------------------------------------------------
create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id bigint not null references public.users (id) on delete cascade,
    data jsonb not null,
    read_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index notifications_user_created_idx on public.notifications (user_id, created_at desc);

-- Historial de disponibilidad de agentes (se conserva por compatibilidad del esquema)
create table public.agent_availability_logs (
    id bigserial primary key,
    user_id bigint not null references public.users (id) on delete cascade,
    status varchar(30) not null,
    previous_status varchar(30),
    reason varchar(255),
    ip_address varchar(45),
    created_at timestamptz not null default now()
);

create index agent_availability_logs_user_created_idx on public.agent_availability_logs (user_id, created_at);

-- ---------------------------------------------------------------------
-- Permisos granulares y alcances operativos inter-rol
-- ---------------------------------------------------------------------
create table public.permissions (
    id bigserial primary key,
    name varchar(100) not null,
    slug varchar(100) not null unique,
    module varchar(50) not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index permissions_module_idx on public.permissions (module);

create table public.role_permissions (
    id bigserial primary key,
    role_id bigint not null references public.roles (id) on delete cascade,
    permission_id bigint not null references public.permissions (id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (role_id, permission_id)
);

create table public.role_operational_scopes (
    id bigserial primary key,
    source_role_id bigint not null references public.roles (id) on delete cascade,
    target_role_id bigint not null references public.roles (id) on delete cascade,
    scope_type varchar(20) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (source_role_id, target_role_id, scope_type),
    constraint role_operational_scopes_type check (scope_type in ('view', 'attend', 'assign'))
);

-- updated_at automático
do $$
declare
    t text;
begin
    foreach t in array array[
        'roles', 'users', 'categories', 'priorities', 'statuses', 'incidents',
        'incident_attachments', 'incident_assigned_areas', 'notifications',
        'permissions', 'role_permissions', 'role_operational_scopes'
    ] loop
        execute format(
            'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
            t || '_set_updated_at', t
        );
    end loop;
end;
$$;

-- >>>>> migrations/20261020000002_authorization.sql
-- =====================================================================
-- Autorización: equivalente a App\Models\User (roles, permisos, alcances)
-- y a App\Policies\IncidentPolicy / CategoryPolicy.
-- Todas son SECURITY DEFINER para poder usarse dentro de las políticas RLS
-- sin recursión; solo devuelven booleanos o identificadores.
-- =====================================================================

-- Usuario autenticado (activo) ----------------------------------------
create or replace function public.current_user_id() returns bigint
language sql stable security definer set search_path = public as $$
    select u.id from public.users u where u.auth_id = auth.uid() and u.is_active
$$;

create or replace function public.user_role_slug(p_user_id bigint) returns text
language sql stable security definer set search_path = public as $$
    select r.slug from public.users u join public.roles r on r.id = u.role_id where u.id = p_user_id
$$;

create or replace function public.user_is_admin(p_user_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce(public.user_role_slug(p_user_id) = 'admin', false)
$$;

create or replace function public.user_is_gts(p_user_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce(public.user_role_slug(p_user_id) = 'gts', false)
$$;

create or replace function public.user_is_apoc(p_user_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce(public.user_role_slug(p_user_id) in ('apoc', 'apoc-cco', 'apoc-csa'), false)
$$;

create or replace function public.user_is_apoc_cco(p_user_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce((
        select r.slug = 'apoc-cco'
            or (r.slug = 'apoc' and (coalesce(u.username, '') ilike '%cco%' or coalesce(u.badge_number, '') ilike '%cco%'))
        from public.users u join public.roles r on r.id = u.role_id
        where u.id = p_user_id
    ), false)
$$;

create or replace function public.user_is_apoc_csa(p_user_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce((
        select r.slug = 'apoc-csa'
            or (r.slug = 'apoc' and (coalesce(u.username, '') ilike '%csa%' or coalesce(u.badge_number, '') ilike '%csa%'))
        from public.users u join public.roles r on r.id = u.role_id
        where u.id = p_user_id
    ), false)
$$;

-- User::hasPermission (el Administrador posee bypass total)
create or replace function public.user_has_permission(p_user_id bigint, p_permission text) returns boolean
language sql stable security definer set search_path = public as $$
    select p_user_id is not null and (
        public.user_is_admin(p_user_id)
        or exists (
            select 1
            from public.users u
            join public.role_permissions rp on rp.role_id = u.role_id
            join public.permissions p on p.id = rp.permission_id
            where u.id = p_user_id and p.slug = p_permission
        )
    )
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
    select public.user_is_admin(public.current_user_id())
$$;

create or replace function public.has_permission(p_permission text) returns boolean
language sql stable security definer set search_path = public as $$
    select public.user_has_permission(public.current_user_id(), p_permission)
$$;

-- Etiquetas de rol: User::getRoleTag / getTaggedName
create or replace function public.user_role_tag(p_user_id bigint) returns text
language sql stable security definer set search_path = public as $$
    select case
        when public.user_is_admin(p_user_id) then 'Admin'
        when public.user_is_gts(p_user_id) then 'GTS'
        when public.user_is_apoc_cco(p_user_id) then 'CCO'
        when public.user_is_apoc_csa(p_user_id) then 'CSA'
        when public.user_is_apoc(p_user_id) then 'APOC'
        else coalesce((select r.name from public.users u join public.roles r on r.id = u.role_id where u.id = p_user_id), 'Usuario')
    end
$$;

create or replace function public.user_tagged_name(p_user_id bigint) returns text
language sql stable security definer set search_path = public as $$
    select '|' || public.user_role_tag(p_user_id) || '| ' || (select name from public.users where id = p_user_id)
$$;

-- Incident::getOriginGroupAttribute (grupo operativo emisor)
create or replace function public.user_origin_group(p_user_id bigint) returns text
language sql stable security definer set search_path = public as $$
    select case
        when p_user_id is null then null
        when public.user_is_apoc_cco(p_user_id) then 'CCO'
        when public.user_is_apoc_csa(p_user_id) then 'CSA'
        when public.user_role_slug(p_user_id) = 'apoc' then 'APOC'
        when public.user_is_gts(p_user_id) then 'GTS'
        when public.user_is_admin(p_user_id) then 'ADMIN'
        else coalesce((select r.name from public.users u join public.roles r on r.id = u.role_id where u.id = p_user_id), 'GTS')
    end
$$;

-- Alcances operativos (Role::visibleRoleIds / attendableRoleIds / assignableRoleIds)
create or replace function public.user_scope_role_ids(p_user_id bigint, p_scope text) returns bigint[]
language sql stable security definer set search_path = public as $$
    select case
        when public.user_is_admin(p_user_id) then coalesce((select array_agg(id order by id) from public.roles), '{}')
        else coalesce((
            select array_agg(distinct s.target_role_id)
            from public.role_operational_scopes s
            join public.users u on u.role_id = s.source_role_id
            where u.id = p_user_id and s.scope_type = p_scope
        ), '{}')
    end
$$;

create or replace function public.user_can_scope_role(p_user_id bigint, p_scope text, p_role_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select public.user_is_admin(p_user_id)
        or (p_role_id is not null and p_role_id = any (public.user_scope_role_ids(p_user_id, p_scope)))
$$;

-- ---------------------------------------------------------------------
-- IncidentPolicy::view — visibilidad de un expediente
-- ---------------------------------------------------------------------
create or replace function public.user_can_view_incident(p_user_id bigint, p_incident_id bigint) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype;
    v_inc record;
    v_reporter_role bigint;
    v_view_all boolean;
    v_view_assigned boolean;
    v_view_department boolean;
begin
    select * into v_user from public.users where id = p_user_id and is_active;
    if not found then
        return false;
    end if;

    if public.user_is_admin(p_user_id) then
        return true;
    end if;

    v_view_all := public.user_has_permission(p_user_id, 'incidents.view_all');
    v_view_assigned := public.user_has_permission(p_user_id, 'incidents.view_assigned');
    v_view_department := public.user_has_permission(p_user_id, 'incidents.view_department');

    if not (v_view_all or v_view_assigned or v_view_department) then
        return false;
    end if;

    if v_view_all then
        return true;
    end if;

    select i.reported_by_user_id, i.assigned_to_user_id into v_inc
    from public.incidents i where i.id = p_incident_id;
    if not found then
        return false;
    end if;

    if v_inc.reported_by_user_id = p_user_id then
        return true;
    end if;

    if v_view_assigned then
        if v_inc.assigned_to_user_id = p_user_id then
            return true;
        end if;
        if v_user.role_id is not null and exists (
            select 1 from public.incident_assigned_areas a
            where a.incident_id = p_incident_id and a.role_id = v_user.role_id
        ) then
            return true;
        end if;
    end if;

    if v_view_department then
        if v_user.role_id is not null and exists (
            select 1 from public.incident_assigned_areas a
            where a.incident_id = p_incident_id and a.role_id = v_user.role_id
        ) then
            return true;
        end if;

        select role_id into v_reporter_role from public.users where id = v_inc.reported_by_user_id;
        if v_reporter_role is not null and public.user_can_scope_role(p_user_id, 'view', v_reporter_role) then
            return true;
        end if;

        if public.user_is_apoc_cco(p_user_id) and public.user_origin_group(v_inc.reported_by_user_id) = 'CCO' then
            return true;
        end if;

        if public.user_is_apoc_csa(p_user_id) and public.user_origin_group(v_inc.reported_by_user_id) = 'CSA' then
            return true;
        end if;
    end if;

    return false;
end;
$$;

create or replace function public.can_view_incident(p_incident_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select public.user_can_view_incident(public.current_user_id(), p_incident_id)
$$;

-- IncidentPolicy::viewAny
create or replace function public.user_can_view_any_incident(p_user_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select exists (select 1 from public.users where id = p_user_id and is_active)
        and (
            public.user_is_admin(p_user_id)
            or public.user_has_permission(p_user_id, 'incidents.view_all')
            or public.user_has_permission(p_user_id, 'incidents.view_department')
            or public.user_has_permission(p_user_id, 'incidents.view_assigned')
        )
$$;

-- ---------------------------------------------------------------------
-- IncidentPolicy — resto de habilidades sobre un expediente
-- ---------------------------------------------------------------------
create or replace function public.incident_abilities(p_user_id bigint, p_incident_id bigint) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_active boolean;
    v_admin boolean;
    v_code text;
    v_reporter_role bigint;
    v_assigned_to bigint;
    v_view boolean;
    v_can_attend_scope boolean := true;
begin
    select is_active into v_active from public.users where id = p_user_id;
    v_active := coalesce(v_active, false);
    v_admin := public.user_is_admin(p_user_id);

    select s.code, u.role_id, i.assigned_to_user_id
    into v_code, v_reporter_role, v_assigned_to
    from public.incidents i
    join public.statuses s on s.id = i.status_id
    left join public.users u on u.id = i.reported_by_user_id
    where i.id = p_incident_id;

    v_view := public.user_can_view_incident(p_user_id, p_incident_id);

    if v_reporter_role is not null then
        v_can_attend_scope := public.user_can_scope_role(p_user_id, 'attend', v_reporter_role);
    end if;

    return jsonb_build_object(
        'view', v_view,
        'create', v_active and (v_admin or public.user_has_permission(p_user_id, 'incidents.create')),
        'assign', v_active
            and (v_admin or public.user_has_permission(p_user_id, 'incidents.assign'))
            and v_code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION'),
        'take', v_active
            and (v_admin or public.user_has_permission(p_user_id, 'incidents.take'))
            and v_code in ('NUEVA', 'ASIGNADA'),
        'release', v_active
            and (v_admin or public.user_has_permission(p_user_id, 'incidents.release'))
            and (v_assigned_to = p_user_id or v_admin),
        'startAttention', v_active
            and v_code in ('NUEVA', 'ASIGNADA')
            and (v_admin or (public.user_has_permission(p_user_id, 'incidents.attend') and v_can_attend_scope)),
        'addNote', v_active
            and (v_admin or public.user_has_permission(p_user_id, 'incidents.attend'))
            and v_code = 'EN_ATENCION',
        'resolve', v_active
            and (v_admin or public.user_has_permission(p_user_id, 'incidents.resolve'))
            and v_code = 'EN_ATENCION',
        'rejectResolution', v_active and v_view
            and (v_admin or public.user_has_permission(p_user_id, 'incidents.reopen'))
            and v_code = 'RESUELTA',
        'close', v_active and v_view
            and (v_admin or public.user_has_permission(p_user_id, 'incidents.vobo_close'))
            and v_code = 'RESUELTA',
        'downloadAttachment', v_view,
        'uploadAttachment', v_view and v_code <> 'CERRADA',
        'delete', v_active and (v_admin or public.user_has_permission(p_user_id, 'incidents.delete'))
    );
end;
$$;

create or replace function public.user_can(p_user_id bigint, p_ability text, p_incident_id bigint) returns boolean
language sql stable security definer set search_path = public as $$
    select coalesce((public.incident_abilities(p_user_id, p_incident_id) ->> p_ability)::boolean, false)
$$;

-- Ruta de almacenamiento: incidents/{id}/archivo
create or replace function public.storage_path_incident_id(p_path text) returns bigint
language sql immutable as $$
    select case
        when p_path ~ '^incidents/[0-9]+/[^/]+$' then (split_part(p_path, '/', 2))::bigint
        else null
    end
$$;

-- >>>>> migrations/20261020000003_incident_service.sql
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

-- >>>>> migrations/20261020000004_read_api.sql
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

-- >>>>> migrations/20261020000005_admin_api.sql
-- =====================================================================
-- API administrativa: CatalogController, UserController, RoleController,
-- ProfileController y PasswordController.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Integración con Supabase Auth (credenciales)
-- El login institucional es por usuario; internamente se usa {usuario}@gts.local
-- ---------------------------------------------------------------------
create or replace function public._auth_email(p_username text) returns text
language sql immutable as $$ select lower(p_username) || '@gts.local' $$;

create or replace function public._auth_create(p_username text, p_password text, p_name text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare
    v_id uuid := gen_random_uuid();
    v_email text := public._auth_email(p_username);
begin
    insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
        '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_email,
        extensions.crypt(p_password, extensions.gen_salt('bf')), now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object('username', lower(p_username), 'name', p_name),
        now(), now(), '', '', '', ''
    );

    insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (
        gen_random_uuid(), v_id, v_id::text,
        jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true, 'phone_verified', false),
        'email', now(), now(), now()
    );

    return v_id;
end;
$$;

create or replace function public._auth_set_password(p_auth_id uuid, p_password text) returns void
language sql security definer set search_path = public, extensions as $$
    update auth.users
    set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')), updated_at = now()
    where id = p_auth_id
$$;

create or replace function public._auth_set_username(p_auth_id uuid, p_username text) returns void
language plpgsql security definer set search_path = public as $$
begin
    update auth.users
    set email = public._auth_email(p_username),
        raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('username', lower(p_username)),
        updated_at = now()
    where id = p_auth_id;

    update auth.identities
    set identity_data = coalesce(identity_data, '{}'::jsonb) || jsonb_build_object('email', public._auth_email(p_username)),
        updated_at = now()
    where user_id = p_auth_id and provider = 'email';
end;
$$;

create or replace function public._auth_set_banned(p_auth_id uuid, p_banned boolean) returns void
language sql security definer set search_path = public as $$
    update auth.users
    set banned_until = case when p_banned then 'infinity'::timestamptz else null end, updated_at = now()
    where id = p_auth_id
$$;

create or replace function public._auth_check_password(p_auth_id uuid, p_password text) returns boolean
language sql stable security definer set search_path = public, extensions as $$
    select coalesce((
        select encrypted_password = extensions.crypt(p_password, encrypted_password)
        from auth.users where id = p_auth_id
    ), false)
$$;

create or replace function public._auth_delete(p_auth_id uuid) returns void
language sql security definer set search_path = public as $$
    delete from auth.users where id = p_auth_id
$$;

create or replace function public._slugify(p_text text, p_separator text default '-') returns text
language sql immutable as $$
    select trim(both p_separator from regexp_replace(
        translate(lower(coalesce(p_text, '')), 'áàäâãéèëêíìïîóòöôõúùüûñç', 'aaaaaeeeeiiiiooooouuuunc'),
        '[^a-z0-9]+', p_separator, 'g'))
$$;

create or replace function public._valid_email(p_email text) returns boolean
language sql immutable as $$ select p_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' $$;

-- ---------------------------------------------------------------------
-- Catálogos e infraestructura (CatalogController + CategoryPolicy)
-- ---------------------------------------------------------------------
create or replace function public._category_availability(p_category_id bigint) returns numeric
language sql stable security definer set search_path = public as $$
    select case
        when c.status in ('FUERA DE SERVICIO', 'INACTIVO') then 0.0
        when x.active = 0 then 100.0
        else round(greatest(70.0, 100.0 - x.active * 5.0), 1)
    end
    from public.categories c
    cross join lateral (
        select count(*) as active from public.incidents i join public.statuses s on s.id = i.status_id
        where i.category_id = c.id and s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION')
    ) x
    where c.id = p_category_id
$$;

create or replace function public.catalogs_data(p_filters jsonb default '{}', p_page integer default 1) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_f jsonb := coalesce(p_filters, '{}');
    v_search text := public._jtext(v_f, 'search');
    v_slug text := public._jtext(v_f, 'category');
    v_status text := public._jtext(v_f, 'status');
    v_page integer := greatest(coalesce(p_page, 1), 1);
    v_total bigint;
    v_active bigint;
    v_out bigint;
    v_inactive bigint;
    v_items_total bigint;
begin
    select count(*), count(*) filter (where status = 'ACTIVO'), count(*) filter (where status = 'FUERA DE SERVICIO'),
           count(*) filter (where status = 'INACTIVO')
    into v_total, v_active, v_out, v_inactive
    from public.categories;

    select count(*) into v_items_total
    from public.categories c
    where (v_search is null or c.name ilike '%' || v_search || '%' or coalesce(c.code, '') ilike '%' || v_search || '%'
           or coalesce(c.location, '') ilike '%' || v_search || '%' or coalesce(c.description, '') ilike '%' || v_search || '%')
      and (v_slug is null or c.slug = v_slug)
      and (v_status is null or c.status = v_status);

    return jsonb_build_object(
        'can_manage', public.user_is_admin(v_user.id),
        'total_infrastructure', v_total,
        'active_infrastructure', v_active,
        'out_of_service', v_out,
        'inactive_infrastructure', v_inactive,
        'availability_rate', case when v_total > 0 then round(v_active::numeric / v_total * 100, 1) else 100.0 end,
        'distribution', coalesce((
            select jsonb_agg(jsonb_build_object(
                'id', c.id, 'name', c.name, 'slug', c.slug, 'color', coalesce(nullif(c.color, ''), '#06B6D4'),
                'icon', coalesce(nullif(c.icon, ''), 'hub'),
                'percentage', case when v_total > 0 then round(1.0 / v_total * 100, 1) else 0 end
            ) order by c.name)
            from public.categories c
        ), '[]'),
        'status_breakdown', jsonb_build_array(
            jsonb_build_object('label', 'Activos Operacionales', 'count', v_active,
                'percentage', case when v_total > 0 then round(v_active::numeric / v_total * 100, 1) else 0 end, 'color', '#10B981'),
            jsonb_build_object('label', 'Fuera de Servicio', 'count', v_out,
                'percentage', case when v_total > 0 then round(v_out::numeric / v_total * 100, 1) else 0 end, 'color', '#D83B52'),
            jsonb_build_object('label', 'Inactivos / Mant.', 'count', v_inactive,
                'percentage', case when v_total > 0 then round(v_inactive::numeric / v_total * 100, 1) else 0 end, 'color', '#707B8A')
        ),
        'incidents_by_infrastructure', coalesce((
            select jsonb_agg(jsonb_build_object(
                'name', c.name, 'color', coalesce(nullif(c.color, ''), '#3D82C6'),
                'total', x.total, 'active', x.active, 'resolved', greatest(0, x.total - x.active)
            ) order by c.name)
            from public.categories c
            cross join lateral (
                select count(*) as total,
                       count(*) filter (where s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION')) as active
                from public.incidents i join public.statuses s on s.id = i.status_id
                where i.category_id = c.id
            ) x
        ), '[]'),
        'categories_list', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'slug', slug) order by name)
                                     from public.categories), '[]'),
        'items', coalesce((
            select jsonb_agg(to_jsonb(c) || jsonb_build_object(
                'incidents_count', (select count(*) from public.incidents i where i.category_id = c.id),
                'active_incidents_count', (select count(*) from public.incidents i join public.statuses s on s.id = i.status_id
                                           where i.category_id = c.id and s.code in ('NUEVA', 'ASIGNADA', 'EN_ATENCION')),
                'availability_percentage', public._category_availability(c.id)
            ) order by c.name)
            from (
                select * from public.categories c
                where (v_search is null or c.name ilike '%' || v_search || '%' or coalesce(c.code, '') ilike '%' || v_search || '%'
                       or coalesce(c.location, '') ilike '%' || v_search || '%' or coalesce(c.description, '') ilike '%' || v_search || '%')
                  and (v_slug is null or c.slug = v_slug)
                  and (v_status is null or c.status = v_status)
                order by c.name
                limit 10 offset (v_page - 1) * 10
            ) c
        ), '[]'),
        'meta', public._paginate_meta(v_items_total, v_page, 10)
    );
end;
$$;

create or replace function public._validate_category(p_data jsonb, p_ignore_id bigint) returns void
language plpgsql stable security definer set search_path = public as $$
declare
    v_name text := trim(coalesce(p_data ->> 'name', ''));
    v_code text := nullif(trim(coalesce(p_data ->> 'code', '')), '');
begin
    if v_name = '' then perform public._fail('El nombre del subsistema es obligatorio.'); end if;
    if char_length(v_name) > 100 then perform public._fail('El nombre no puede exceder los 100 caracteres.'); end if;
    if exists (select 1 from public.categories where lower(name) = lower(v_name) and id is distinct from p_ignore_id) then
        perform public._fail('Ya existe un recurso de infraestructura con ese nombre.');
    end if;
    if v_code is not null and char_length(v_code) > 50 then perform public._fail('El código no puede exceder los 50 caracteres.'); end if;
    if v_code is not null and exists (select 1 from public.categories where upper(code) = upper(v_code) and id is distinct from p_ignore_id) then
        perform public._fail('El código de identificación ya se encuentra registrado.');
    end if;
    if char_length(coalesce(p_data ->> 'description', '')) > 1000 then perform public._fail('La descripción no puede exceder los 1000 caracteres.'); end if;
    if char_length(coalesce(p_data ->> 'location', '')) > 255 then perform public._fail('La ubicación no puede exceder los 255 caracteres.'); end if;
    if char_length(coalesce(p_data ->> 'technical_specs', '')) > 2000 then perform public._fail('Las especificaciones técnicas no pueden exceder los 2000 caracteres.'); end if;
    if char_length(coalesce(p_data ->> 'icon', '')) > 50 then perform public._fail('El icono no puede exceder los 50 caracteres.'); end if;
    if char_length(coalesce(p_data ->> 'color', '')) > 20 then perform public._fail('El color no puede exceder los 20 caracteres.'); end if;
    if coalesce(p_data ->> 'status', '') not in ('ACTIVO', 'INACTIVO', 'FUERA DE SERVICIO') then
        perform public._fail('Debe seleccionar un estado operativo válido.');
    end if;
end;
$$;

create or replace function public.catalog_store(p_data jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_name text := trim(coalesce(p_data ->> 'name', ''));
    v_slug text;
    v_base text;
    v_counter integer := 1;
    v_code text := nullif(trim(coalesce(p_data ->> 'code', '')), '');
begin
    if not public.user_is_admin(v_user.id) then
        perform public._deny();
    end if;

    perform public._validate_category(p_data, null);

    v_slug := left(public._slugify(v_name), 50);
    v_base := v_slug;
    while exists (select 1 from public.categories where slug = v_slug) loop
        v_slug := v_base || '-' || v_counter;
        v_counter := v_counter + 1;
    end loop;

    v_code := coalesce(upper(v_code), 'INF-' || upper(left(public._slugify(v_name, ''), 6)));

    insert into public.categories (name, slug, code, description, location, technical_specs, icon, color, status)
    values (
        v_name, v_slug, v_code,
        nullif(p_data ->> 'description', ''), nullif(p_data ->> 'location', ''), nullif(p_data ->> 'technical_specs', ''),
        coalesce(nullif(trim(coalesce(p_data ->> 'icon', '')), ''), 'hub'),
        coalesce(nullif(trim(coalesce(p_data ->> 'color', '')), ''), '#06B6D4'),
        p_data ->> 'status'
    );

    return jsonb_build_object('message', format('Recurso de infraestructura ''%s'' dado de alta exitosamente.', v_name));
end;
$$;

create or replace function public.catalog_update(p_id bigint, p_data jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_cat public.categories%rowtype;
    v_name text := trim(coalesce(p_data ->> 'name', ''));
    v_code text := nullif(trim(coalesce(p_data ->> 'code', '')), '');
begin
    select * into v_cat from public.categories where id = p_id;
    if not found then perform public._fail('El recurso de infraestructura no existe.'); end if;
    if not public.user_is_admin(v_user.id) then perform public._deny(); end if;

    perform public._validate_category(p_data, p_id);

    update public.categories set
        name = v_name,
        code = coalesce(upper(v_code), v_cat.code),
        description = nullif(p_data ->> 'description', ''),
        location = nullif(p_data ->> 'location', ''),
        technical_specs = nullif(p_data ->> 'technical_specs', ''),
        icon = coalesce(nullif(trim(coalesce(p_data ->> 'icon', '')), ''), v_cat.icon),
        color = coalesce(nullif(trim(coalesce(p_data ->> 'color', '')), ''), v_cat.color),
        status = p_data ->> 'status'
    where id = p_id;

    return jsonb_build_object('message', format('Información técnica de ''%s'' actualizada correctamente.', v_name));
end;
$$;

create or replace function public.catalog_update_status(p_id bigint, p_status text, p_reason text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_cat public.categories%rowtype;
begin
    select * into v_cat from public.categories where id = p_id;
    if not found then perform public._fail('El recurso de infraestructura no existe.'); end if;
    if not public.user_is_admin(v_user.id) then perform public._deny(); end if;
    if coalesce(p_status, '') not in ('ACTIVO', 'INACTIVO', 'FUERA DE SERVICIO') then
        perform public._fail('Debe seleccionar un estado operativo válido.');
    end if;
    if char_length(coalesce(p_reason, '')) > 255 then
        perform public._fail('El motivo no puede exceder los 255 caracteres.');
    end if;

    update public.categories set status = p_status where id = p_id;

    return jsonb_build_object('message', format('El recurso ''%s'' ha sido %s exitosamente.', v_cat.name, case p_status
        when 'FUERA DE SERVICIO' then 'puesto FUERA DE SERVICIO'
        when 'INACTIVO' then 'dado de baja temporalmente'
        else 'reincorporado a servicio ACTIVO' end));
end;
$$;

create or replace function public.catalog_destroy(p_id bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_cat public.categories%rowtype;
    v_count bigint;
begin
    select * into v_cat from public.categories where id = p_id;
    if not found then perform public._fail('El recurso de infraestructura no existe.'); end if;

    select count(*) into v_count from public.incidents where category_id = p_id;
    if v_count > 0 then
        perform public._fail(format('Acción denegada por integridad referencial: El recurso ''%s'' cuenta con %s incidencias históricas vinculadas. Para retirarlo del servicio operativo, utilice la opción ''Dar de baja'' cambiando su estado a ''FUERA DE SERVICIO'' o ''INACTIVO''.', v_cat.name, v_count));
    end if;
    if not public.user_is_admin(v_user.id) then perform public._deny(); end if;

    delete from public.categories where id = p_id;
    return jsonb_build_object('message', format('El recurso ''%s'' ha sido eliminado físicamente del catálogo.', v_cat.name));
end;
$$;

-- ---------------------------------------------------------------------
-- Usuarios y cuadrillas (UserController)
-- ---------------------------------------------------------------------
create or replace function public._require_permission(p_permission text, p_message text) returns public.users
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
begin
    if not (public.user_is_admin(v_user.id) or public.user_has_permission(v_user.id, p_permission)) then
        perform public._deny(p_message);
    end if;
    return v_user;
end;
$$;

create or replace function public.users_data(p_filters jsonb default '{}', p_page integer default 1) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('users.view', 'Acceso denegado: No posee permisos para consultar usuarios.');
    v_f jsonb := coalesce(p_filters, '{}');
    v_search text := public._jtext(v_f, 'search');
    v_role bigint := public._jbigint(v_f, 'role_id');
    v_active text := public._jtext(v_f, 'is_active');
    v_page integer := greatest(coalesce(p_page, 1), 1);
    v_total bigint;
begin
    select count(*) into v_total
    from public.users u
    where (v_search is null or u.name ilike '%' || v_search || '%' or u.username ilike '%' || v_search || '%'
           or coalesce(u.email, '') ilike '%' || v_search || '%' or coalesce(u.badge_number, '') ilike '%' || v_search || '%')
      and (v_role is null or u.role_id = v_role)
      and (v_active is null or u.is_active = (v_active = '1'));

    return jsonb_build_object(
        'current_user_id', v_user.id,
        'can_create', public.user_has_permission(v_user.id, 'users.create'),
        'can_edit', public.user_has_permission(v_user.id, 'users.edit'),
        'can_delete', public.user_has_permission(v_user.id, 'users.delete'),
        'users', coalesce((
            select jsonb_agg(public._user_json(u.id) || jsonb_build_object(
                'is_admin', public.user_is_admin(u.id), 'is_gts', public.user_is_gts(u.id),
                'is_apoc', public.user_is_apoc(u.id), 'is_apoc_cco', public.user_is_apoc_cco(u.id),
                'is_apoc_csa', public.user_is_apoc_csa(u.id)
            ) order by u.name)
            from (
                select * from public.users u
                where (v_search is null or u.name ilike '%' || v_search || '%' or u.username ilike '%' || v_search || '%'
                       or coalesce(u.email, '') ilike '%' || v_search || '%' or coalesce(u.badge_number, '') ilike '%' || v_search || '%')
                  and (v_role is null or u.role_id = v_role)
                  and (v_active is null or u.is_active = (v_active = '1'))
                order by u.name
                limit 15 offset (v_page - 1) * 15
            ) u
        ), '[]'),
        'meta', public._paginate_meta(v_total, v_page, 15),
        'roles', coalesce((
            select jsonb_agg(jsonb_build_object('id', r.id, 'name', r.name, 'slug', r.slug)
                order by case r.slug when 'apoc-cco' then 1 when 'apoc-csa' then 2 when 'gts' then 3 when 'admin' then 4 else 5 end, r.name)
            from public.roles r where r.slug <> 'apoc'
        ), '[]'),
        'metrics', jsonb_build_object(
            'total', (select count(*) from public.users),
            'active', (select count(*) from public.users where is_active),
            'inactive', (select count(*) from public.users where not is_active),
            'gts', (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug = 'gts'),
            'apoc', (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug in ('apoc', 'apoc-cco', 'apoc-csa')),
            'apoc_cco', (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug = 'apoc-cco'),
            'apoc_csa', (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug = 'apoc-csa'),
            'admin', (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug = 'admin')
        )
    );
end;
$$;

create or replace function public._validate_user_fields(
    p_name text, p_username text, p_email text, p_role_id bigint, p_badge text, p_ignore_id bigint
) returns void
language plpgsql stable security definer set search_path = public as $$
begin
    if trim(coalesce(p_name, '')) = '' then perform public._fail('El nombre completo es obligatorio.'); end if;
    if char_length(p_name) > 255 then perform public._fail('El nombre no puede exceder los 255 caracteres.'); end if;
    if trim(coalesce(p_username, '')) = '' then perform public._fail('El nombre de usuario es obligatorio.'); end if;
    if char_length(p_username) > 50 then perform public._fail('El nombre de usuario no puede exceder los 50 caracteres.'); end if;
    if trim(p_username) !~ '^[a-zA-Z0-9._-]+$' then
        perform public._fail('El nombre de usuario sólo puede contener letras, números, puntos, guiones y guiones bajos.');
    end if;
    if exists (select 1 from public.users where username = lower(trim(p_username)) and id is distinct from p_ignore_id) then
        perform public._fail('El nombre de usuario ya se encuentra registrado.');
    end if;
    if nullif(trim(coalesce(p_email, '')), '') is not null then
        if not public._valid_email(trim(p_email)) or char_length(p_email) > 255 then
            perform public._fail('El correo electrónico no tiene un formato válido.');
        end if;
        if exists (select 1 from public.users where lower(email) = lower(trim(p_email)) and id is distinct from p_ignore_id) then
            perform public._fail('El correo electrónico ya se encuentra registrado.');
        end if;
    end if;
    if p_role_id is null or not exists (select 1 from public.roles where id = p_role_id and slug <> 'apoc') then
        perform public._fail('El rol seleccionado no es válido.');
    end if;
    if nullif(trim(coalesce(p_badge, '')), '') is not null then
        if char_length(p_badge) > 50 then perform public._fail('La placa no puede exceder los 50 caracteres.'); end if;
        if exists (select 1 from public.users where badge_number = trim(p_badge) and id is distinct from p_ignore_id) then
            perform public._fail('La placa / credencial ya se encuentra registrada.');
        end if;
    end if;
end;
$$;

create or replace function public.admin_create_user(
    p_name text, p_username text, p_password text, p_role_id bigint, p_badge_number text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('users.create', 'Acceso denegado: No posee permisos para registrar usuarios.');
    v_username text := lower(trim(coalesce(p_username, '')));
    v_auth uuid;
begin
    perform public._validate_user_fields(p_name, p_username, null, p_role_id, p_badge_number, null);
    if char_length(coalesce(p_password, '')) < 8 then
        perform public._fail('La contraseña debe contener al menos 8 caracteres.');
    end if;

    v_auth := public._auth_create(v_username, p_password, trim(p_name));

    insert into public.users (auth_id, role_id, name, username, email, badge_number, is_active)
    values (v_auth, p_role_id, trim(p_name), v_username, null, nullif(trim(coalesce(p_badge_number, '')), ''), true);

    return jsonb_build_object('message', format(
        'El usuario %s (@%s) ha sido registrado exitosamente con credenciales de acceso.', trim(p_name), v_username));
end;
$$;

create or replace function public.admin_update_user(
    p_id bigint, p_name text, p_username text, p_email text, p_role_id bigint,
    p_badge_number text default null, p_password text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('users.edit', 'Acceso denegado: No posee permisos para editar usuarios.');
    v_target public.users%rowtype;
    v_username text := lower(trim(coalesce(p_username, '')));
    v_new_slug text;
begin
    select * into v_target from public.users where id = p_id;
    if not found then perform public._fail('El usuario no existe.'); end if;

    perform public._validate_user_fields(p_name, p_username, p_email, p_role_id, p_badge_number, p_id);
    if nullif(p_password, '') is not null and char_length(p_password) < 8 then
        perform public._fail('La contraseña debe contener al menos 8 caracteres.');
    end if;

    if v_target.id = v_user.id and public.user_is_admin(v_target.id) then
        select slug into v_new_slug from public.roles where id = p_role_id;
        if v_new_slug is distinct from 'admin' then
            perform public._fail('No puede revocar su propio rol de Administrador.');
        end if;
    end if;

    update public.users set
        name = trim(p_name),
        username = v_username,
        email = nullif(lower(trim(coalesce(p_email, ''))), ''),
        role_id = p_role_id,
        badge_number = nullif(trim(coalesce(p_badge_number, '')), '')
    where id = p_id;

    if v_target.auth_id is not null then
        if v_target.username <> v_username then
            perform public._auth_set_username(v_target.auth_id, v_username);
        end if;
        if nullif(p_password, '') is not null then
            perform public._auth_set_password(v_target.auth_id, p_password);
        end if;
    end if;

    return jsonb_build_object('message', format(
        'Los datos del usuario %s (@%s) han sido actualizados correctamente.', trim(p_name), v_username));
end;
$$;

create or replace function public.admin_toggle_user_status(p_id bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('users.edit', 'Acceso denegado: No posee permisos para modificar el estado de usuarios.');
    v_target public.users%rowtype;
begin
    select * into v_target from public.users where id = p_id;
    if not found then perform public._fail('El usuario no existe.'); end if;

    if v_target.id = v_user.id then
        perform public._fail('No puede desactivar su propia cuenta de Administrador en sesión activa.');
    end if;

    if public.user_is_admin(v_target.id) and v_target.is_active then
        if (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug = 'admin' and u.is_active) <= 1 then
            perform public._fail('No es posible desactivar al único Administrador activo del sistema.');
        end if;
    end if;

    update public.users set is_active = not v_target.is_active where id = p_id;
    if v_target.auth_id is not null then
        perform public._auth_set_banned(v_target.auth_id, v_target.is_active);
    end if;

    return jsonb_build_object('message', format('La cuenta del usuario %s ha sido %s exitosamente.', v_target.name,
        case when v_target.is_active then 'desactivada' else 'activada' end));
end;
$$;

create or replace function public.admin_delete_user(p_id bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('users.delete', 'Acceso denegado: No posee permisos para eliminar usuarios.');
    v_target public.users%rowtype;
    v_note text;
begin
    select * into v_target from public.users where id = p_id;
    if not found then perform public._fail('El usuario no existe.'); end if;

    if v_target.id = v_user.id then
        perform public._fail('No puede eliminar su propia cuenta de Administrador en sesión activa.');
    end if;

    if public.user_is_admin(v_target.id)
       and (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug = 'admin') <= 1 then
        perform public._fail('No es posible eliminar al único Administrador del sistema.');
    end if;

    v_note := format('[Operador de origen purgado del sistema: %s (@%s)]', v_target.name, v_target.username);

    update public.incidents set assigned_to_user_id = null where assigned_to_user_id = p_id;
    update public.incidents set reported_by_user_id = v_user.id where reported_by_user_id = p_id;
    update public.incident_attachments set uploaded_by_user_id = v_user.id where uploaded_by_user_id = p_id;

    perform set_config('gts.allow_history_rewrite', 'on', true);
    update public.incident_histories
    set user_id = v_user.id,
        comment = case when comment is not null and comment <> '' then comment || ' ' || v_note else v_note end
    where user_id = p_id;
    perform set_config('gts.allow_history_rewrite', 'off', true);

    delete from public.notifications where user_id = p_id;
    delete from public.agent_availability_logs where user_id = p_id;
    delete from public.users where id = p_id;

    if v_target.auth_id is not null then
        perform public._auth_delete(v_target.auth_id);
    end if;

    return jsonb_build_object('message', format(
        'La cuenta del usuario %s (@%s) ha sido eliminada permanentemente del sistema.', v_target.name, v_target.username));
end;
$$;

-- ---------------------------------------------------------------------
-- Roles, permisos y alcances (RoleController)
-- ---------------------------------------------------------------------
create or replace function public._role_color_preset(p_color text) returns jsonb
language sql immutable as $$
    select (jsonb_build_object(
        'purple', jsonb_build_object('bg', 'bg-purple-500/10', 'text', 'text-purple-400', 'border', 'border-purple-500/20'),
        'cyan', jsonb_build_object('bg', 'bg-cyan-500/10', 'text', 'text-cyan-400', 'border', 'border-cyan-500/20'),
        'amber', jsonb_build_object('bg', 'bg-amber-500/10', 'text', 'text-amber-400', 'border', 'border-amber-500/20'),
        'orange', jsonb_build_object('bg', 'bg-orange-500/10', 'text', 'text-orange-400', 'border', 'border-orange-500/20'),
        'emerald', jsonb_build_object('bg', 'bg-emerald-500/10', 'text', 'text-emerald-400', 'border', 'border-emerald-500/20'),
        'blue', jsonb_build_object('bg', 'bg-blue-500/10', 'text', 'text-blue-400', 'border', 'border-blue-500/20'),
        'rose', jsonb_build_object('bg', 'bg-rose-500/10', 'text', 'text-rose-400', 'border', 'border-rose-500/20'),
        'slate', jsonb_build_object('bg', 'bg-slate-500/10', 'text', 'text-slate-400', 'border', 'border-slate-500/20')
    )) -> p_color
$$;

create or replace function public.roles_data(p_search text default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('roles.view', 'Acceso denegado: No posee permisos para consultar roles.');
    v_search text := nullif(trim(coalesce(p_search, '')), '');
begin
    return jsonb_build_object(
        'roles', coalesce((
            select jsonb_agg(to_jsonb(r) || jsonb_build_object(
                'users_count', (select count(*) from public.users u where u.role_id = r.id),
                'permissions_count', (select count(*) from public.role_permissions rp where rp.role_id = r.id),
                'operational_scopes_count', (select count(*) from public.role_operational_scopes s where s.source_role_id = r.id)
            ) order by r.is_protected desc, r.name)
            from public.roles r
            where v_search is null or r.name ilike '%' || v_search || '%' or r.slug ilike '%' || v_search || '%'
                  or coalesce(r.description, '') ilike '%' || v_search || '%'
        ), '[]'),
        'metrics', jsonb_build_object(
            'total', (select count(*) from public.roles),
            'protected', (select count(*) from public.roles where is_protected),
            'custom', (select count(*) from public.roles where not is_protected),
            'total_users', (select count(*) from public.users where role_id is not null),
            'total_permissions', (select count(*) from public.permissions)
        ),
        'can_create', public.user_has_permission(v_user.id, 'roles.create'),
        'can_edit', public.user_has_permission(v_user.id, 'roles.edit'),
        'can_delete', public.user_has_permission(v_user.id, 'roles.delete'),
        'can_manage', public.user_has_permission(v_user.id, 'roles.manage_permissions')
            or public.user_has_permission(v_user.id, 'roles.manage_scopes')
    );
end;
$$;

create or replace function public.role_detail(p_role_id bigint) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
begin
    if not (public.user_has_permission(v_user.id, 'roles.manage_permissions')
            or public.user_has_permission(v_user.id, 'roles.manage_scopes')
            or public.user_has_permission(v_user.id, 'roles.view')) then
        perform public._deny('Acceso denegado: No posee los permisos requeridos para acceder a esta función.');
    end if;

    if not exists (select 1 from public.roles where id = p_role_id) then
        raise exception 'El rol solicitado no existe.' using errcode = 'P0002';
    end if;

    return jsonb_build_object(
        'role', (select to_jsonb(r) from public.roles r where r.id = p_role_id),
        'permissions', coalesce((select jsonb_agg(to_jsonb(p) order by p.id) from public.permissions p), '[]'),
        'all_roles', coalesce((select jsonb_agg(to_jsonb(r) order by r.is_protected desc, r.name) from public.roles r), '[]'),
        'assigned_permission_ids', coalesce((select jsonb_agg(permission_id) from public.role_permissions where role_id = p_role_id), '[]'),
        'view_scope_role_ids', coalesce((select jsonb_agg(target_role_id) from public.role_operational_scopes where source_role_id = p_role_id and scope_type = 'view'), '[]'),
        'attend_scope_role_ids', coalesce((select jsonb_agg(target_role_id) from public.role_operational_scopes where source_role_id = p_role_id and scope_type = 'attend'), '[]'),
        'assign_scope_role_ids', coalesce((select jsonb_agg(target_role_id) from public.role_operational_scopes where source_role_id = p_role_id and scope_type = 'assign'), '[]'),
        'can_manage_permissions', public.user_has_permission(v_user.id, 'roles.manage_permissions'),
        'can_manage_scopes', public.user_has_permission(v_user.id, 'roles.manage_scopes')
    );
end;
$$;

create or replace function public._validate_role_fields(p_name text, p_slug text, p_description text, p_color text, p_ignore_id bigint, p_check_slug boolean) returns void
language plpgsql stable security definer set search_path = public as $$
begin
    if trim(coalesce(p_name, '')) = '' then perform public._fail('El nombre del rol es obligatorio.'); end if;
    if char_length(trim(p_name)) > 50 then perform public._fail('El nombre del rol no puede exceder los 50 caracteres.'); end if;
    if p_check_slug then
        if trim(coalesce(p_slug, '')) = '' then perform public._fail('El identificador (slug) es obligatorio.'); end if;
        if char_length(p_slug) > 30 then perform public._fail('El identificador (slug) no puede exceder los 30 caracteres.'); end if;
        if lower(trim(p_slug)) !~ '^[a-z0-9\-]+$' then
            perform public._fail('El identificador (slug) debe contener solo letras minúsculas, números y guiones.');
        end if;
        if exists (select 1 from public.roles where slug = lower(trim(p_slug)) and id is distinct from p_ignore_id) then
            perform public._fail('Este identificador de rol ya se encuentra registrado.');
        end if;
    end if;
    if char_length(coalesce(p_description, '')) > 255 then perform public._fail('La descripción no puede exceder los 255 caracteres.'); end if;
    if public._role_color_preset(coalesce(p_color, '')) is null then
        perform public._fail('El color seleccionado no es válido dentro de la paleta institucional.');
    end if;
end;
$$;

create or replace function public.role_store(p_name text, p_slug text, p_description text, p_color text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('roles.create', 'Esta acción no está autorizada.');
    v_preset jsonb := public._role_color_preset(p_color);
    v_id bigint;
begin
    perform public._validate_role_fields(p_name, p_slug, p_description, p_color, null, true);

    insert into public.roles (name, slug, description, is_protected, color, badge_bg, badge_text, badge_border)
    values (trim(p_name), lower(trim(p_slug)), nullif(trim(coalesce(p_description, '')), ''), false,
            p_color, v_preset ->> 'bg', v_preset ->> 'text', v_preset ->> 'border')
    returning id into v_id;

    return jsonb_build_object('id', v_id, 'message', format(
        'Rol "%s" creado exitosamente. Configure ahora sus permisos y alcances operativos.', trim(p_name)));
end;
$$;

create or replace function public.role_update(p_id bigint, p_name text, p_slug text, p_description text, p_color text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('roles.edit', 'Esta acción no está autorizada.');
    v_role public.roles%rowtype;
    v_preset jsonb := public._role_color_preset(p_color);
begin
    select * into v_role from public.roles where id = p_id;
    if not found then perform public._fail('El rol no existe.'); end if;

    perform public._validate_role_fields(p_name, p_slug, p_description, p_color, p_id, not v_role.is_protected);

    update public.roles set
        name = trim(p_name),
        description = nullif(trim(coalesce(p_description, '')), ''),
        color = p_color,
        badge_bg = v_preset ->> 'bg',
        badge_text = v_preset ->> 'text',
        badge_border = v_preset ->> 'border',
        slug = case when not v_role.is_protected and nullif(trim(coalesce(p_slug, '')), '') is not null
                    then lower(trim(p_slug)) else slug end
    where id = p_id;

    return jsonb_build_object('message', format('Rol "%s" actualizado correctamente.', trim(p_name)));
end;
$$;

create or replace function public.role_destroy(p_id bigint) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('roles.delete', 'Acceso denegado: No posee permiso para eliminar roles.');
    v_role public.roles%rowtype;
begin
    select * into v_role from public.roles where id = p_id;
    if not found then perform public._fail('El rol no existe.'); end if;

    if v_role.slug = 'admin' then
        perform public._fail('El rol de ADMINISTRADOR está protegido y no puede ser eliminado.');
    end if;

    update public.users set role_id = null where role_id = p_id;
    delete from public.role_permissions where role_id = p_id;
    delete from public.role_operational_scopes where source_role_id = p_id or target_role_id = p_id;
    delete from public.roles where id = p_id;

    return jsonb_build_object('message', format('El rol "%s" ha sido eliminado exitosamente del sistema.', v_role.name));
end;
$$;

create or replace function public.role_update_permissions(p_id bigint, p_permission_ids bigint[]) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('roles.manage_permissions', 'Acceso denegado: No posee permiso para gestionar matriz de permisos.');
    v_role public.roles%rowtype;
    v_ids bigint[] := coalesce(p_permission_ids, '{}');
begin
    select * into v_role from public.roles where id = p_id;
    if not found then perform public._fail('El rol no existe.'); end if;

    if exists (select 1 from unnest(v_ids) x where not exists (select 1 from public.permissions p where p.id = x)) then
        perform public._fail('Uno o más permisos seleccionados no son válidos.');
    end if;

    delete from public.role_permissions where role_id = p_id and not (permission_id = any (v_ids));
    insert into public.role_permissions (role_id, permission_id)
    select p_id, x from (select distinct unnest(v_ids) as x) d
    on conflict (role_id, permission_id) do nothing;

    return jsonb_build_object('message', format('Matriz de permisos actualizada correctamente para el rol "%s".', v_role.name));
end;
$$;

create or replace function public.role_update_scopes(p_id bigint, p_view bigint[], p_attend bigint[], p_assign bigint[]) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_permission('roles.manage_scopes', 'Acceso denegado: No posee permiso para configurar alcances operativos.');
    v_role public.roles%rowtype;
begin
    select * into v_role from public.roles where id = p_id;
    if not found then perform public._fail('El rol no existe.'); end if;

    if exists (
        select 1 from unnest(coalesce(p_view, '{}') || coalesce(p_attend, '{}') || coalesce(p_assign, '{}')) x
        where not exists (select 1 from public.roles r where r.id = x)
    ) then
        perform public._fail('Uno o más roles seleccionados no son válidos.');
    end if;

    delete from public.role_operational_scopes where source_role_id = p_id;

    insert into public.role_operational_scopes (source_role_id, target_role_id, scope_type)
    select p_id, x, 'view' from (select distinct unnest(coalesce(p_view, '{}')) x) d
    union all
    select p_id, x, 'attend' from (select distinct unnest(coalesce(p_attend, '{}')) x) d
    union all
    select p_id, x, 'assign' from (select distinct unnest(coalesce(p_assign, '{}')) x) d;

    return jsonb_build_object('message', format('Alcances operativos actualizados correctamente para el rol "%s".', v_role.name));
end;
$$;

-- ---------------------------------------------------------------------
-- Perfil propio (ProfileController / PasswordController)
-- ---------------------------------------------------------------------
create or replace function public.profile_update(p_name text, p_email text, p_username text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
    v_is_admin boolean := public.user_is_admin(v_user.id);
    v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
    v_username text := lower(trim(coalesce(p_username, '')));
begin
    if trim(coalesce(p_name, '')) = '' then perform public._fail('El nombre es obligatorio.'); end if;
    if char_length(p_name) > 255 then perform public._fail('El nombre no puede exceder los 255 caracteres.'); end if;

    if v_email is not null then
        if not public._valid_email(v_email) or char_length(v_email) > 255 then
            perform public._fail('El correo electrónico no tiene un formato válido.');
        end if;
        if exists (select 1 from public.users where lower(email) = v_email and id <> v_user.id) then
            perform public._fail('El correo electrónico ya se encuentra registrado.');
        end if;
    end if;

    if v_is_admin then
        if v_username = '' then perform public._fail('El nombre de usuario es obligatorio.'); end if;
        if char_length(v_username) > 50 then perform public._fail('El nombre de usuario no puede exceder los 50 caracteres.'); end if;
        if v_username !~ '^[a-z0-9._-]+$' then
            perform public._fail('El nombre de usuario sólo puede contener letras, números, puntos, guiones y guiones bajos.');
        end if;
        if exists (select 1 from public.users where username = v_username and id <> v_user.id) then
            perform public._fail('El nombre de usuario ya se encuentra registrado.');
        end if;
    elsif p_username is not null and v_username <> '' and v_username <> v_user.username then
        perform public._fail('No está autorizado para modificar su nombre de usuario institucional.');
    end if;

    update public.users set
        name = trim(p_name),
        email = v_email,
        username = case when v_is_admin then v_username else username end
    where id = v_user.id;

    if v_is_admin and v_username <> v_user.username and v_user.auth_id is not null then
        perform public._auth_set_username(v_user.auth_id, v_username);
    end if;

    return jsonb_build_object('status', 'profile-updated', 'username', case when v_is_admin then v_username else v_user.username end);
end;
$$;

create or replace function public.profile_change_password(p_current text, p_password text, p_password_confirmation text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
begin
    if coalesce(p_current, '') = '' then perform public._fail('La contraseña actual es obligatoria.'); end if;
    if not public._auth_check_password(v_user.auth_id, p_current) then
        perform public._fail('La contraseña actual es incorrecta.');
    end if;
    if coalesce(p_password, '') = '' then perform public._fail('La nueva contraseña es obligatoria.'); end if;
    if char_length(p_password) < 8 then perform public._fail('La contraseña debe contener al menos 8 caracteres.'); end if;
    if p_password is distinct from p_password_confirmation then
        perform public._fail('La confirmación de la contraseña no coincide.');
    end if;

    perform public._auth_set_password(v_user.auth_id, p_password);
    return jsonb_build_object('status', 'password-updated');
end;
$$;

create or replace function public.profile_destroy(p_password text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
    v_user public.users%rowtype := public._require_user();
begin
    if not public.user_is_admin(v_user.id) then
        perform public._deny('Acceso denegado: Los operadores GTS y APOC no están autorizados para eliminar su propia cuenta institucional.');
    end if;
    if not public._auth_check_password(v_user.auth_id, coalesce(p_password, '')) then
        perform public._fail('La contraseña es incorrecta.');
    end if;
    if (select count(*) from public.users u join public.roles r on r.id = u.role_id where r.slug = 'admin') <= 1 then
        perform public._fail('No es posible eliminar al único Administrador del sistema.');
    end if;

    begin
        delete from public.users where id = v_user.id;
    exception when foreign_key_violation then
        perform public._fail('No es posible eliminar la cuenta: tiene incidencias o registros de auditoría vinculados. Solicite a otro Administrador la purga desde Gestión de Usuarios.');
    end;

    perform public._auth_delete(v_user.auth_id);
    return jsonb_build_object('status', 'deleted');
end;
$$;

-- >>>>> migrations/20261020000006_security.sql
-- =====================================================================
-- Seguridad: Row Level Security, privilegios y almacenamiento de evidencias.
-- Regla general: lectura controlada por RLS; TODA escritura pasa por las
-- funciones RPC (SECURITY DEFINER) que validan permisos y reglas de negocio.
-- =====================================================================

-- RLS en todas las tablas de negocio
alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.priorities enable row level security;
alter table public.statuses enable row level security;
alter table public.folio_sequences enable row level security;
alter table public.incidents enable row level security;
alter table public.incident_histories enable row level security;
alter table public.incident_attachments enable row level security;
alter table public.incident_assigned_areas enable row level security;
alter table public.notifications enable row level security;
alter table public.agent_availability_logs enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.role_operational_scopes enable row level security;

-- Sin escritura directa desde el cliente (anon / authenticated)
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
grant select on all tables in schema public to authenticated;

-- Catálogos de referencia: cualquier usuario activo
create policy roles_read on public.roles for select to authenticated
    using ((select public.current_user_id()) is not null);
create policy categories_read on public.categories for select to authenticated
    using ((select public.current_user_id()) is not null);
create policy priorities_read on public.priorities for select to authenticated
    using ((select public.current_user_id()) is not null);
create policy statuses_read on public.statuses for select to authenticated
    using ((select public.current_user_id()) is not null);
create policy folio_sequences_read on public.folio_sequences for select to authenticated
    using ((select public.current_user_id()) is not null);
create policy permissions_read on public.permissions for select to authenticated
    using ((select public.current_user_id()) is not null);
create policy role_permissions_read on public.role_permissions for select to authenticated
    using ((select public.current_user_id()) is not null);
create policy role_operational_scopes_read on public.role_operational_scopes for select to authenticated
    using ((select public.current_user_id()) is not null);

-- Directorio de personal: visible para usuarios activos (nombres en bitácoras, asignaciones, filtros)
create policy users_read on public.users for select to authenticated
    using ((select public.current_user_id()) is not null);

-- Incidencias y su expediente: IncidentPolicy::view
create policy incidents_read on public.incidents for select to authenticated
    using (public.can_view_incident(id));
create policy incident_histories_read on public.incident_histories for select to authenticated
    using (public.can_view_incident(incident_id));
create policy incident_attachments_read on public.incident_attachments for select to authenticated
    using (public.can_view_incident(incident_id));
create policy incident_assigned_areas_read on public.incident_assigned_areas for select to authenticated
    using (public.can_view_incident(incident_id));

-- Notificaciones: solo las propias
create policy notifications_read on public.notifications for select to authenticated
    using (user_id = (select public.current_user_id()));

-- agent_availability_logs: sin acceso de lectura para el cliente (solo administración interna)

-- Funciones: solo usuarios autenticados; las internas (_*) no se exponen
revoke execute on all functions in schema public from public, anon;
grant execute on all functions in schema public to authenticated;

do $$
declare
    f record;
begin
    for f in
        select p.oid::regprocedure as signature
        from pg_proc p join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname like '\_%'
          and p.proname not in ('_incident_json', '_user_json', '_role_json', '_paginate_meta', '_incident_matches_search',
                                '_jtext', '_jbigint', '_jdate', '_day_start', '_day_end', '_today', '_month_name', '_fmt_date',
                                '_minutes_between', '_status_code_of', '_priority_slug_of', '_report_matches',
                                '_report_summary', '_report_filter_labels', '_require_report_permission',
                                '_format_minutes_report', '_incident_exists', '_incident_is_tics', '_user_name',
                                '_status_name', '_status_id', '_area_json', '_format_folio', '_iso8601', '_excerpt',
                                '_slugify', '_auth_email', '_valid_email', '_role_color_preset', '_category_availability')
    loop
        execute format('revoke execute on function %s from authenticated', f.signature);
    end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Supabase Storage: bucket privado de evidencias (equivalente al disco 'local' privado)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidencias', 'evidencias', false, 10485760,
        array['image/jpeg', 'image/png', 'application/pdf', 'text/plain'])
on conflict (id) do update
    set public = false,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

create policy evidencias_insert on storage.objects for insert to authenticated
    with check (
        bucket_id = 'evidencias'
        and public.user_can(public.current_user_id(), 'uploadAttachment', public.storage_path_incident_id(name))
    );

create policy evidencias_select on storage.objects for select to authenticated
    using (
        bucket_id = 'evidencias'
        and public.can_view_incident(public.storage_path_incident_id(name))
    );

create policy evidencias_delete on storage.objects for delete to authenticated
    using (
        bucket_id = 'evidencias'
        and (public.is_admin() or public.has_permission('incidents.delete'))
    );

-- >>>>> seed.sql
-- =====================================================================
-- GTS AIFA — Datos iniciales (equivalente a database/seeders/*)
--
-- ⚠️  ANTES DE EJECUTAR: cambia la contraseña inicial en la línea marcada
--     con "CONTRASEÑA INICIAL". Estas cuentas quedarán expuestas en un
--     sitio público; usa una contraseña robusta y cámbiala tras el primer acceso.
-- =====================================================================

do $$
declare
    v_password text := 'Password123!';  -- CONTRASEÑA INICIAL (cámbiala antes de ejecutar)
    v_year integer := extract(year from (now() at time zone public.app_tz()))::integer;
    v_admin bigint;
    v_gts bigint;
    v_cco bigint;
    v_csa bigint;
    v_apoc bigint;
    v_role record;
    v_user record;
    v_auth uuid;
begin
    -- Roles (RoleSeeder + división APOC-CCO / APOC-CSA + PermissionSeeder)
    insert into public.roles (name, slug, description, color, badge_bg, badge_text, badge_border, is_protected) values
        ('APOC-CCO', 'apoc-cco', 'Centro de Control Operativo - Reporte, seguimiento y cierre de incidencias CCO.',
            'amber', 'bg-amber-500/10', 'text-amber-400', 'border-amber-500/20', false),
        ('APOC-CSA', 'apoc-csa', 'Centro de Servicios Aeroportuarios - Reporte, seguimiento y cierre de incidencias CSA.',
            'orange', 'bg-orange-500/10', 'text-orange-400', 'border-orange-500/20', false),
        ('Operador APOC', 'apoc', 'Centro de Operaciones Aeroportuarias - Rol base heredado.',
            'blue', 'bg-blue-500/10', 'text-blue-400', 'border-blue-500/20', false),
        ('GTS', 'gts', 'Grupo de Seguridad Tecnológica - Asignación, diagnóstico, atención y solución técnica en campo.',
            'cyan', 'bg-cyan-500/10', 'text-cyan-400', 'border-cyan-500/20', false),
        ('ADMINISTRADOR', 'admin', 'Supervisión general, administración de usuarios, roles, catálogos y auditoría global.',
            'purple', 'bg-purple-500/10', 'text-purple-400', 'border-purple-500/20', true)
    on conflict (slug) do update set
        name = excluded.name, description = excluded.description, color = excluded.color,
        badge_bg = excluded.badge_bg, badge_text = excluded.badge_text, badge_border = excluded.badge_border,
        is_protected = excluded.is_protected;

    select id into v_admin from public.roles where slug = 'admin';
    select id into v_gts from public.roles where slug = 'gts';
    select id into v_cco from public.roles where slug = 'apoc-cco';
    select id into v_csa from public.roles where slug = 'apoc-csa';
    select id into v_apoc from public.roles where slug = 'apoc';

    -- Subsistemas tecnológicos (CategorySeeder + metadatos institucionales)
    insert into public.categories (name, slug, code, description, location, technical_specs, icon, color, status) values
        ('CCTV', 'cctv', 'INF-CCTV',
            'Cámaras domo PTZ, fijas perimetrales, servidores VMS Genetec y grabadores NVR.',
            'Edificio Terminal, Plataformas y Perimetro AIFA',
            'Sistema VMS Genetec Omnicast, camaras domo PTZ Axis/Bosch perimetrales y NVRs redundantes.',
            'videocam', '#06B6D4', 'ACTIVO'),
        ('Control de Acceso', 'access-control', 'INF-ACC',
            'Torniquetes e-Gates, lectores biométricos, esclusas y cerraduras electromagnéticas de puertas.',
            'Filtros de Inspeccion, Puertas de Embarque y Aduana',
            'Controladoras HID VertX, e-Gates Gunnebo automatizados y lectores biometricos Suprema.',
            'fingerprint', '#8B5CF6', 'ACTIVO'),
        ('FIDS / Pantallas de Vuelo', 'fids', 'INF-FIDS',
            'Pantallas de información de vuelos en salas de espera, cartelería digital y servidores multimedia.',
            'Salas de Ultima Espera, Pasillos de Llegadas y Mostradores',
            'Servidores de Carteleria Samsung MagicINFO, pantallas industriales 65 UHD y control de flujo.',
            'tv', '#F59E0B', 'ACTIVO'),
        ('Radiocomunicación TETRA', 'tetra', 'INF-TETRA',
            'Estaciones base troncalizadas, repetidores de pista y terminales portátiles de radio.',
            'Torre de Control (TWR), Lado Aire y Subestaciones',
            'Red troncalizada digital Motorola Dimetra IP, repetidores MTS4 y terminales portatiles MTP3550.',
            'radio', '#3B82F6', 'ACTIVO'),
        ('Periféricos', 'networks', 'INF-PERIF',
            'Terminales de usuario, switches de borde, periféricos biométricos y hardware de soporte.',
            'Puntos de Atencion a Pasajeros y Oficinas Operativas',
            'Terminales de trabajo CUTE, switches Cisco Catalyst PoE+, impresoras de abordaje y lectores 2D.',
            'hub', '#10B981', 'ACTIVO')
    on conflict (slug) do nothing;

    -- Prioridades (PrioritySeeder)
    insert into public.priorities (name, slug, level, color, sla_minutes, is_active) values
        ('Baja', 'baja', 1, '#5B86B4', 240, true),
        ('Media', 'media', 2, '#E0A21A', 120, true),
        ('Alta', 'alta', 3, '#E06D24', 45, true),
        ('Crítica', 'critica', 4, '#D83B52', 15, true)
    on conflict (slug) do update set
        name = excluded.name, level = excluded.level, color = excluded.color,
        sla_minutes = excluded.sla_minutes, is_active = excluded.is_active;

    -- Estados del ciclo de vida (StatusSeeder)
    insert into public.statuses (code, name, color, step_order, is_terminal) values
        ('NUEVA', 'Nueva', '#3B82F6', 1, false),
        ('ASIGNADA', 'Asignada', '#8B5CF6', 2, false),
        ('EN_ATENCION', 'En Atención', '#F59E0B', 3, false),
        ('RESUELTA', 'Resuelta', '#10B981', 4, false),
        ('CERRADA', 'Cerrada', '#64748B', 5, true)
    on conflict (code) do nothing;

    -- Secuencia de folios (FolioSequenceSeeder)
    insert into public.folio_sequences (year, last_number) values (v_year, 104)
    on conflict (year) do nothing;

    -- Permisos granulares (PermissionSeeder)
    insert into public.permissions (name, slug, module, description) values
        ('Crear incidencias', 'incidents.create', 'incidents', 'Permite registrar y abrir nuevas incidencias en la plataforma.'),
        ('Ver incidencias asignadas', 'incidents.view_assigned', 'incidents', 'Permite visualizar incidencias asignadas directamente al usuario autenticado.'),
        ('Ver incidencias de área/departamento', 'incidents.view_department', 'incidents', 'Permite ver incidencias originadas o pertenecientes a su área funcional.'),
        ('Ver todas las incidencias', 'incidents.view_all', 'incidents', 'Permite consultar el catálogo completo de todas las incidencias del sistema.'),
        ('Atender incidencias', 'incidents.attend', 'incidents', 'Permite iniciar atención técnica, diagnóstico y transición a estado EN PROCESO.'),
        ('Resolver incidencias', 'incidents.resolve', 'incidents', 'Permite registrar notas técnicas de solución y marcar incidencia como RESUELTA.'),
        ('Dar visto bueno y cierre formal', 'incidents.vobo_close', 'incidents', 'Permite validar la conformidad de la solución y cerrar formalmente la incidencia.'),
        ('Reabrir incidencias', 'incidents.reopen', 'incidents', 'Permite rechazar la solución y reabrir una incidencia no conforme.'),
        ('Eliminar incidencias', 'incidents.delete', 'incidents', 'Permite eliminar definitivamente registros de incidencias y sus adjuntos.'),
        ('Asignar incidencias', 'incidents.assign', 'incidents', 'Permite asignar o reasignar incidencias a especialistas o cuadrillas.'),
        ('Tomar incidencias', 'incidents.take', 'incidents', 'Permite que un especialista técnico se autoasigne una incidencia disponible.'),
        ('Liberar incidencias', 'incidents.release', 'incidents', 'Permite desvincular la asignación para regresar la incidencia a la cola disponible.'),
        ('Ver usuarios', 'users.view', 'users', 'Permite listar y consultar detalles de las cuentas de usuario y cuadrillas.'),
        ('Crear usuarios', 'users.create', 'users', 'Permite registrar nuevos usuarios con credenciales y roles asignados.'),
        ('Editar usuarios', 'users.edit', 'users', 'Permite actualizar datos de contacto, contraseñas, placas y estado de usuarios.'),
        ('Eliminar usuarios', 'users.delete', 'users', 'Permite desactivar o eliminar cuentas de usuario del sistema.'),
        ('Ver roles y permisos', 'roles.view', 'roles', 'Permite consultar el catálogo de roles, matriz de permisos y alcances operativos.'),
        ('Crear roles', 'roles.create', 'roles', 'Permite crear nuevos roles con identificadores y configuración de insignias.'),
        ('Editar roles', 'roles.edit', 'roles', 'Permite modificar nombres, descripciones y apariencia visual de los roles.'),
        ('Eliminar roles', 'roles.delete', 'roles', 'Permite eliminar roles personalizados no protegidos.'),
        ('Configurar permisos de roles', 'roles.manage_permissions', 'roles', 'Permite asignar o revocar permisos específicos en la matriz por rol.'),
        ('Configurar alcances de roles', 'roles.manage_scopes', 'roles', 'Permite definir la matriz de alcances operativos (ver, atender, asignar) entre roles.'),
        ('Ver reportes', 'reports.view', 'reports', 'Permite consultar reportes estadísticos, gráficos e indicadores de gestión.'),
        ('Exportar reportes', 'reports.export', 'reports', 'Permite descargar reportes consolidados y resúmenes ejecutivos en PDF o Excel.'),
        ('Ver auditoría', 'audit.view', 'audit', 'Permite consultar la bitácora global de trazabilidad, eventos y cambios de estado.')
    on conflict (slug) do nothing;

    -- Asignación de permisos por rol
    insert into public.role_permissions (role_id, permission_id)
    select v_admin, id from public.permissions
    on conflict do nothing;

    insert into public.role_permissions (role_id, permission_id)
    select v_gts, id from public.permissions where slug in (
        'incidents.create', 'incidents.view_assigned', 'incidents.view_department', 'incidents.view_all',
        'incidents.attend', 'incidents.resolve', 'incidents.take', 'incidents.release', 'incidents.assign',
        'reports.view', 'reports.export')
    on conflict do nothing;

    insert into public.role_permissions (role_id, permission_id)
    select r.id, p.id
    from public.roles r cross join public.permissions p
    where r.id in (v_cco, v_csa, v_apoc)
      and p.slug in ('incidents.create', 'incidents.view_department', 'incidents.vobo_close',
                     'incidents.reopen', 'reports.view', 'reports.export')
    on conflict do nothing;

    -- Alcances operativos (RoleOperationalScope)
    delete from public.role_operational_scopes;

    insert into public.role_operational_scopes (source_role_id, target_role_id, scope_type)
    select v_admin, r.id, t.scope from public.roles r cross join (values ('view'), ('attend'), ('assign')) t(scope);

    insert into public.role_operational_scopes (source_role_id, target_role_id, scope_type)
    select v_gts, r.id, t.scope from public.roles r cross join (values ('view'), ('attend')) t(scope);

    insert into public.role_operational_scopes (source_role_id, target_role_id, scope_type) values
        (v_gts, v_gts, 'assign'),
        (v_cco, v_cco, 'view'),
        (v_csa, v_csa, 'view'),
        (v_apoc, v_apoc, 'view');

    -- Cuentas institucionales iniciales (UserSeeder)
    for v_user in
        select * from (values
            ('Tco. M. Reyes', 'apoc', 'apoc@aifa.aero', v_apoc, 'APOC-042'),
            ('Ing. Roberto Morales', 'gts.morales', 'gts.morales@aifa.aero', v_gts, 'GTS-108'),
            ('Ing. Carlos Mendoza', 'gts.mendoza', 'gts.mendoza@aifa.aero', v_gts, 'GTS-215'),
            ('Admin Seguridad Tecnológica', 'admin', 'admin@aifa.aero', v_admin, 'ADM-001')
        ) as t(name, username, email, role_id, badge)
    loop
        if not exists (select 1 from public.users where username = v_user.username) then
            v_auth := public._auth_create(v_user.username, v_password, v_user.name);
            insert into public.users (auth_id, role_id, name, username, email, badge_number, is_active)
            values (v_auth, v_user.role_id, v_user.name, v_user.username, v_user.email, v_user.badge, true);
        end if;
    end loop;
end;
$$;
