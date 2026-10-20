// App\Models\Role — paleta táctica institucional de distintivos

export const COLOR_PRESETS = {
    purple: { label: 'Púrpura (Admin)', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    cyan: { label: 'Cian (GTS Técnico)', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    amber: { label: 'Ámbar (APOC-CCO)', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    orange: { label: 'Naranja (APOC-CSA)', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
    emerald: { label: 'Esmeralda (Operaciones)', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    blue: { label: 'Azul (Comunicaciones)', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    rose: { label: 'Rosa (Seguridad Crítica)', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    slate: { label: 'Pizarra (Estándar)', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
};

// Role::getBadgeClasses
export function badgeClasses(role) {
    return {
        bg: role?.badge_bg || 'bg-slate-500/10',
        text: role?.badge_text || 'text-slate-400',
        border: role?.badge_border || 'border-slate-500/20',
    };
}

// Role::isProtectedFromDeletion — únicamente ADMINISTRADOR
export const isProtectedFromDeletion = (role) => role?.slug === 'admin';

export const MODULES = {
    incidents: 'Incidencias Operativas',
    users: 'Usuarios y Cuadrillas',
    roles: 'Roles y Permisos',
    reports: 'Reportes e Indicadores',
    audit: 'Auditoría y Seguridad',
};

export const MODULE_ICONS = {
    incidents: 'confirmation_number',
    users: 'group',
    roles: 'admin_panel_settings',
    reports: 'bar_chart',
    audit: 'manage_history',
    dashboard: 'dashboard',
};

// Generador de slug del formulario de roles
export function generateSlug(name) {
    return String(name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
