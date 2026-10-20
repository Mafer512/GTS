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
