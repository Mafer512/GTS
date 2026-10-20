// resources/views/roles/manage.blade.php (RoleController@manage / updatePermissions / updateScopes)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import * as gates from '../../policies/gates.js';
import { reload } from '../../lib/router.js';
import { flash, takeFlash } from '../../lib/flash.js';
import { toApiError } from '../../lib/api.js';
import { roles } from '../../services/appServices.js';
import { alertBanner, configTabs } from '../components/ui.js';
import { MODULES, MODULE_ICONS, badgeClasses } from '../../models/role.js';

let page = null;

Alpine.data('roleManagePage', () => ({
    activeTab: 'permissions',
    permissionIds: [...page.permissionIds],
    view: [...page.view],
    attend: [...page.attend],
    assign: [...page.assign],
    saving: false,
    error: '',
    toggleAllModule(moduleKey, check) {
        const ids = page.moduleIds[moduleKey] ?? [];
        const set = new Set(this.permissionIds);
        ids.forEach((id) => (check ? set.add(id) : set.delete(id)));
        this.permissionIds = [...set];
    },
    toggleAllScopes(type, check) {
        this[type] = check ? [...page.allRoleIds] : [];
    },
    async run(action) {
        if (this.saving) return;
        this.saving = true;
        this.error = '';
        try {
            const result = await action();
            flash('status_message', result.message);
            reload();
        } catch (e) {
            this.error = toApiError(e).message;
            this.saving = false;
        }
    },
    savePermissions() {
        return this.run(() => roles.updatePermissions(page.roleId, this.permissionIds));
    },
    saveScopes() {
        return this.run(() => roles.updateScopes(page.roleId, this.view, this.attend, this.assign));
    },
}));

function scopeSection(type, icon, iconClass, title, subtitle, hoverClass, allRoles) {
    return html`<div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E2734] gap-3">
            <div class="flex items-center gap-2.5">
                <span class="${cls('material-symbols-outlined text-[22px]', iconClass)}">${icon}</span>
                <div><h3 class="text-sm font-bold text-[#F2F5F8]">${title}</h3><p class="text-[11px] text-[#8D98A8]">${subtitle}</p></div>
            </div>
            <div class="flex items-center gap-2 self-end sm:self-auto">
                <button type="button" @click="toggleAllScopes('${type}', true)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#3D82C6] text-[11px] font-semibold border border-[#263241] transition-colors">Seleccionar todos</button>
                <button type="button" @click="toggleAllScopes('${type}', false)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#8D98A8] hover:text-[#F2F5F8] text-[11px] font-semibold border border-[#263241] transition-colors">Limpiar</button>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${allRoles.map((r) => {
                const b = badgeClasses(r);
                return html`<label class="flex items-center justify-between p-3 rounded-xl bg-[#0D1117] hover:bg-[#161D26] border border-[#263241] cursor-pointer transition-colors group">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <input type="checkbox" value="${r.id}" x-model.number="${type}" class="rounded bg-[#11151B] border-[#263241] text-[#123A70] focus:ring-0 focus:ring-offset-0 cursor-pointer">
                        <div class="flex flex-col min-w-0">
                            <span class="${cls('font-semibold text-xs text-[#F2F5F8] truncate', hoverClass)}">${r.name}</span>
                            <span class="font-mono text-[10px] text-[#707B8A]">${r.slug}</span>
                        </div>
                    </div>
                    <span class="${cls('inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-bold font-mono tracking-wider border shrink-0', b.bg, b.text, b.border)}">${r.name}</span>
                </label>`;
            })}
        </div>
    </div>`;
}

function saveBar(roleName, text, buttonLabel, action, canSave) {
    return html`<div class="sticky bottom-4 p-4 rounded-2xl bg-[#11151B]/95 backdrop-blur-md border border-[#263241] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl z-30">
        <div class="text-xs text-[#8D98A8]">${text} <strong class="text-[#F2F5F8]">${roleName}</strong>.</div>
        <div class="flex items-center gap-3">
            <a href="#/configuracion/roles" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] text-xs font-semibold transition-colors">Cancelar</a>
            ${canSave
                ? html`<button type="button" @click="${action}" :disabled="saving" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all disabled:opacity-60">
                    <span class="material-symbols-outlined text-[18px]">save</span><span>${buttonLabel}</span></button>`
                : ''}
        </div>
    </div>`;
}

export default {
    name: 'roles.manage',
    title: 'Configuración de rol',
    async render({ params }) {
        const d = await roles.detail(params.id);
        const role = d.role;
        const flashes = takeFlash();
        const byModule = {};
        d.permissions.forEach((p) => {
            (byModule[p.module] ||= []).push(p);
        });

        page = {
            roleId: role.id,
            permissionIds: d.assigned_permission_ids,
            view: d.view_scope_role_ids,
            attend: d.attend_scope_role_ids,
            assign: d.assign_scope_role_ids,
            allRoleIds: d.all_roles.map((r) => r.id),
            moduleIds: Object.fromEntries(Object.entries(byModule).map(([k, list]) => [k, list.map((p) => p.id)])),
        };

        const b = badgeClasses(role);
        const scopeCount = d.view_scope_role_ids.length + d.attend_scope_role_ids.length + d.assign_scope_role_ids.length;

        return html`<div x-data="roleManagePage" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${alertBanner('success', flashes.status_message)}
            <template x-if="error"><div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-rose-400">error</span><span class="font-medium" x-text="error"></span></div>
                <button type="button" @click="error = ''" class="text-rose-400 hover:text-rose-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>

            ${configTabs('roles', { showUsers: gates.usersView(), showRoles: true })}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <a href="#/configuracion/roles" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Roles</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">${role.name}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">${role.name}</h1>
                        <span class="${cls('inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold font-mono tracking-wider border', b.bg, b.text, b.border)}">${role.name}</span>
                        <span class="font-mono text-xs text-[#707B8A] px-2 py-0.5 rounded bg-[#101923] border border-[#263241]">slug: ${role.slug}</span>
                        ${role.is_protected
                            ? html`<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><span class="material-symbols-outlined text-[14px]">lock</span><span>Protegido por Sistema</span></span>`
                            : ''}
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">${role.description || 'Configuración de capacidades operativas y alcances de comunicación.'}</p>
                </div>
                <div class="flex items-center gap-3 self-start md:self-auto">
                    <a href="#/configuracion/roles" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#101923] hover:bg-[#1B2735] text-[#8D98A8] hover:text-[#F2F5F8] text-xs font-semibold border border-[#263241] transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[16px]">arrow_back</span><span>Volver al Catálogo</span>
                    </a>
                </div>
            </div>

            ${role.slug === 'admin'
                ? html`<div class="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
                    <span class="material-symbols-outlined text-[24px] text-purple-400 shrink-0">admin_panel_settings</span>
                    <div class="flex flex-col gap-0.5">
                        <strong class="text-purple-300 font-bold">Bypass de Seguridad Irrestricto para ADMINISTRADOR</strong>
                        <span>Por arquitectura de seguridad, la cuenta con rol <strong>ADMINISTRADOR</strong> posee acceso total a todos los módulos y funciones del sistema, sin importar si algún checkbox se encuentra desmarcado.</span>
                    </div>
                </div>`
                : ''}

            <div class="flex items-center gap-3 border-b border-[#263241] overflow-x-auto">
                <button type="button" @click="activeTab = 'permissions'" :class="activeTab === 'permissions' ? 'text-[#3D82C6] border-b-2 border-[#3D82C6] font-bold' : 'text-[#8D98A8] hover:text-[#F2F5F8] font-medium'" class="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm transition-all outline-none whitespace-nowrap">
                    <span class="material-symbols-outlined text-[18px]">shield</span><span>Matriz de Permisos Granulares</span>
                    <span class="px-2 py-0.2 rounded-full text-[11px] font-mono bg-[#101923] text-[#D6DCE4] border border-[#263241]">${d.assigned_permission_ids.length} activos</span>
                </button>
                <button type="button" @click="activeTab = 'scopes'" :class="activeTab === 'scopes' ? 'text-[#3D82C6] border-b-2 border-[#3D82C6] font-bold' : 'text-[#8D98A8] hover:text-[#F2F5F8] font-medium'" class="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm transition-all outline-none whitespace-nowrap">
                    <span class="material-symbols-outlined text-[18px]">hub</span><span>Matriz de Alcances Operativos (Inter-Rol)</span>
                    <span class="px-2 py-0.2 rounded-full text-[11px] font-mono bg-[#101923] text-[#D6DCE4] border border-[#263241]">${scopeCount} reglas</span>
                </button>
            </div>

            <div x-show="activeTab === 'permissions'" class="flex flex-col gap-6">
                ${Object.entries(MODULES).map(([key, title]) => {
                    const perms = byModule[key] ?? [];
                    if (!perms.length) return '';
                    return html`<div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E2734] gap-3">
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-[20px] text-[#3D82C6]">${MODULE_ICONS[key] ?? 'folder'}</span>
                                <h2 class="text-sm sm:text-base font-bold text-[#F2F5F8]">${title}</h2>
                                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0D1117] text-[#8D98A8] border border-[#263241]">${perms.length} capacidades</span>
                            </div>
                            <div class="flex items-center gap-2 self-end sm:self-auto">
                                <button type="button" @click="toggleAllModule('${key}', true)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#3D82C6] text-[11px] font-semibold border border-[#263241] transition-colors">Marcar todos</button>
                                <button type="button" @click="toggleAllModule('${key}', false)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#8D98A8] hover:text-[#F2F5F8] text-[11px] font-semibold border border-[#263241] transition-colors">Desmarcar</button>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            ${perms.map((p) => html`<label class="flex items-start gap-3 p-3 rounded-xl bg-[#0D1117] hover:bg-[#161D26] border border-[#263241] cursor-pointer transition-colors group">
                                <input type="checkbox" value="${p.id}" x-model.number="permissionIds" class="mt-1 rounded bg-[#11151B] border-[#263241] text-[#123A70] focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <span class="font-semibold text-xs text-[#F2F5F8] group-hover:text-[#3D82C6] transition-colors">${p.name}</span>
                                    <span class="font-mono text-[10px] text-[#707B8A]">${p.slug}</span>
                                    ${p.description ? html`<p class="text-[11px] text-[#8D98A8] mt-0.5 leading-tight">${p.description}</p>` : ''}
                                </div>
                            </label>`)}
                        </div>
                    </div>`;
                })}
                ${saveBar(role.name, 'Los cambios en permisos se aplican de forma inmediata para los usuarios con rol', 'Guardar Matriz de Permisos', 'savePermissions()', d.can_manage_permissions)}
            </div>

            <div x-show="activeTab === 'scopes'" x-cloak class="flex flex-col gap-6">
                <div class="p-4 rounded-2xl bg-[#0D1117] border border-[#263241] flex flex-col sm:flex-row items-start gap-4">
                    <div class="p-2.5 rounded-xl bg-[#101923] border border-[#263241] text-[#3D82C6] shrink-0"><span class="material-symbols-outlined text-[28px]">hub</span></div>
                    <div class="flex flex-col gap-1 text-xs text-[#8D98A8]">
                        <h3 class="text-sm font-bold text-[#F2F5F8]">Arquitectura de Desacoplamiento Operativo</h3>
                        <p>Esta matriz define las reglas de interacción del rol <strong class="text-[#F2F5F8]">${role.name}</strong> frente a los demás roles del aeropuerto. Los tres tipos de alcance son <strong class="text-cyan-400">totalmente independientes entre sí</strong>:</p>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                            <div class="p-2.5 rounded-xl bg-[#11151B] border border-[#1D2530]"><strong class="text-[#93C5FD] block mb-0.5">1. Visualización (Ver)</strong><span>Determina qué incidencias aparecen en listados, tableros y búsquedas del usuario.</span></div>
                            <div class="p-2.5 rounded-xl bg-[#11151B] border border-[#1D2530]"><strong class="text-[#A78BFA] block mb-0.5">2. Atención (Atender)</strong><span>Determina de qué roles puede iniciar diagnóstico, tomar o registrar solución técnica.</span></div>
                            <div class="p-2.5 rounded-xl bg-[#11151B] border border-[#1D2530]"><strong class="text-[#FBBF24] block mb-0.5">3. Asignación (Asignar)</strong><span>Determina hacia qué roles puede transferir o asignar tickets el usuario.</span></div>
                        </div>
                    </div>
                </div>
                ${scopeSection('view', 'visibility', 'text-blue-400', '1. Alcance de Visualización', `¿Incidencias creadas por qué roles puede ver el usuario con rol ${role.name}?`, 'group-hover:text-[#3D82C6]', d.all_roles)}
                ${scopeSection('attend', 'build', 'text-purple-400', '2. Alcance de Atención Técnica', '¿Incidencias originadas por qué roles puede atender, diagnosticar y resolver este rol?', 'group-hover:text-purple-300', d.all_roles)}
                ${scopeSection('assign', 'person_add', 'text-amber-400', '3. Alcance de Asignación', '¿Hacia usuarios de qué roles puede este perfil delegar o asignar incidencias?', 'group-hover:text-amber-300', d.all_roles)}
                ${saveBar(role.name, 'Las reglas de alcance delimitan automáticamente los filtros de visualización y asignación del rol', 'Guardar Matriz de Alcances', 'saveScopes()', d.can_manage_scopes)}
            </div>
        </div>`;
    },
};
