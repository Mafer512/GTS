// resources/views/roles/index.blade.php (RoleController@index / store / update / destroy)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import * as gates from '../../policies/gates.js';
import { navigate, reload } from '../../lib/router.js';
import { flash, takeFlash } from '../../lib/flash.js';
import { toApiError } from '../../lib/api.js';
import { roles } from '../../services/appServices.js';
import { alertBanner, configTabs } from '../components/ui.js';
import { COLOR_PRESETS, badgeClasses, isProtectedFromDeletion, generateSlug } from '../../models/role.js';

Alpine.data('rolesPage', () => ({
    showCreateModal: false,
    showEditModal: false,
    showDeleteModal: false,
    createRole: { name: '', slug: '', description: '', color: 'emerald', slugTouched: false },
    editRole: { id: null, name: '', slug: '', description: '', color: 'slate', is_protected: false },
    deleteRole: { id: null, name: '', usersCount: 0 },
    presets: COLOR_PRESETS,
    saving: false,
    modalError: '',
    search: '',
    generateSlug,
    openCreate() {
        this.createRole = { name: '', slug: '', description: '', color: 'emerald', slugTouched: false };
        this.modalError = '';
        this.showCreateModal = true;
    },
    openEdit(role) {
        this.editRole = {
            id: role.id,
            name: role.name,
            slug: role.slug,
            description: role.description || '',
            color: role.color || 'slate',
            is_protected: Boolean(role.is_protected),
        };
        this.modalError = '';
        this.showEditModal = true;
    },
    openDelete(id, name, usersCount = 0) {
        this.deleteRole = { id, name, usersCount };
        this.modalError = '';
        this.showDeleteModal = true;
    },
    async run(action, flagName, after = null) {
        if (this.saving) return;
        this.saving = true;
        this.modalError = '';
        try {
            const result = await action();
            flash('status_message', result.message);
            this[flagName] = false;
            if (after) after(result);
            else reload();
        } catch (e) {
            this.modalError = toApiError(e).message;
            this.saving = false;
        }
    },
    store() {
        return this.run(() => roles.store(this.createRole), 'showCreateModal', (r) => navigate(`/configuracion/roles/${r.id}`));
    },
    update() {
        return this.run(() => roles.update(this.editRole), 'showEditModal');
    },
    destroy() {
        return this.run(() => roles.destroy(this.deleteRole.id), 'showDeleteModal');
    },
}));

const input = 'px-3 py-2 bg-[#0D1117] border border-[#263241] rounded-xl text-xs text-[#F2F5F8] focus:outline-none focus:border-[#3D82C6]';

function colorPicker(model) {
    return html`<div class="flex flex-col gap-2">
        <label class="font-semibold text-[#8D98A8]">Color e Insignia Táctica *</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <template x-for="(data, key) in presets" :key="key">
                <label :class="${model}.color === key ? 'border-[#3D82C6] bg-[#162232]' : 'border-[#263241] bg-[#0D1117] hover:bg-[#161D26]'" class="flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors">
                    <input type="radio" :value="key" x-model="${model}.color" class="hidden">
                    <span :class="data.bg + ' ' + data.text + ' border ' + data.border" class="w-3.5 h-3.5 rounded-full inline-block shrink-0"></span>
                    <span class="text-[11px] font-medium truncate" x-text="data.label.split(' ')[0]"></span>
                </label>
            </template>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0D1117] border border-[#263241] flex items-center justify-between mt-1">
            <span class="text-[11px] text-[#707B8A]">Vista previa del distintivo:</span>
            <span :class="presets[${model}.color]?.bg + ' ' + presets[${model}.color]?.text + ' border ' + presets[${model}.color]?.border" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider" x-text="${model}.name || 'NUEVO ROL'"></span>
        </div>
    </div>`;
}

function modal(flag, icon, title, body, border = 'border-[#263241]', maxWidth = 'max-w-lg') {
    return html`<div x-show="${flag}" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div @click.outside="${flag} = false" class="${cls('bg-[#11151B] border rounded-2xl w-full p-6 shadow-2xl flex flex-col gap-5 text-xs text-[#D6DCE4] max-h-[92vh] overflow-y-auto', border, maxWidth)}">
            ${title
                ? html`<div class="flex items-center justify-between border-b border-[#263241] pb-3">
                    <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[20px] text-[#3D82C6]">${icon}</span><h2 class="text-base font-bold text-[#F2F5F8]">${title}</h2></div>
                    <button type="button" @click="${flag} = false" class="text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[18px]">close</span></button>
                </div>`
                : ''}
            <div x-show="modalError" x-cloak class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-rose-400">error</span><span x-text="modalError"></span>
            </div>
            ${body}
        </div>
    </div>`;
}

export default {
    name: 'roles.index',
    title: 'Roles y Permisos',
    async render({ query }) {
        const d = await roles.data(query.search);
        const flashes = takeFlash();
        const mt = d.metrics;

        return html`<div x-data="rolesPage" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${alertBanner('success', flashes.status_message)}
            ${configTabs('roles', { showUsers: gates.usersView(), showRoles: true })}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <a href="#/perfil" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Configuración</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Roles</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Gestión de Roles y Permisos</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#A78BFA] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">shield</span><span>Matriz Dinámica</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Definición de perfiles operativos, capacidades granulares del sistema y alcances de interacción inter-rol (ver, atender y asignar).</p>
                </div>
                ${d.can_create
                    ? html`<div class="flex items-center gap-3 self-start md:self-auto">
                        <button type="button" @click="openCreate()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all group">
                            <span class="material-symbols-outlined text-[18px]">add_moderator</span><span>Nuevo Rol</span>
                        </button>
                    </div>`
                    : ''}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                ${[
                    ['Total Roles', mt.total, 'text-[#F2F5F8]'],
                    ['Roles de Sistema', mt.protected, 'text-cyan-400'],
                    ['Roles Personalizados', mt.custom, 'text-emerald-400'],
                    ['Usuarios Asignados', mt.total_users, 'text-purple-400'],
                    ['Permisos Disponibles', mt.total_permissions, 'text-amber-400'],
                ].map(([l, v, c]) => html`<div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">${l}</span>
                    <span class="${cls('text-xl font-bold font-mono mt-1', c)}">${v}</span>
                </div>`)}
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <form x-data="{ term: ${js(query.search ?? '')} }" @submit.prevent="window.location.hash = '#/configuracion/roles' + (term ? '?search=' + encodeURIComponent(term) : '')" class="w-full sm:max-w-md relative flex items-center">
                    <span class="absolute left-3 text-[#707B8A] pointer-events-none"><span class="material-symbols-outlined text-[18px]">search</span></span>
                    <input type="text" x-model="term" placeholder="Buscar rol por nombre, slug o descripción..." class="w-full pl-9 pr-8 py-2 bg-[#0D1117] border border-[#263241] rounded-xl text-xs text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] transition-colors">
                    ${query.search ? html`<a href="#/configuracion/roles" class="absolute right-2.5 text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[16px]">close</span></a>` : ''}
                </form>
                <div class="text-xs text-[#707B8A]">Mostrando <span class="font-bold text-[#F2F5F8]">${d.roles.length}</span> rol(es) configurado(s)</div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#0D1117] text-[#8D98A8] uppercase tracking-wider text-[10px] border-b border-[#263241]">
                            <tr>
                                <th class="py-3 px-4 font-semibold">Rol / Identificador</th>
                                <th class="py-3 px-4 font-semibold text-center">Distintivo Táctico</th>
                                <th class="py-3 px-4 font-semibold text-center">Tipo</th>
                                <th class="py-3 px-4 font-semibold text-center">Usuarios</th>
                                <th class="py-3 px-4 font-semibold text-center">Permisos</th>
                                <th class="py-3 px-4 font-semibold text-center">Alcances</th>
                                <th class="py-3 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1D2530] text-[#D6DCE4]">
                            ${d.roles.length
                                ? d.roles.map((role) => {
                                      const b = badgeClasses(role);
                                      return html`<tr class="hover:bg-[#161D26] transition-colors">
                                        <td class="py-3 px-4">
                                            <div class="flex flex-col">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-bold text-sm text-[#F2F5F8]">${role.name}</span>
                                                    <span class="font-mono text-[11px] text-[#707B8A] px-1.5 py-0.2 rounded bg-[#0D1117] border border-[#263241]">${role.slug}</span>
                                                </div>
                                                <p class="text-[11px] text-[#8D98A8] line-clamp-1 mt-0.5">${role.description || 'Sin descripción registrada'}</p>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-center"><span class="${cls('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider border', b.bg, b.text, b.border)}">${role.name}</span></td>
                                        <td class="py-3 px-4 text-center">
                                            ${isProtectedFromDeletion(role)
                                                ? html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" title="Rol esencial de Administrador protegido contra eliminación"><span class="material-symbols-outlined text-[13px]">lock</span><span>Sistema</span></span>`
                                                : html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Rol eliminable"><span class="material-symbols-outlined text-[13px]">tune</span><span>Operativo</span></span>`}
                                        </td>
                                        <td class="py-3 px-4 text-center font-mono"><span class="${cls('px-2 py-0.5 rounded', role.users_count > 0 ? 'bg-[#101923] text-[#3D82C6] font-bold border border-[#263241]' : 'text-[#707B8A]')}">${role.users_count}</span></td>
                                        <td class="py-3 px-4 text-center font-mono">
                                            ${role.slug === 'admin'
                                                ? html`<span class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold" title="Bypass Total de Permisos">TODOS (Bypass)</span>`
                                                : html`<span class="px-2 py-0.5 rounded bg-[#101923] text-[#D6DCE4] border border-[#263241]">${role.permissions_count} / ${mt.total_permissions}</span>`}
                                        </td>
                                        <td class="py-3 px-4 text-center font-mono"><span class="px-2 py-0.5 rounded bg-[#101923] text-[#D6DCE4] border border-[#263241]">${role.operational_scopes_count} regla(s)</span></td>
                                        <td class="py-3 px-4 text-right">
                                            <div class="inline-flex items-center gap-1.5 justify-end">
                                                ${d.can_manage
                                                    ? html`<a href="#/configuracion/roles/${role.id}" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#123A70]/60 hover:bg-[#164A8A] text-white text-[11px] font-semibold border border-[#164A8A]/50 transition-colors shadow-sm" title="Configurar Permisos y Alcances Operativos">
                                                        <span class="material-symbols-outlined text-[15px]">security</span><span class="hidden sm:inline">Permisos y Alcances</span></a>`
                                                    : ''}
                                                ${d.can_edit
                                                    ? html`<button type="button" @click="openEdit(${js(role)})" class="p-1.5 rounded-lg bg-[#101923] hover:bg-[#1B2735] text-[#8D98A8] hover:text-[#F2F5F8] border border-[#263241] transition-colors" title="Editar información básica y apariencia del rol"><span class="material-symbols-outlined text-[16px]">edit</span></button>`
                                                    : ''}
                                                ${d.can_delete
                                                    ? isProtectedFromDeletion(role)
                                                        ? html`<button type="button" disabled class="p-1.5 rounded-lg bg-[#101923]/40 text-[#566170] border border-[#1D2530] cursor-not-allowed opacity-50" title="Rol de Administrador protegido: no se puede eliminar"><span class="material-symbols-outlined text-[16px]">lock</span></button>`
                                                        : html`<button type="button" @click="openDelete(${role.id}, ${js(role.name)}, ${role.users_count})" class="p-1.5 rounded-lg bg-[#101923] hover:bg-rose-950/40 text-[#8D98A8] hover:text-rose-400 border border-[#263241] hover:border-rose-900/50 transition-colors" title="Eliminar rol"><span class="material-symbols-outlined text-[16px]">delete</span></button>`
                                                    : ''}
                                            </div>
                                        </td>
                                    </tr>`;
                                  })
                                : html`<tr><td colspan="7" class="py-8 text-center text-[#707B8A]">
                                    <div class="flex flex-col items-center justify-center gap-2"><span class="material-symbols-outlined text-[32px] text-[#566170]">shield_question</span><span>No se encontraron roles que coincidan con la búsqueda.</span></div>
                                </td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            ${modal('showCreateModal', 'add_moderator', 'Crear Nuevo Rol Operativo', html`<form @submit.prevent="store()" class="flex flex-col gap-4" autocomplete="off">
                <div class="flex flex-col gap-1">
                    <label for="create_name" class="font-semibold text-[#8D98A8]">Nombre del Rol *</label>
                    <input type="text" id="create_name" x-model="createRole.name" @input="if (!createRole.slugTouched) { createRole.slug = generateSlug(createRole.name) }" required maxlength="50" placeholder="Ej. Soporte TICS, Supervisión Operativa" class="${input}">
                </div>
                <div class="flex flex-col gap-1">
                    <label for="create_slug" class="font-semibold text-[#8D98A8]">Identificador Único (Slug) * <span class="font-normal text-[11px] text-[#707B8A]">(solo minúsculas y guiones)</span></label>
                    <input type="text" id="create_slug" x-model="createRole.slug" @input="createRole.slugTouched = true; createRole.slug = generateSlug(createRole.slug)" required maxlength="30" placeholder="soporte-tics" class="${cls(input, 'font-mono')}">
                </div>
                <div class="flex flex-col gap-1">
                    <label for="create_description" class="font-semibold text-[#8D98A8]">Descripción Funcional</label>
                    <textarea id="create_description" x-model="createRole.description" rows="2" maxlength="255" placeholder="Propósito operacional de este perfil dentro del flujo de incidencias..." class="${input}"></textarea>
                </div>
                ${colorPicker('createRole')}
                <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#263241]">
                    <button type="button" @click="showCreateModal = false" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] transition-colors">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-5 py-2 rounded-xl bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold transition-all shadow-md disabled:opacity-60">Crear y Configurar Permisos</button>
                </div>
            </form>`)}

            ${modal('showEditModal', 'edit_note', html`Editar Rol: <span x-text="editRole.name"></span>`, html`<form @submit.prevent="update()" class="flex flex-col gap-4" autocomplete="off">
                <div class="flex flex-col gap-1">
                    <label for="edit_name" class="font-semibold text-[#8D98A8]">Nombre del Rol *</label>
                    <input type="text" id="edit_name" x-model="editRole.name" required maxlength="50" class="${input}">
                </div>
                <div class="flex flex-col gap-1">
                    <label for="edit_slug" class="font-semibold text-[#8D98A8]">Identificador Único (Slug)</label>
                    <template x-if="editRole.is_protected">
                        <div>
                            <input type="text" :value="editRole.slug" disabled class="w-full px-3 py-2 font-mono bg-[#0D1117]/50 border border-[#1D2530] rounded-xl text-xs text-[#707B8A] cursor-not-allowed">
                            <span class="text-[10px] text-cyan-400 mt-1 block">El identificador de los roles del sistema está protegido para preservar la integridad del software.</span>
                        </div>
                    </template>
                    <template x-if="!editRole.is_protected">
                        <input type="text" id="edit_slug" x-model="editRole.slug" @input="editRole.slug = generateSlug(editRole.slug)" required maxlength="30" class="${cls(input, 'font-mono')}">
                    </template>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="edit_description" class="font-semibold text-[#8D98A8]">Descripción Funcional</label>
                    <textarea id="edit_description" x-model="editRole.description" rows="2" maxlength="255" class="${input}"></textarea>
                </div>
                ${colorPicker('editRole')}
                <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#263241]">
                    <button type="button" @click="showEditModal = false" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] transition-colors">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-5 py-2 rounded-xl bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold transition-all shadow-md disabled:opacity-60">Guardar Cambios</button>
                </div>
            </form>`)}

            ${modal('showDeleteModal', null, null, html`
                <div class="flex items-center gap-3 text-rose-400"><span class="material-symbols-outlined text-[26px]">warning</span><h2 class="text-base font-bold text-[#F2F5F8]">Eliminar Rol</h2></div>
                <p class="text-xs text-[#8D98A8]">¿Está seguro de que desea eliminar permanentemente el rol <strong class="text-[#F2F5F8]" x-text="deleteRole.name"></strong>? Esta acción revocará todos sus permisos y reglas de alcance operativo.</p>
                <template x-if="deleteRole.usersCount > 0">
                    <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-amber-400 shrink-0">group</span>
                        <span>Este rol tiene <strong class="text-amber-200" x-text="deleteRole.usersCount"></strong> usuario(s) asignado(s). Al eliminarlo, dichos usuarios quedarán desvinculados del rol, preservando intactas sus cuentas, accesos e incidencias históricas.</span>
                    </div>
                </template>
                <div class="flex items-center justify-end gap-3 mt-2">
                    <button type="button" @click="showDeleteModal = false" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] transition-colors">Cancelar</button>
                    <button type="button" @click="destroy()" :disabled="saving" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all shadow-md disabled:opacity-60">Eliminar Definitivamente</button>
                </div>`, 'border-rose-900/50', 'max-w-md')}
        </div>`;
    },
};
