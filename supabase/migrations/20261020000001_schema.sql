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
