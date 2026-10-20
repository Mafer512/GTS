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
