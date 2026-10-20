// DashboardService, IndicatorService, AuditService, NotificationService, CatalogController,
// UserController, RoleController y ProfileController — llamadas a la API
import { rpc } from '../lib/api.js';

export const dashboard = {
    data: (period = 'today') => rpc('dashboard_data', { p_period: period }),
    recent: () => rpc('dashboard_recent_incidents', { p_limit: 6 }),
};

export const indicators = {
    data: (filters) => rpc('indicators_data', { p_filters: filters }),
};

export const audit = {
    data: (filters, incidentsPage = 1, historiesPage = 1) =>
        rpc('audit_data', {
            p_filters: filters,
            p_incidents_page: Number(incidentsPage) || 1,
            p_histories_page: Number(historiesPage) || 1,
        }),
};

export const notifications = {
    list: () => rpc('notifications_list'),
    markRead: (id) => rpc('notifications_mark_read', { p_id: id }),
    markAllRead: () => rpc('notifications_mark_all_read'),
};

export const catalogs = {
    data: (filters, page = 1) => rpc('catalogs_data', { p_filters: filters, p_page: Number(page) || 1 }),
    store: (data) => rpc('catalog_store', { p_data: data }),
    update: (id, data) => rpc('catalog_update', { p_id: id, p_data: data }),
    updateStatus: (id, status, reason) => rpc('catalog_update_status', { p_id: id, p_status: status, p_reason: reason || null }),
    destroy: (id) => rpc('catalog_destroy', { p_id: id }),
};

export const users = {
    data: (filters, page = 1) => rpc('users_data', { p_filters: filters, p_page: Number(page) || 1 }),
    store: (u) =>
        rpc('admin_create_user', {
            p_name: u.name,
            p_username: u.username,
            p_password: u.password,
            p_role_id: u.role_id ? Number(u.role_id) : null,
            p_badge_number: u.badge_number || null,
        }),
    update: (u) =>
        rpc('admin_update_user', {
            p_id: Number(u.id),
            p_name: u.name,
            p_username: u.username,
            p_email: u.email || null,
            p_role_id: u.role_id ? Number(u.role_id) : null,
            p_badge_number: u.badge_number || null,
            p_password: u.password || null,
        }),
    toggleStatus: (id) => rpc('admin_toggle_user_status', { p_id: id }),
    destroy: (id) => rpc('admin_delete_user', { p_id: id }),
};

export const roles = {
    data: (search) => rpc('roles_data', { p_search: search || null }),
    detail: (id) => rpc('role_detail', { p_role_id: Number(id) }),
    store: (r) => rpc('role_store', { p_name: r.name, p_slug: r.slug, p_description: r.description || null, p_color: r.color }),
    update: (r) =>
        rpc('role_update', { p_id: Number(r.id), p_name: r.name, p_slug: r.slug, p_description: r.description || null, p_color: r.color }),
    destroy: (id) => rpc('role_destroy', { p_id: id }),
    updatePermissions: (id, ids) => rpc('role_update_permissions', { p_id: Number(id), p_permission_ids: ids.map(Number) }),
    updateScopes: (id, view, attend, assign) =>
        rpc('role_update_scopes', { p_id: Number(id), p_view: view.map(Number), p_attend: attend.map(Number), p_assign: assign.map(Number) }),
};

export const profile = {
    update: (name, email, username) => rpc('profile_update', { p_name: name, p_email: email || null, p_username: username ?? null }),
    changePassword: (current, password, confirmation) =>
        rpc('profile_change_password', { p_current: current, p_password: password, p_password_confirmation: confirmation }),
    destroy: (password) => rpc('profile_destroy', { p_password: password }),
};

export const lookups = () => rpc('app_lookups');
