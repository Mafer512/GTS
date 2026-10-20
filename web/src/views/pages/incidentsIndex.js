// resources/views/incidents/index.blade.php (IncidentController@index / @myIncidents)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import * as gates from '../../policies/gates.js';
import { navigate } from '../../lib/router.js';
import { takeFlash } from '../../lib/flash.js';
import { list } from '../../services/incidentService.js';
import { lookups } from '../../services/appServices.js';
import { formatDate, pad2 } from '../../lib/format.js';
import { badgePriority, pagination, alertBanner } from '../components/ui.js';
import { originBadge, statusPillClasses, areaBadgeClasses, areaLabel, isAssignedToTics, assignedAreaNames } from '../../models/incident.js';

const FILTER_KEYS = ['search', 'status_id', 'priority_id', 'category_id'];

Alpine.data('incidentFilters', (path, initial) => ({
    f: { search: '', status_id: '', priority_id: '', category_id: '', ...initial },
    submit() {
        navigate(path, this.f);
    },
}));

function selectFilter(name, placeholder, options, value, labelKey = 'name') {
    return html`<div class="relative lg:col-span-2 min-w-0">
        <select x-model="f.${name}" class="w-full appearance-none px-3 py-2 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-8 cursor-pointer shadow-inner">
            <option value="">${placeholder}</option>
            ${options.map((o) => html`<option value="${o.id}" ${String(value) === String(o.id) ? 'selected' : ''}>${o[labelKey]}</option>`)}
        </select>
        <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
    </div>`;
}

function responsible(incident) {
    if (incident.assigned_to) {
        return html`<div class="flex items-center gap-1.5 truncate" title="${incident.assigned_to.name} (${incident.assigned_to.role?.name ?? 'GTS'})">
            <span class="w-5 h-5 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center font-mono text-[9px] text-primary font-bold shrink-0">${incident.assigned_to.name.slice(0, 2)}</span>
            <span class="text-on-surface font-medium text-xs truncate">${incident.assigned_to.name}</span>
        </div>`;
    }
    if (incident.assigned_areas.length) {
        return html`<div class="flex items-center gap-1 flex-wrap max-w-[170px]" title="${assignedAreaNames(incident).join(', ')}">
            ${incident.assigned_areas.map((a) => html`<span class="${cls('px-1.5 py-0.5 rounded text-[9.5px] font-mono font-medium border', areaBadgeClasses(a))}">${areaLabel(a)}</span>`)}
        </div>`;
    }
    if (isAssignedToTics(incident)) {
        return html`<div class="flex items-center gap-1 truncate" title="Especialista TICS">
            <span class="w-5 h-5 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center font-mono text-[9px] text-primary font-bold shrink-0">TI</span>
            <span class="text-on-surface font-medium text-xs truncate">TICS</span>
        </div>`;
    }
    return html`<span class="px-1.5 py-0.5 rounded bg-surface-container-low text-outline font-mono text-[9.5px] border border-border-subtle whitespace-nowrap">Sin Asignar</span>`;
}

function kpiChip(label, value, valueClass, iconBg, icon) {
    return html`<div class="bg-surface-subtle border border-border-subtle p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div class="flex flex-col">
            <span class="text-xs text-outline uppercase font-medium">${label}</span>
            <span class="${cls('font-mono text-xl sm:text-2xl font-bold mt-0.5', valueClass)}">${pad2(value)}</span>
        </div>
        <div class="${cls('w-10 h-10 rounded-lg flex items-center justify-center', iconBg)}">
            <span class="material-symbols-outlined text-[22px]">${icon}</span>
        </div>
    </div>`;
}

function makePage(mode) {
    const path = mode === 'my' ? '/incidencias/mis' : '/incidencias';
    return {
        name: mode === 'my' ? 'incidents.my' : 'incidents.index',
        title: mode === 'my' ? 'Mis incidencias' : 'Todas las incidencias',
        async render({ query }) {
            const filters = {};
            FILTER_KEYS.forEach((k) => {
                if (query[k]) filters[k] = query[k];
            });
            if (query.assigned_to) filters.assigned_to = query.assigned_to;
            if (query.reported_by) filters.reported_by = query.reported_by;

            const [result, cat] = await Promise.all([list(filters, mode, query.page || 1), lookups()]);
            const { data: incidents, meta, metrics } = result;
            const flash = takeFlash();
            const isMine = mode === 'my' || 'assigned_to' in query || 'reported_by' in query;
            const hasFilters = FILTER_KEYS.some((k) => query[k]);
            const showOrigin = gates.seesOriginBadges();

            return html`<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
                ${alertBanner('success', flash.status_message)}

                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs uppercase tracking-widest text-primary font-semibold">Operaciones AIFA</span>
                            <span class="text-outline text-sm">/</span>
                            <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Control APOC & GTS</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <h1 class="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">${isMine ? 'Mis Incidencias' : 'Todas las Incidencias'}</h1>
                            <span class="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs font-semibold uppercase tracking-wider border border-border-subtle">AIFA-GTS</span>
                        </div>
                        <p class="text-xs sm:text-sm text-on-surface-variant mt-1">
                            <span class="font-semibold text-on-surface">${meta.total}</span> incidencias registradas en la plataforma técnica
                        </p>
                    </div>
                    <div class="flex items-center gap-3 self-start md:self-auto">
                        <div class="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface-variant text-xs">
                            <span class="w-2 h-2 rounded-full bg-status-resolved animate-pulse"></span>
                            <span class="font-medium text-on-surface">Canal Operativo Activo</span>
                        </div>
                        ${gates.incidentCreate()
                            ? html`<a href="#/incidencias/nueva" class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container font-semibold text-xs rounded-xl shadow-sm transition-all">
                                <span class="material-symbols-outlined text-[18px]">add</span>
                                <span>Nueva Incidencia</span>
                            </a>`
                            : ''}
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${kpiChip('Nuevas sin atender', metrics.nuevas, 'text-[#3D82C6]', 'bg-[#123A70]/30 text-[#3D82C6]', 'inbox')}
                    ${kpiChip('En Atención GTS', metrics.en_atencion, 'text-[#E0A21A]', 'bg-[#E0A21A]/15 text-[#E0A21A]', 'pending_actions')}
                    ${kpiChip('Críticas Activas', metrics.criticas, 'text-status-critical', 'bg-status-critical/10 text-status-critical', 'warning')}
                    ${kpiChip('Resueltas', metrics.resueltas, 'text-[#20C997]', 'bg-[#20C997]/15 text-[#20C997]', 'task_alt')}
                </div>

                <form x-data="incidentFilters(${js(path)}, ${js(filters)})" @submit.prevent="submit()" class="bg-surface-subtle border border-border-subtle p-4 rounded-xl shadow-sm flex flex-col gap-4" autocomplete="off">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                        <div class="relative lg:col-span-4 min-w-0">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">search</span>
                            <input type="text" x-model="f.search" placeholder="Buscar por folio, asunto o ubicación..." autocomplete="off"
                                class="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner" />
                        </div>
                        ${selectFilter('status_id', 'Todos los estados', cat.statuses, filters.status_id)}
                        ${selectFilter('priority_id', 'Todas las prioridades', cat.priorities, filters.priority_id)}
                        ${selectFilter('category_id', 'Todas las categorías', cat.categories, filters.category_id)}
                        <div class="flex items-center gap-2 lg:col-span-2 min-w-0">
                            <button type="submit" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold rounded-lg border border-border-subtle transition-colors shadow-sm">
                                <span class="material-symbols-outlined text-[16px]">filter_alt</span>
                                <span>Filtrar</span>
                            </button>
                            ${hasFilters ? html`<a href="#${path}" class="text-xs text-outline hover:text-on-surface px-2.5 py-2 transition-colors whitespace-nowrap">Limpiar</a>` : ''}
                        </div>
                    </div>
                </form>

                <div class="bg-surface-subtle border border-border-subtle rounded-xl overflow-hidden shadow-lg flex flex-col">
                    <div class="w-full overflow-x-auto">
                        <table class="w-full min-w-[860px] max-w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr class="bg-surface-container-low border-b border-border-subtle text-outline uppercase font-mono text-[11px] tracking-wider">
                                    <th class="w-[13%] py-2.5 px-2 font-semibold">Folio</th>
                                    <th class="w-[26%] py-2.5 px-2 font-semibold">Título / Asunto</th>
                                    <th class="w-[17%] py-2.5 px-2 font-semibold">Área / Ubicación</th>
                                    <th class="w-[9%] py-2.5 px-2 font-semibold text-center">Prioridad</th>
                                    <th class="w-[10%] py-2.5 px-2 font-semibold text-center">Estado</th>
                                    <th class="w-[11%] py-2.5 px-2 font-semibold">Responsable</th>
                                    <th class="w-[7%] py-2.5 px-2 font-semibold text-center">Fecha</th>
                                    <th class="w-[7%] py-2.5 px-2 text-right font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border-subtle text-xs" id="incidentsTableBody">
                                ${incidents.length
                                    ? incidents.map((inc) => {
                                          const badge = showOrigin ? originBadge(inc) : null;
                                          const code = inc.status.code;
                                          return html`<tr class="hover:bg-surface-container-low/60 transition-colors group">
                                            <td class="py-2.5 px-2 whitespace-nowrap">
                                                <div class="flex flex-col">
                                                    <span class="font-mono text-[#3D82C6] font-bold tracking-tight text-xs select-all">${inc.folio}</span>
                                                    ${badge ? html`<span class="${cls('inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider border', badge.bg, badge.text, badge.border)}" title="${badge.title}">${badge.label}</span>` : ''}
                                                </div>
                                            </td>
                                            <td class="py-2.5 px-2">
                                                <div class="font-medium text-on-surface group-hover:text-primary transition-colors truncate" title="${inc.title}">${inc.title}</div>
                                                <div class="flex items-center gap-1.5 mt-0.5 truncate">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0"></span>
                                                    <span class="text-[10px] text-on-surface-variant font-normal truncate" title="${inc.category.name}">${inc.category.name}</span>
                                                </div>
                                            </td>
                                            <td class="py-2.5 px-2">
                                                <span class="text-on-surface font-medium block truncate" title="${inc.location}">${inc.location}</span>
                                                <span class="text-[9.5px] text-outline flex items-center gap-0.5 mt-0.5 truncate">
                                                    <span class="material-symbols-outlined text-[11px] shrink-0">location_on</span>
                                                    <span class="truncate">AIFA Operaciones</span>
                                                </span>
                                            </td>
                                            <td class="py-2.5 px-2 whitespace-nowrap text-center">${badgePriority(inc.priority)}</td>
                                            <td class="py-2.5 px-2 whitespace-nowrap text-center">
                                                <span class="${cls('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[10px] whitespace-nowrap', statusPillClasses(code))}">
                                                    ${code === 'EN_ATENCION' ? html`<span class="w-1 h-1 rounded-full bg-[#E0A21A] animate-pulse shrink-0"></span>` : ''}
                                                    <span>${inc.status.name}</span>
                                                </span>
                                            </td>
                                            <td class="py-2.5 px-2 whitespace-nowrap">${responsible(inc)}</td>
                                            <td class="py-2.5 px-2 whitespace-nowrap font-mono text-[10px] leading-tight text-on-surface-variant text-center">
                                                <span class="block text-on-surface font-medium">${formatDate(inc.created_at, 'd/m/Y')}</span>
                                                <span class="text-outline text-[9.5px]">${formatDate(inc.created_at, 'H:i')} hrs</span>
                                            </td>
                                            <td class="py-2.5 px-2 text-right whitespace-nowrap">
                                                <a href="#/incidencias/${encodeURIComponent(inc.folio)}" class="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold border border-border-subtle hover:border-primary/40 transition-colors shadow-sm" title="Ver detalle de ${inc.folio}">
                                                    <span class="material-symbols-outlined text-[15px]">visibility</span>
                                                    <span>Ver</span>
                                                </a>
                                            </td>
                                        </tr>`;
                                      })
                                    : html`<tr><td colspan="8" class="py-12 text-center">
                                        <div class="flex flex-col items-center justify-center gap-3">
                                            <div class="w-12 h-12 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-outline">
                                                <span class="material-symbols-outlined text-[28px]">search_off</span>
                                            </div>
                                            <div class="flex flex-col gap-1 max-w-sm">
                                                <h3 class="text-sm font-semibold text-on-surface">No se encontraron incidencias</h3>
                                                <p class="text-xs text-outline">No hay registros que coincidan con los filtros aplicados o aún no se han registrado incidencias en la plataforma.</p>
                                            </div>
                                            ${hasFilters ? html`<a href="#${path}" class="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary text-xs font-semibold hover:bg-surface-container transition-colors">Restablecer filtros</a>` : ''}
                                        </div>
                                    </td></tr>`}
                            </tbody>
                        </table>
                    </div>
                    ${meta.last_page > 1
                        ? html`<div class="p-4 border-t border-border-subtle bg-surface-container-low flex items-center justify-between">${pagination(meta, path, query)}</div>`
                        : ''}
                </div>
            </div>`;
        },
    };
}

export default { all: makePage('all'), mine: makePage('my') };
