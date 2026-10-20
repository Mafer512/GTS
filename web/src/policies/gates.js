// Gates de interfaz — reflejan App\Policies\* y los middleware de permisos.
// La autorización efectiva la aplica la base de datos (RLS + funciones RPC);
// estas funciones solo deciden qué botones y menús se muestran.
import * as auth from '../lib/session.js';

export const incidentViewAny = () =>
    auth.isActive() && auth.canAny('incidents.view_all', 'incidents.view_department', 'incidents.view_assigned');

export const incidentCreate = () => auth.isActive() && auth.can('incidents.create');

export const incidentMine = () => auth.canAny('incidents.view_assigned', 'incidents.view_department');

export const incidentAll = () => auth.can('incidents.view_all');

export const incidentDelete = () => auth.isActive() && auth.can('incidents.delete');

export const reportsView = () => auth.can('reports.view');

export const reportsExport = () => auth.can('reports.export');

export const auditView = () => auth.isActive() && auth.can('audit.view');

export const usersView = () => auth.can('users.view');

export const rolesView = () => auth.can('roles.view');

export const rolesManage = () => auth.canAny('roles.manage_permissions', 'roles.manage_scopes');

export const categoryManage = () => auth.isActive() && auth.isAdmin();

// Seguridad de visibilidad del distintivo de procedencia en listados
export const seesOriginBadges = () => auth.isAdmin() || auth.isGts() || auth.can('incidents.view_all');
