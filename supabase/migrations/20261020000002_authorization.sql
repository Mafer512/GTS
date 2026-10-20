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
