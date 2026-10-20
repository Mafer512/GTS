// resources/views/users/index.blade.php (UserController)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import * as gates from '../../policies/gates.js';
import { navigate, reload } from '../../lib/router.js';
import { flash, takeFlash } from '../../lib/flash.js';
import { toApiError } from '../../lib/api.js';
import { users } from '../../services/appServices.js';
import { pagination, alertBanner, configTabs } from '../components/ui.js';

Alpine.data('usersPage', (defaultRoleId) => ({
    showCreateModal: false,
    showEditModal: false,
    showDeleteModal: false,
    createUser: { name: '', username: '', role_id: defaultRoleId, badge_number: '', password: '' },
    editUser: { id: null, name: '', username: '', email: '', role_id: '', badge_number: '', password: '' },
    deleteUser: { id: null, name: '' },
    saving: false,
    modalError: '',
    pageError: '',
    openCreate() {
        this.createUser = { name: '', username: '', role_id: defaultRoleId, badge_number: '', password: '' };
        this.modalError = '';
        this.showCreateModal = true;
    },
    openEdit(user) {
        this.editUser = { ...user, password: '' };
        this.modalError = '';
        this.showEditModal = true;
    },
    openDelete(id, name) {
        this.deleteUser = { id, name };
        this.modalError = '';
        this.showDeleteModal = true;
    },
    async run(action, flagName = null) {
        if (this.saving) return;
        this.saving = true;
        this.modalError = '';
        this.pageError = '';
        try {
            const result = await action();
            flash('status_message', result.message);
            if (flagName) this[flagName] = false;
            reload();
        } catch (e) {
            if (flagName) this.modalError = toApiError(e).message;
            else this.pageError = toApiError(e).message;
            this.saving = false;
        }
    },
    store() {
        return this.run(() => users.store(this.createUser), 'showCreateModal');
    },
    update() {
        return this.run(() => users.update(this.editUser), 'showEditModal');
    },
    toggle(id) {
        return this.run(() => users.toggleStatus(id));
    },
    destroy() {
        return this.run(() => users.destroy(this.deleteUser.id), 'showDeleteModal');
    },
}));

Alpine.data('userFilters', (initial) => ({
    f: { search: '', role_id: '', is_active: '', ...initial },
    submit() {
        navigate('/configuracion/usuarios', this.f);
    },
}));

const field = 'w-full bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-2 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]';
const fieldLabel = 'block text-xs font-semibold text-[#8D98A8] mb-1';

function roleBadge(u) {
    const b = (classes, icon, text) => html`<span class="${cls('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border', classes)}">
        <span class="material-symbols-outlined text-[13px]">${icon}</span><span>${text}</span></span>`;
    if (u.is_admin) return b('bg-purple-500/10 text-purple-400 border-purple-500/20', 'shield_person', 'ADMINISTRADOR');
    if (u.is_gts) return b('bg-cyan-500/10 text-cyan-400 border-cyan-500/20', 'build', 'TÉCNICO GTS');
    if (u.is_apoc_cco) return b('bg-amber-500/10 text-amber-400 border-amber-500/20', 'desktop_windows', 'APOC-CCO');
    if (u.is_apoc_csa) return b('bg-orange-500/10 text-orange-400 border-orange-500/20', 'desktop_windows', 'APOC-CSA');
    if (u.is_apoc) return b('bg-amber-500/10 text-amber-400 border-amber-500/20', 'desktop_windows', 'OPERADOR APOC');
    const role = u.role;
    const classes = role?.badge_bg ? `${role.badge_bg} ${role.badge_text} ${role.badge_border}` : 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    return b(classes, 'badge', role?.name ?? 'USUARIO');
}

function modal(flag, title, icon, body, border = 'border-[#263241]', maxWidth = 'sm:max-w-md') {
    return html`<div x-show="${flag}" x-cloak class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" @keydown.escape.window="${flag} = false">
        <div class="flex items-center justify-center min-h-screen px-4 py-8">
            <div x-show="${flag}" @click="${flag} = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
            <div x-show="${flag}" class="${cls('relative bg-[#11151B] border rounded-2xl text-left overflow-hidden shadow-2xl w-full p-6', border, maxWidth)}">
                ${title
                    ? html`<div class="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                        <h3 class="text-base font-bold text-[#F2F5F8] flex items-center gap-2"><span class="material-symbols-outlined text-[20px] text-[#3D82C6]">${icon}</span><span>${title}</span></h3>
                        <button type="button" @click="${flag} = false" class="text-[#707B8A] hover:text-[#DDE3EA]"><span class="material-symbols-outlined text-[18px]">close</span></button>
                    </div>`
                    : ''}
                <div x-show="modalError" x-cloak class="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-rose-400">error</span><span x-text="modalError"></span>
                </div>
                ${body}
            </div>
        </div>
    </div>`;
}

export default {
    name: 'users.index',
    title: 'Usuarios',
    async render({ query }) {
        const filters = {};
        ['search', 'role_id', 'is_active'].forEach((k) => {
            if (query[k] !== undefined && query[k] !== '') filters[k] = query[k];
        });
        const d = await users.data(filters, query.page || 1);
        const flashes = takeFlash();
        const mt = d.metrics;
        const roleOptions = d.roles.map((r) => html`<option value="${r.id}">${r.name}</option>`);

        return html`<div x-data="usersPage(${js(String(d.roles[0]?.id ?? ''))})" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${alertBanner('success', flashes.status_message)}
            <template x-if="pageError"><div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-rose-400">error</span><span class="font-medium" x-text="pageError"></span></div>
                <button type="button" @click="pageError = ''" class="text-rose-400 hover:text-rose-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>

            ${configTabs('users', { showUsers: true, showRoles: gates.rolesView() })}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <a href="#/perfil" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Configuración</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Usuarios</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Gestión de Usuarios y Cuadrillas</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#3D82C6] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">admin_panel_settings</span><span>Control de Cuentas</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Administración de personal operativo APOC, especialistas técnicos GTS y administradores del sistema bajo norma aeronáutica.</p>
                </div>
                ${d.can_create
                    ? html`<div class="flex items-center gap-3 self-start md:self-auto">
                        <button type="button" @click="openCreate()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all group">
                            <span class="material-symbols-outlined text-[18px]">person_add</span><span>Registrar Usuario</span>
                        </button>
                    </div>`
                    : ''}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                ${[
                    ['Total Usuarios', mt.total, 'text-[#F2F5F8]'],
                    ['Activos', mt.active, 'text-emerald-400'],
                    ['Inactivos', mt.inactive, 'text-[#8D98A8]'],
                    ['GTS Técnicos', mt.gts, 'text-cyan-400'],
                ].map(([l, v, c]) => html`<div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">${l}</span>
                    <span class="${cls('text-xl font-bold font-mono mt-1', c)}">${v}</span>
                </div>`)}
                <div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">APOC (CCO / CSA)</span>
                    <span class="text-xl font-bold font-mono text-amber-400 mt-1">${mt.apoc_cco} <span class="text-[11px] text-[#8D98A8] font-sans">CCO</span> · ${mt.apoc_csa} <span class="text-[11px] text-[#8D98A8] font-sans">CSA</span></span>
                </div>
                <div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">Administradores</span>
                    <span class="text-xl font-bold font-mono text-purple-400 mt-1">${mt.admin}</span>
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-2xl shadow-sm">
                <form x-data="userFilters(${js(filters)})" @submit.prevent="submit()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center" autocomplete="off">
                    <div class="lg:col-span-5 relative">
                        <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707B8A] text-[18px] pointer-events-none">search</span>
                        <input type="text" x-model="f.search" placeholder="Buscar por nombre, email o placa..." class="w-full bg-[#0B0F14] border border-[#263241] rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#DDE3EA] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6]">
                    </div>
                    <div class="lg:col-span-3">
                        <select x-model="f.role_id" class="w-full bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-2 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]">
                            <option value="">Todos los roles</option>
                            ${d.roles.map((r) => html`<option value="${r.id}" ${String(filters.role_id) === String(r.id) ? 'selected' : ''}>${r.name}</option>`)}
                        </select>
                    </div>
                    <div class="lg:col-span-2">
                        <select x-model="f.is_active" class="w-full bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-2 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]">
                            <option value="">Estado: Todos</option>
                            <option value="1">Solo Activos</option>
                            <option value="0">Solo Inactivos</option>
                        </select>
                    </div>
                    <div class="lg:col-span-2 flex items-center gap-2">
                        <button type="submit" class="flex-1 px-3 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold transition-colors text-center">Filtrar</button>
                        ${Object.keys(filters).length
                            ? html`<a href="#/configuracion/usuarios" class="p-2 bg-[#1E293B] hover:bg-[#334155] text-[#707B8A] hover:text-[#DDE3EA] rounded-xl transition-colors" title="Limpiar filtros"><span class="material-symbols-outlined text-[18px]">filter_alt_off</span></a>`
                            : ''}
                    </div>
                </form>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-[#0B0F14] border-b border-[#263241] flex items-center justify-between text-xs">
                    <span class="font-bold text-[#F2F5F8] flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-[#3D82C6]">badge</span><span>Usuarios Registrados (${d.meta.total})</span></span>
                    <span class="text-[#707B8A] text-[11px]">Control de acceso basado en roles RBAC</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#101923] border-b border-[#263241] text-[#8D98A8] text-[11px] font-semibold uppercase tracking-wider">
                                <th class="py-3 px-4">Usuario</th><th class="py-3 px-4">Placa / Credencial</th><th class="py-3 px-4">Rol Institucional</th>
                                <th class="py-3 px-4 text-center">Estado</th><th class="py-3 px-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1F2937] text-xs text-[#DDE3EA]">
                            ${d.users.length
                                ? d.users.map((u) => {
                                      const isMe = u.id === d.current_user_id;
                                      const editPayload = { id: u.id, name: u.name, username: u.username, email: u.email ?? '', role_id: String(u.role_id ?? ''), badge_number: u.badge_number ?? '' };
                                      return html`<tr class="${cls('hover:bg-[#151B23] transition-colors', !u.is_active && 'opacity-60 bg-black/20')}">
                                        <td class="py-3.5 px-4 whitespace-nowrap">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full bg-[#1E293B] border border-[#263241] flex items-center justify-center font-bold text-xs text-[#3D82C6] shrink-0">${u.name.slice(0, 1)}</div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-[#F2F5F8] flex items-center gap-1.5"><span>${u.name}</span>${isMe ? html`<span class="px-1.5 py-0.2 bg-[#3D82C6]/20 text-[#3D82C6] rounded text-[9px] font-semibold">TÚ</span>` : ''}</span>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-[11px] font-mono text-[#3D82C6]">@<span>${u.username}</span></span>
                                                        ${u.email ? html`<span class="text-[10px] text-[#707B8A]">(${u.email})</span>` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-[#A8B0BC]">${u.badge_number || '—'}</td>
                                        <td class="py-3.5 px-4 whitespace-nowrap">${roleBadge(u)}</td>
                                        <td class="py-3.5 px-4 whitespace-nowrap text-center">
                                            ${u.is_active
                                                ? html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ACTIVO</span>`
                                                : html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">INACTIVO</span>`}
                                        </td>
                                        <td class="py-3.5 px-4 whitespace-nowrap text-center">
                                            <div class="flex items-center justify-center gap-1.5">
                                                ${d.can_edit
                                                    ? html`<button type="button" @click="openEdit(${js(editPayload)})" class="p-1.5 text-[#8D98A8] hover:text-[#F2F5F8] hover:bg-[#1E293B] rounded-lg transition-colors" title="Editar información"><span class="material-symbols-outlined text-[16px]">edit</span></button>`
                                                    : ''}
                                                ${!isMe && d.can_edit
                                                    ? html`<button type="button" @click="toggle(${u.id})" class="${cls('p-1.5 rounded-lg transition-colors', u.is_active ? 'text-amber-400 hover:text-amber-200 hover:bg-amber-500/10' : 'text-emerald-400 hover:text-emerald-200 hover:bg-emerald-500/10')}" title="${u.is_active ? 'Desactivar cuenta' : 'Activar cuenta'}">
                                                        <span class="material-symbols-outlined text-[16px]">${u.is_active ? 'block' : 'check_circle'}</span></button>`
                                                    : ''}
                                                ${!isMe && d.can_delete
                                                    ? html`<button type="button" @click="openDelete(${u.id}, ${js(u.name)})" class="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" title="Eliminar cuenta permanentemente"><span class="material-symbols-outlined text-[16px]">delete</span></button>`
                                                    : ''}
                                            </div>
                                        </td>
                                    </tr>`;
                                  })
                                : html`<tr><td colspan="5" class="py-8 text-center text-[#707B8A]">No se encontraron usuarios que coincidan con los filtros aplicados.</td></tr>`}
                        </tbody>
                    </table>
                </div>
                ${d.meta.last_page > 1 ? html`<div class="p-4 bg-[#0B0F14] border-t border-[#263241]">${pagination(d.meta, '/configuracion/usuarios', query)}</div>` : ''}
            </div>

            ${modal('showCreateModal', 'Alta de Usuario Institucional', 'person_add', html`<form @submit.prevent="store()" class="mt-4 flex flex-col gap-4" autocomplete="off">
                <div><label class="${fieldLabel}">Nombre Completo:</label><input type="text" x-model="createUser.name" required maxlength="255" placeholder="Ej. Ing. Juan Pérez" class="${field}"></div>
                <div><label class="${fieldLabel}">Nombre de Usuario (Login):</label><input type="text" x-model="createUser.username" required maxlength="50" pattern="[a-zA-Z0-9._\\-]+" placeholder="ej. jperez" class="${field}"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="${fieldLabel}">Rol Asignado:</label><select x-model="createUser.role_id" required class="${field}">${roleOptions}</select></div>
                    <div><label class="${fieldLabel}">Placa / Credencial:</label><input type="text" x-model="createUser.badge_number" maxlength="50" placeholder="Ej. GTS-312" class="${field}"></div>
                </div>
                <div><label class="${fieldLabel}">Contraseña Inicial:</label><input type="password" x-model="createUser.password" required minlength="8" autocomplete="new-password" placeholder="Mínimo 8 caracteres" class="${field}"></div>
                <div class="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-[#1F2937]">
                    <button type="button" @click="showCreateModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-4 py-2 bg-[#123A70] hover:bg-[#164A8A] text-white rounded-xl text-xs font-bold disabled:opacity-60">Guardar Usuario</button>
                </div>
            </form>`)}

            ${modal('showEditModal', 'Editar Usuario', 'edit', html`<form @submit.prevent="update()" class="mt-4 flex flex-col gap-4" autocomplete="off">
                <div><label class="${fieldLabel}">Nombre Completo:</label><input type="text" x-model="editUser.name" required maxlength="255" class="${field}"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="${fieldLabel}">Nombre de Usuario (Login):</label><input type="text" x-model="editUser.username" required maxlength="50" pattern="[a-zA-Z0-9._\\-]+" class="${field}"></div>
                    <div><label class="${fieldLabel}">Correo Institucional (Opcional):</label><input type="email" x-model="editUser.email" maxlength="255" class="${field}"></div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="${fieldLabel}">Rol Asignado:</label><select x-model="editUser.role_id" required class="${field}">${roleOptions}</select></div>
                    <div><label class="${fieldLabel}">Placa / Credencial:</label><input type="text" x-model="editUser.badge_number" maxlength="50" class="${field}"></div>
                </div>
                <div><label class="${fieldLabel}">Nueva Contraseña (Opcional):</label><input type="password" x-model="editUser.password" minlength="8" autocomplete="new-password" placeholder="Dejar en blanco para conservar actual" class="${field}"></div>
                <div class="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-[#1F2937]">
                    <button type="button" @click="showEditModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-4 py-2 bg-[#3D82C6] hover:bg-[#316cb0] text-white rounded-xl text-xs font-bold disabled:opacity-60">Actualizar Usuario</button>
                </div>
            </form>`)}

            ${modal('showDeleteModal', null, null, html`<div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[28px]">warning</span></div>
                    <div class="flex flex-col">
                        <h3 class="text-base font-bold text-[#F2F5F8]">Confirmar Eliminación Permanente de Cuenta</h3>
                        <p class="text-xs text-[#8D98A8] mt-1.5 leading-relaxed">¿Está seguro de que desea eliminar permanentemente al usuario <strong class="text-rose-400 font-bold" x-text="deleteUser.name"></strong>?</p>
                        <div class="mt-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 text-[11px] text-rose-300 leading-relaxed flex flex-col gap-1">
                            <span class="font-semibold text-rose-400 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">shield</span><span>Gestión segura de dependencias y auditoría OACI:</span></span>
                            <span>• La cuenta de usuario será purgada físicamente de PostgreSQL de manera definitiva.</span>
                            <span>• Las incidencias y registros históricos vinculados serán reasignados y documentados bajo la administración para resguardar la trazabilidad pericial.</span>
                        </div>
                    </div>
                </div>
                <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#1F2937]">
                    <button type="button" @click="showDeleteModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold cursor-pointer">Cancelar</button>
                    <button type="button" @click="destroy()" :disabled="saving" class="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/30 transition-all cursor-pointer disabled:opacity-60">
                        <span class="material-symbols-outlined text-[16px]">delete_forever</span><span>Eliminar Cuenta Definitivamente</span>
                    </button>
                </div>`, 'border-rose-500/30', 'sm:max-w-lg')}
        </div>`;
    },
};
