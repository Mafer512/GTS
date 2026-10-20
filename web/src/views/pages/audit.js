// resources/views/audit/index.blade.php (AuditController@index / destroyIncident)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import { navigate, reload } from '../../lib/router.js';
import { flash, takeFlash } from '../../lib/flash.js';
import { toApiError } from '../../lib/api.js';
import { formatDate, diffForHumans, numberFormat } from '../../lib/format.js';
import { audit } from '../../services/appServices.js';
import { destroy } from '../../services/incidentService.js';
import { badgePriority, pagination, alertBanner } from '../components/ui.js';
import { statusPillClasses, AUDIT_ACTIONS, actionLabel, actionIcon, actionBadgeClasses } from '../../models/incident.js';

const FILTER_KEYS = ['search', 'action', 'user_id', 'folio', 'date_from', 'date_to', 'status_id', 'category_id', 'priority_id'];

Alpine.data('auditPage', (initialTab) => ({
    activeTab: initialTab,
    showDeleteModal: false,
    deleteFolio: '',
    deleteId: null,
    deleting: false,
    deleteError: '',
    confirmDelete(folio, id) {
        this.deleteFolio = folio;
        this.deleteId = id;
        this.deleteError = '';
        this.showDeleteModal = true;
    },
    async destroy() {
        if (this.deleting) return;
        this.deleting = true;
        try {
            const result = await destroy(this.deleteId);
            flash('status_message', `El expediente de la incidencia #${result.folio} y sus archivos asociados han sido eliminados definitivamente del sistema.`);
            reload();
        } catch (e) {
            this.deleteError = toApiError(e).message;
            this.deleting = false;
        }
    },
}));

Alpine.data('auditFilters', (initial) => ({
    f: { search: '', action: '', user_id: '', date_from: '', date_to: '', status_id: '', category_id: '', ...initial },
    submit() {
        navigate('/auditoria', this.f);
    },
}));

function deleteButton(folio, id) {
    return html`<button type="button" @click="confirmDelete(${js(folio)}, ${js(id)})"
        class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all shadow-sm cursor-pointer whitespace-nowrap"
        title="Eliminar definitivamente expediente ${folio}">
        <span class="material-symbols-outlined text-[15px] shrink-0">delete</span>
        <span>Eliminar</span>
    </button>`;
}

function kpi(label, value, valueClass, iconClass, icon) {
    return html`<div class="bg-surface-subtle border border-border-subtle p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div class="flex flex-col">
            <span class="text-xs text-outline uppercase font-medium">${label}</span>
            <span class="${cls('font-mono text-xl sm:text-2xl font-bold mt-0.5', valueClass)}">${numberFormat(value)}</span>
        </div>
        <div class="${cls('w-10 h-10 rounded-lg flex items-center justify-center', iconClass)}"><span class="material-symbols-outlined text-[22px]">${icon}</span></div>
    </div>`;
}

const emptyRow = (title, text) => html`<tr><td colspan="8" class="py-12 px-4 text-center">
    <div class="flex flex-col items-center justify-center gap-3">
        <div class="w-12 h-12 rounded-full bg-surface-container-high text-outline flex items-center justify-center"><span class="material-symbols-outlined text-[28px]">search_off</span></div>
        <div class="flex flex-col items-center gap-1">
            <span class="font-semibold text-on-surface text-sm">${title}</span>
            <p class="text-xs text-outline max-w-md">${text}</p>
        </div>
    </div>
</td></tr>`;

export default {
    name: 'audit.index',
    title: 'Auditoría',
    async render({ query }) {
        const filters = {};
        FILTER_KEYS.forEach((k) => {
            if (query[k]) filters[k] = query[k];
        });
        const d = await audit.data(filters, query.incidents_page || 1, query.page || 1);
        const flashes = takeFlash();
        const st = d.statistics;
        const tab = filters.action || query.view === 'history' ? 'history' : 'incidents';

        return html`<div x-data="auditPage(${js(tab)})" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${alertBanner('success', flashes.status_message)}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Trazabilidad Aeronáutica</span>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#8D98A8] font-medium">Bitácora Pericial</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Bitácora General de Auditoría</h1>
                        <span class="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs font-semibold uppercase tracking-wider border border-border-subtle flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">lock</span><span>Append-Only</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-on-surface-variant mt-1">Supervisión integral de expedientes del sistema y registro cronológico inmutable de eventos bajo norma OACI / AFAC.</p>
                </div>
                <div class="flex items-center gap-3 self-start md:self-auto">
                    <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface-variant text-xs">
                        <span class="w-2 h-2 rounded-full bg-status-resolved animate-pulse"></span>
                        <span class="font-medium text-on-surface">Auditoría en Tiempo Real</span>
                    </div>
                    <a href="#/incidencias" class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-subtle font-semibold text-xs rounded-xl transition-all">
                        <span class="material-symbols-outlined text-[18px]">confirmation_number</span><span>Ver Incidencias</span>
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${kpi('Total Expedientes en Sistema', st.total_incidents, 'text-primary', 'bg-primary/10 text-primary', 'folder')}
                ${kpi('Eventos de Bitácora', st.total_events, 'text-cyan-400', 'bg-cyan-500/10 text-cyan-400', 'history')}
                ${kpi('Cambios de Estado', st.state_changes, 'text-amber-400', 'bg-amber-500/10 text-amber-400', 'sync_alt')}
                ${kpi('Resoluciones / Cierres VoBo', st.resolutions + st.closures, 'text-emerald-400', 'bg-emerald-500/10 text-emerald-400', 'verified')}
            </div>

            <div class="bg-surface-subtle border border-border-subtle p-5 rounded-2xl shadow-sm">
                <form x-data="auditFilters(${js(filters)})" @submit.prevent="submit()" class="flex flex-col gap-4" autocomplete="off">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
                        <div class="lg:col-span-4 relative">
                            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">search</span>
                            <input type="text" x-model="f.search" placeholder="Buscar en comentario, folio o valores..."
                                class="w-full pl-10 pr-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 transition-colors shadow-inner" />
                        </div>
                        <div class="lg:col-span-3 relative">
                            <select x-model="f.action" class="w-full pl-3.5 pr-8 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:border-primary/50 cursor-pointer transition-colors shadow-inner">
                                <option value="">Todas las Acciones</option>
                                ${Object.entries(AUDIT_ACTIONS).map(([code, label]) => html`<option value="${code}" ${filters.action === code ? 'selected' : ''}>${label}</option>`)}
                            </select>
                            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
                        </div>
                        <div class="lg:col-span-3 relative">
                            <select x-model="f.user_id" class="w-full pl-3.5 pr-8 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:border-primary/50 cursor-pointer transition-colors shadow-inner">
                                <option value="">Todos los Operadores</option>
                                ${d.users.map((u) => html`<option value="${u.id}" ${String(filters.user_id) === String(u.id) ? 'selected' : ''}>${u.name} (${(u.role?.name ?? 'USUARIO').toUpperCase()})</option>`)}
                            </select>
                            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
                        </div>
                        <div class="lg:col-span-2 flex items-center gap-2">
                            <button type="submit" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all">
                                <span class="material-symbols-outlined text-[16px]">filter_list</span><span>Filtrar</span>
                            </button>
                            ${Object.keys(filters).length
                                ? html`<a href="#/auditoria" class="p-2.5 bg-surface-container-high hover:bg-surface-container text-outline hover:text-on-surface rounded-xl border border-border-subtle transition-colors" title="Limpiar todos los filtros">
                                    <span class="material-symbols-outlined text-[18px]">filter_alt_off</span></a>`
                                : ''}
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle/50 text-xs text-on-surface-variant">
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-outline flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">date_range</span><span>Desde:</span></span>
                                <input type="date" x-model="f.date_from" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner" />
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-outline">Hasta:</span>
                                <input type="date" x-model="f.date_to" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="flex items-center gap-1.5">
                                <span class="text-outline text-xs">Estado:</span>
                                <select x-model="f.status_id" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner cursor-pointer">
                                    <option value="">Todos los Estados</option>
                                    ${d.statuses.map((s) => html`<option value="${s.id}" ${String(filters.status_id) === String(s.id) ? 'selected' : ''}>${s.name}</option>`)}
                                </select>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-outline text-xs">Subsistema:</span>
                                <select x-model="f.category_id" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner cursor-pointer">
                                    <option value="">Todos los Subsistemas</option>
                                    ${d.categories.map((c) => html`<option value="${c.id}" ${String(filters.category_id) === String(c.id) ? 'selected' : ''}>${c.name}</option>`)}
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="flex flex-wrap items-center gap-2 p-1.5 bg-surface-container-low border border-border-subtle rounded-2xl self-start">
                <button type="button" @click="activeTab = 'incidents'" :class="activeTab === 'incidents' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface font-medium hover:bg-surface-container-high/40'" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-[17px]">folder_open</span>
                    <span>Expedientes del Sistema (Todas las Incidencias)</span>
                    <span class="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold" :class="activeTab === 'incidents' ? 'bg-white/20 text-white' : 'bg-surface-container-high text-primary'">${d.incidents_meta.total}</span>
                </button>
                <button type="button" @click="activeTab = 'history'" :class="activeTab === 'history' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface font-medium hover:bg-surface-container-high/40'" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-[17px]">history_edu</span>
                    <span>Bitácora de Trazabilidad e Historial</span>
                    <span class="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold" :class="activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-surface-container-high text-primary'">${d.histories_meta.total}</span>
                </button>
            </div>

            <div x-show="activeTab === 'incidents'" class="bg-surface-subtle border border-border-subtle rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-surface-container-low border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-on-surface">Expedientes de Incidencias:</span>
                        <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono font-bold">${d.incidents_meta.total} expedientes registrados</span>
                    </div>
                    <div class="text-outline text-[11px] flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                        <span>Conjunto completo del sistema sin exclusión de estados ni restricciones de usuario</span>
                    </div>
                </div>
                <div class="w-full overflow-x-auto">
                    <table class="w-full min-w-[880px] max-w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr class="bg-surface-container-low/70 border-b border-border-subtle text-outline text-[11px] font-semibold uppercase tracking-wider">
                                <th class="w-[12%] py-2.5 px-2.5 font-semibold">Folio</th>
                                <th class="w-[24%] py-2.5 px-2.5 font-semibold">Asunto / Subsistema</th>
                                <th class="w-[15%] py-2.5 px-2.5 font-semibold">Ubicación</th>
                                <th class="w-[9%] py-2.5 px-2 text-center font-semibold">Prioridad</th>
                                <th class="w-[10%] py-2.5 px-2 text-center font-semibold">Estado</th>
                                <th class="w-[11%] py-2.5 px-2.5 font-semibold">Responsable</th>
                                <th class="w-[9%] py-2.5 px-2 text-center font-semibold">Fecha</th>
                                <th class="w-[10%] py-2.5 px-2 text-center font-semibold">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border-subtle/40 text-xs text-on-surface font-normal">
                            ${d.incidents.length
                                ? d.incidents.map((inc) => html`<tr class="hover:bg-surface-container-low/40 transition-colors">
                                    <td class="py-2.5 px-2.5 whitespace-nowrap min-w-0">
                                        <a href="#/incidencias/${encodeURIComponent(inc.folio)}" class="font-mono font-bold text-primary hover:underline inline-flex items-center gap-1 text-xs truncate max-w-full">
                                            <span>${inc.folio}</span><span class="material-symbols-outlined text-[13px] shrink-0">open_in_new</span>
                                        </a>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        <div class="font-semibold text-on-surface truncate text-xs" title="${inc.title}">${inc.title}</div>
                                        <div class="text-[10.5px] text-on-surface-variant truncate max-w-full mt-0.5 flex items-center gap-1" title="${inc.category?.name ?? 'Sin subsistema'}">
                                            <span class="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0"></span><span class="truncate">${inc.category?.name ?? 'General'}</span>
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0"><span class="text-on-surface block truncate text-xs" title="${inc.location}">${inc.location}</span></td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">${badgePriority(inc.priority)}</td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">
                                        <span class="${cls('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[10px] whitespace-nowrap', statusPillClasses(inc.status?.code))}">
                                            ${inc.status?.code === 'EN_ATENCION' ? html`<span class="w-1 h-1 rounded-full bg-[#E0A21A] animate-pulse shrink-0"></span>` : ''}
                                            <span>${inc.status?.name ?? 'Desconocido'}</span>
                                        </span>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${inc.assigned_to
                                            ? html`<div class="flex items-center gap-1 min-w-0" title="Asignado a: ${inc.assigned_to.name}">
                                                <span class="w-5 h-5 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center font-mono text-[9px] text-primary font-bold shrink-0">${inc.assigned_to.name.slice(0, 2)}</span>
                                                <span class="text-on-surface text-xs truncate">${inc.assigned_to.name}</span>
                                            </div>`
                                            : html`<span class="px-1.5 py-0.5 rounded bg-surface-container-low text-outline font-mono text-[9.5px] border border-border-subtle whitespace-nowrap">Sin Asignar</span>`}
                                    </td>
                                    <td class="py-2.5 px-2 whitespace-nowrap font-mono text-[10.5px] text-center text-outline">${formatDate(inc.created_at, 'd/m/Y')}</td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">${d.can_delete ? deleteButton(inc.folio, inc.id) : html`<span class="text-outline text-[11px]">—</span>`}</td>
                                </tr>`)
                                : emptyRow('No se encontraron expedientes de incidencias', 'No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados en el historial completo del sistema.')}
                        </tbody>
                    </table>
                </div>
                ${d.incidents_meta.last_page > 1 ? html`<div class="p-4 bg-surface-container-low border-t border-border-subtle">${pagination(d.incidents_meta, '/auditoria', query, 'incidents_page')}</div>` : ''}
            </div>

            <div x-show="activeTab === 'history'" x-cloak class="bg-surface-subtle border border-border-subtle rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-surface-container-low border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-on-surface">Eventos de Bitácora:</span>
                        <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono font-bold">${d.histories_meta.total} registros</span>
                    </div>
                    <div class="text-outline text-[11px]">Ordenados en estricto orden cronológico inverso (el más reciente primero)</div>
                </div>
                <div class="w-full overflow-x-auto">
                    <table class="w-full min-w-[920px] max-w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr class="bg-surface-container-low/70 border-b border-border-subtle text-outline text-[11px] font-semibold uppercase tracking-wider">
                                <th class="w-[13%] py-2.5 px-2.5 font-semibold">Fecha / Hora</th>
                                <th class="w-[13%] py-2.5 px-2.5 font-semibold">Expediente</th>
                                <th class="w-[13%] py-2.5 px-2.5 font-semibold">Operador / Actor</th>
                                <th class="w-[12%] py-2.5 px-2.5 font-semibold">Acción Auditada</th>
                                <th class="w-[14%] py-2.5 px-2.5 font-semibold">Campo / Diferencial</th>
                                <th class="w-[20%] py-2.5 px-2.5 font-semibold">Observaciones</th>
                                <th class="w-[5%] py-2.5 px-2 text-center font-semibold">Sello</th>
                                <th class="w-[10%] py-2.5 px-2 text-center font-semibold">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border-subtle/40 text-xs text-on-surface font-normal">
                            ${d.histories.length
                                ? d.histories.map((h) => html`<tr class="hover:bg-surface-container-low/40 transition-colors">
                                    <td class="py-2.5 px-2.5 whitespace-nowrap">
                                        <div class="font-mono text-xs font-semibold text-on-surface">${formatDate(h.created_at, 'd/m/Y H:i:s')}</div>
                                        <div class="text-[10.5px] text-outline mt-0.5">${diffForHumans(h.created_at)}</div>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${h.incident
                                            ? html`<a href="#/incidencias/${encodeURIComponent(h.incident.folio)}" class="font-mono font-bold text-primary hover:underline inline-flex items-center gap-1 text-xs truncate max-w-full">
                                                <span>${h.incident.folio}</span><span class="material-symbols-outlined text-[13px] shrink-0">open_in_new</span></a>
                                                <div class="text-[10.5px] text-on-surface-variant truncate max-w-full mt-0.5">${h.incident.category?.name ?? 'General'}</div>`
                                            : html`<span class="font-mono text-outline text-xs">#${h.incident_id}</span>`}
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        <div class="flex items-center gap-1.5 min-w-0">
                                            <div class="w-6 h-6 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center text-[10px] font-bold text-primary shrink-0">${(h.user?.name ?? 'S').slice(0, 1)}</div>
                                            <div class="flex flex-col min-w-0 truncate">
                                                <span class="font-semibold text-on-surface text-xs truncate" title="${h.user?.name ?? 'Sistema'}">${h.user?.name ?? 'Sistema'}</span>
                                                <span class="text-[9.5px] text-outline uppercase font-mono truncate">${h.user?.role?.name ?? 'AUDITORÍA'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        <span class="${cls('inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-semibold truncate max-w-full', actionBadgeClasses(h.action))}" title="${actionLabel(h.action)}">
                                            <span class="material-symbols-outlined text-[13px] shrink-0">${actionIcon(h.action)}</span>
                                            <span class="truncate">${actionLabel(h.action)}</span>
                                        </span>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${h.field_name
                                            ? html`<div class="font-mono text-[10.5px] text-outline font-semibold truncate" title="${h.field_name}">${h.field_name}</div>
                                                ${h.old_value || h.new_value
                                                    ? html`<div class="flex items-center gap-1 text-[10.5px] mt-0.5 min-w-0">
                                                        ${h.old_value ? html`<span class="text-rose-400/90 font-mono bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/20 truncate max-w-[70px]" title="${h.old_value}">${h.old_value}</span><span class="text-outline text-[9px] font-bold shrink-0">→</span>` : ''}
                                                        ${h.new_value ? html`<span class="text-emerald-400/90 font-mono bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20 truncate max-w-[70px]" title="${h.new_value}">${h.new_value}</span>` : ''}
                                                    </div>`
                                                    : ''}`
                                            : html`<span class="text-outline text-[11px]">—</span>`}
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${h.comment
                                            ? html`<p class="text-xs text-on-surface-variant leading-snug line-clamp-2" title="${h.comment}">${h.comment}</p>`
                                            : html`<span class="text-outline text-[11px] italic">Sin observaciones adicionales</span>`}
                                    </td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">
                                        <div class="inline-flex items-center justify-center p-1 rounded-md text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20" title="Registro inmutable firmado con timestamp pericial">
                                            <span class="material-symbols-outlined text-[15px]">verified_user</span>
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">${h.incident && d.can_delete ? deleteButton(h.incident.folio, h.incident.id) : html`<span class="text-outline text-[11px]">—</span>`}</td>
                                </tr>`)
                                : emptyRow('No se encontraron eventos de auditoría', 'No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados.')}
                        </tbody>
                    </table>
                </div>
                ${d.histories_meta.last_page > 1 ? html`<div class="p-4 bg-surface-container-low border-t border-border-subtle">${pagination(d.histories_meta, '/auditoria', { ...query, view: 'history' })}</div>` : ''}
            </div>

            <div x-show="showDeleteModal" x-cloak @keydown.escape.window="showDeleteModal = false" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                <div class="flex items-center justify-center min-h-screen px-4 py-8">
                    <div x-show="showDeleteModal" x-transition.opacity @click="showDeleteModal = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>
                    <div x-show="showDeleteModal" x-transition class="relative bg-[#11151B] border border-rose-500/30 rounded-2xl text-left overflow-hidden shadow-2xl sm:max-w-lg w-full p-6">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[28px]">warning</span></div>
                            <div class="flex flex-col">
                                <h3 class="text-base font-bold text-[#F2F5F8]">Confirmar Eliminación Permanente</h3>
                                <p class="text-xs text-[#8D98A8] mt-1.5 leading-relaxed">¿Está completamente seguro de que desea eliminar la incidencia <strong class="font-mono text-rose-400 font-bold" x-text="deleteFolio"></strong>?</p>
                                <div class="mt-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 text-[11px] text-rose-300 leading-relaxed flex flex-col gap-1">
                                    <span class="font-semibold text-rose-400 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">shield</span><span>Consecuencias operacionales irreversibles:</span></span>
                                    <span>• Se purgará el registro de la incidencia de PostgreSQL.</span>
                                    <span>• Se eliminarán permanentemente las evidencias y adjuntos del almacenamiento.</span>
                                    <span>• Se eliminará la traza pericial vinculada a este expediente.</span>
                                </div>
                                <p x-show="deleteError" x-cloak x-text="deleteError" class="mt-3 text-[11px] text-[#E66A7A]"></p>
                            </div>
                        </div>
                        <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#1F2937]">
                            <button type="button" @click="showDeleteModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold transition-colors cursor-pointer">Cancelar</button>
                            <button type="button" @click="destroy()" :disabled="deleting" class="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/30 transition-all cursor-pointer disabled:opacity-60">
                                <span class="material-symbols-outlined text-[16px]">delete_forever</span><span x-text="deleting ? 'Eliminando...' : 'Eliminar Definitivamente'">Eliminar Definitivamente</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },
};
