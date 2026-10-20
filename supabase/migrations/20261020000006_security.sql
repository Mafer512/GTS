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
