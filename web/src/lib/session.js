// Usuario autenticado: perfil, permisos y alcances (equivalente a auth()->user() + App\Models\User)

const state = {
    user: null,
    permissions: [],
    flags: {},
    roleTag: '',
    taggedName: '',
    scopes: { view: [], attend: [], assign: [] },
};

export function setSession(boot) {
    state.user = boot?.user ?? null;
    state.permissions = boot?.permissions ?? [];
    state.flags = boot?.flags ?? {};
    state.roleTag = boot?.role_tag ?? '';
    state.taggedName = boot?.tagged_name ?? '';
    state.scopes = boot?.scopes ?? { view: [], attend: [], assign: [] };
}

export const clearSession = () => setSession(null);

export const user = () => state.user;
export const isAuthenticated = () => Boolean(state.user?.id);
export const isActive = () => Boolean(state.user?.is_active);
export const isAdmin = () => Boolean(state.flags.is_admin);
export const isGts = () => Boolean(state.flags.is_gts);
export const isApoc = () => Boolean(state.flags.is_apoc);
export const isApocCco = () => Boolean(state.flags.is_apoc_cco);
export const isApocCsa = () => Boolean(state.flags.is_apoc_csa);
export const roleTag = () => state.roleTag;
export const taggedName = () => state.taggedName;

// User::hasPermission (el Administrador posee bypass total)
export const can = (permission) => isAdmin() || state.permissions.includes(permission);
export const canAny = (...permissions) => isAdmin() || permissions.flat().some((p) => state.permissions.includes(p));

export function roleName() {
    return state.user?.role?.name ?? state.user?.role?.slug ?? 'GTS';
}

// Subtítulo del menú de usuario (topbar)
export function topbarRoleLabel() {
    if (isGts()) return 'GTS • Operaciones';
    if (isApoc()) return 'APOC • Control';
    if (isAdmin()) return 'ADMIN • Sistema';
    return `${state.user?.role?.name ?? 'Usuario'} • Sistema`;
}

export function profileLabel() {
    if (isGts()) return 'Perfil GTS';
    if (isApoc()) return 'Perfil APOC';
    if (isAdmin()) return 'Perfil Admin';
    return `Perfil ${state.user?.role?.name ?? 'Usuario'}`;
}

export function initials(name = state.user?.name ?? '') {
    const parts = name.split(' ');
    return parts.length >= 2
        ? (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
        : name.slice(0, 2).toUpperCase();
}
