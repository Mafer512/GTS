// resources/views/catalogs/index.blade.php (CatalogController)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import { navigate, reload } from '../../lib/router.js';
import { flash, takeFlash } from '../../lib/flash.js';
import { toApiError } from '../../lib/api.js';
import { catalogs } from '../../services/appServices.js';
import { pagination } from '../components/ui.js';

const EMPTY = { id: null, name: '', code: '', slug: '', description: '', location: '', technical_specs: '', icon: 'hub', color: '#06B6D4', status: 'ACTIVO', incidents_count: 0, active_incidents_count: 0, availability: 100 };

Alpine.data('catalogsPage', () => ({
    showCreateModal: false,
    showEditModal: false,
    showStatusModal: false,
    showViewModal: false,
    activeItem: { ...EMPTY },
    createItem: { ...EMPTY },
    reason: '',
    saving: false,
    modalError: '',
    open(flag, item) {
        this.activeItem = JSON.parse(JSON.stringify(item));
        this.modalError = '';
        this[flag] = true;
    },
    openCreate() {
        this.createItem = { ...EMPTY };
        this.modalError = '';
        this.showCreateModal = true;
    },
    async save(action, flagName) {
        if (this.saving) return;
        this.saving = true;
        this.modalError = '';
        try {
            const result = await action();
            flash('success', result.message);
            this[flagName] = false;
            reload();
        } catch (e) {
            this.modalError = toApiError(e).message;
            this.saving = false;
        }
    },
    store() {
        return this.save(() => catalogs.store(this.createItem), 'showCreateModal');
    },
    update() {
        return this.save(() => catalogs.update(this.activeItem.id, this.activeItem), 'showEditModal');
    },
    updateStatus() {
        return this.save(() => catalogs.updateStatus(this.activeItem.id, this.activeItem.status, this.reason), 'showStatusModal');
    },
}));

Alpine.data('catalogFilters', (initial) => ({
    f: { search: '', category: '', status: '', ...initial },
    submit() {
        navigate('/catalogos', this.f);
    },
}));

const input = 'w-full px-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6]';
const label = 'block text-xs font-medium text-[#C5CED8] mb-1';

function modalFrame(flag, icon, iconColor, title, body, maxWidth = 'max-w-xl') {
    return html`<div x-show="${flag}" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div @click.outside="${flag} = false" class="${cls('bg-[#11151B] border border-[#263241] rounded-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5', maxWidth)}">
            <div class="flex items-center justify-between border-b border-[#263241] pb-3.5">
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                    <span class="${cls('material-symbols-outlined text-[20px]', iconColor)}">${icon}</span>
                    <span>${title}</span>
                </h3>
                <button type="button" @click="${flag} = false" class="text-[#707B8A] hover:text-white"><span class="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <div x-show="modalError" x-cloak class="p-3 rounded-xl bg-[#45121A]/80 border border-[#D83B52]/40 text-[#FCA5A5] text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-[#D83B52]">error</span><span x-text="modalError"></span>
            </div>
            ${body}
        </div>
    </div>`;
}

function categoryFields(model, isCreate) {
    return html`
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div><label class="${label}">${isCreate ? 'Nombre del Subsistema / Recurso *' : 'Nombre *'}</label>
                <input type="text" x-model="${model}.name" required maxlength="100" placeholder="${isCreate ? 'Ej: Megafonía PAS, Cámaras Perimétricas...' : ''}" class="${input}"></div>
            <div><label class="${label}">${isCreate ? 'Código de Identificación' : 'Código'}</label>
                <input type="text" x-model="${model}.code" maxlength="50" placeholder="${isCreate ? 'Ej: INF-PAS, INF-CCTV-02...' : ''}" class="${input}"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div><label class="${label}">${isCreate ? 'Estado Operativo Inicial *' : 'Estado Operacional *'}</label>
                <select x-model="${model}.status" required class="${input}">
                    <option value="ACTIVO">${isCreate ? '🟢 ACTIVO (Operacional)' : '🟢 ACTIVO'}</option>
                    <option value="FUERA DE SERVICIO">${isCreate ? '🔴 FUERA DE SERVICIO (Falla / Indisponible)' : '🔴 FUERA DE SERVICIO'}</option>
                    <option value="INACTIVO">${isCreate ? '⚪ INACTIVO (Mantenimiento / Pausado)' : '⚪ INACTIVO'}</option>
                </select></div>
            <div><label class="${label}">${isCreate ? 'Ubicación / Cobertura Física' : 'Ubicación / Cobertura'}</label>
                <input type="text" x-model="${model}.location" maxlength="255" placeholder="${isCreate ? 'Ej: Terminal de Pasajeros T1, Pistas, Torre...' : ''}" class="${input}"></div>
        </div>
        <div><label class="${label}">${isCreate ? 'Descripción General' : 'Descripción'}</label>
            <textarea x-model="${model}.description" rows="2" maxlength="1000" placeholder="${isCreate ? 'Descripción operativa del subsistema y componentes...' : ''}" class="${input}"></textarea></div>
        <div><label class="${label}">${isCreate ? 'Especificaciones Técnicas / Topología' : 'Especificaciones Técnicas'}</label>
            <textarea x-model="${model}.technical_specs" rows="2" maxlength="2000" placeholder="${isCreate ? 'Fabricante, modelos, protocolos IP, switches de interconexión...' : ''}" class="${input}"></textarea></div>
        <div class="grid grid-cols-2 gap-3.5">
            <div><label class="${label}">Icono Material</label>
                <input type="text" x-model="${model}.icon" maxlength="50" placeholder="videocam, fingerprint, tv, radio, hub..." class="${input}"></div>
            <div><label class="${label}">${isCreate ? 'Color Institucional' : 'Color Hex'}</label>
                <input type="text" x-model="${model}.color" maxlength="20" placeholder="#06B6D4, #8B5CF6, #3D82C6..." class="${input}"></div>
        </div>`;
}

function modalButtons(flag, submitLabel) {
    return html`<div class="flex items-center justify-end gap-3 pt-3 border-t border-[#263241]">
        <button @click="${flag} = false" type="button" class="px-4 py-2 bg-[#1E293B] hover:bg-[#263241] text-[#A8B0BC] text-xs font-semibold rounded-xl transition-colors">Cancelar</button>
        <button type="submit" :disabled="saving" class="px-5 py-2 bg-[#3D82C6] hover:bg-[#2A65A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all disabled:opacity-60">${submitLabel}</button>
    </div>`;
}

function statusPill(status) {
    if (status === 'ACTIVO') {
        return html`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#063C2E] text-[#10B981] border border-[#10B981]/30"><span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span><span>ACTIVO</span></span>`;
    }
    if (status === 'FUERA DE SERVICIO') {
        return html`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#45121A] text-[#F87171] border border-[#D83B52]/30"><span class="w-1.5 h-1.5 rounded-full bg-[#D83B52]"></span><span>FUERA DE SERVICIO</span></span>`;
    }
    return html`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#1F2732] text-[#94A3B8] border border-[#475569]/30"><span class="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span><span>INACTIVO</span></span>`;
}

const AVAILABILITY_CLASSES = {
    text: ['text-[#10B981]', 'text-[#E0A21A]', 'text-[#D83B52]'],
    bg: ['bg-[#10B981]', 'bg-[#E0A21A]', 'bg-[#D83B52]'],
};
const availabilityColor = (a, kind) => AVAILABILITY_CLASSES[kind][a >= 90 ? 0 : a >= 70 ? 1 : 2];

export default {
    name: 'catalogs.index',
    title: 'Catálogos',
    async render({ query }) {
        const filters = {};
        ['search', 'category', 'status'].forEach((k) => {
            if (query[k]) filters[k] = query[k];
        });
        const d = await catalogs.data(filters, query.page || 1);
        const flashes = takeFlash();
        const circumference = 238.76;
        let offset = 0;

        return html`<div x-data="catalogsPage" class="min-h-screen bg-brand-canvas text-[#F2F5F8] p-4 lg:p-6 space-y-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#263241] pb-5">
                <div>
                    <nav class="flex items-center gap-2 text-xs font-mono text-[#707B8A] mb-1.5" aria-label="Breadcrumb">
                        <a href="#/dashboard" class="hover:text-[#3D82C6] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">home</span><span>Inicio</span></a>
                        <span>/</span><span class="text-[#A8B0BC]">Infraestructura</span><span>/</span><span class="text-[#3D82C6] font-semibold">Catálogos Tecnológicos</span>
                    </nav>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#0E2D56] border border-[#164A8A]/50 flex items-center justify-center text-[#93C5FD]"><span class="material-symbols-outlined text-[24px]">layers</span></div>
                        <div>
                            <h1 class="text-xl lg:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2.5">
                                Catálogos e Infraestructura Tecnológica
                                <span class="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#16273B] text-[#93C5FD] border border-[#234269]">AIFA-GTS</span>
                            </h1>
                            <p class="text-xs text-[#8D98A8] mt-0.5">Inventario maestro, disponibilidad operacional y gestión de subsistemas de seguridad y periféricos.</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    ${d.can_manage
                        ? html`<button @click="openCreate()" type="button" class="px-4 py-2.5 rounded-xl bg-[#3D82C6] hover:bg-[#2A65A0] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95">
                            <span class="material-symbols-outlined text-[18px]">add_circle</span><span>Alta de Infraestructura</span></button>`
                        : html`<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151D28] border border-[#263241] text-xs text-[#8D98A8]">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">visibility</span><span>Modo Consulta (Solo Lectura)</span></div>`}
                </div>
            </div>

            ${flashes.success
                ? html`<div class="p-3.5 rounded-xl bg-[#063C2E]/80 border border-[#10B981]/40 text-[#6EE7B7] text-xs flex items-center justify-between">
                    <div class="flex items-center gap-2.5"><span class="material-symbols-outlined text-[18px] text-[#10B981]">check_circle</span><span>${flashes.success}</span></div>
                    <button type="button" onclick="this.parentElement.remove()" class="text-[#6EE7B7] hover:text-white"><span class="material-symbols-outlined text-[16px]">close</span></button>
                </div>`
                : ''}

            <div class="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                ${[
                    ['Total Infraestructura', 'bg-[#16273B] text-[#93C5FD]', 'domain', d.total_infrastructure, 'text-white', 'subsistemas'],
                    ['Activos Operacionales', 'bg-[#063C2E] text-[#10B981]', 'check_circle', d.active_infrastructure, 'text-[#10B981]', 'en línea'],
                    ['Fuera de Servicio', 'bg-[#45121A] text-[#D83B52]', 'warning', d.out_of_service, 'text-[#D83B52]', 'críticos'],
                    ['Inactivos / Mant.', 'bg-[#1F2732] text-[#94A3B8]', 'pause_circle', d.inactive_infrastructure, 'text-[#94A3B8]', 'pausados'],
                ].map(([t, ic, i, v, vc, sub]) => html`<div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-[#8D98A8] font-medium">${t}</span>
                        <div class="${cls('w-8 h-8 rounded-lg flex items-center justify-center', ic)}"><span class="material-symbols-outlined text-[18px]">${i}</span></div>
                    </div>
                    <div class="mt-2 flex items-baseline gap-2"><span class="${cls('text-2xl font-bold font-mono', vc)}">${v}</span><span class="text-[11px] text-[#707B8A]">${sub}</span></div>
                </div>`)}
                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-2 md:col-span-1">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-[#8D98A8] font-medium">Disponibilidad Global</span>
                        <div class="w-8 h-8 rounded-lg bg-[#0E2D56] flex items-center justify-center text-[#06B6D4]"><span class="material-symbols-outlined text-[18px]">speed</span></div>
                    </div>
                    <div class="mt-2 flex items-baseline gap-2">
                        <span class="${cls('text-2xl font-bold font-mono', d.availability_rate >= 80 ? 'text-[#10B981]' : d.availability_rate >= 50 ? 'text-[#E0A21A]' : 'text-[#D83B52]')}">${d.availability_rate}%</span>
                        <span class="text-[11px] text-[#707B8A]">Disponibilidad estimada</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-bold text-white flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-[#3D82C6]">pie_chart</span><span>Distribución por Categoría</span></h3>
                        <span class="text-[10px] text-[#707B8A] font-mono">Inventario Base</span>
                    </div>
                    <div class="flex items-center justify-between gap-3 flex-1 min-h-[130px]">
                        <div class="relative w-28 h-28 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#1F2937" stroke-width="12" />
                                ${d.distribution.map((item) => {
                                    const dash = (item.percentage / 100) * circumference;
                                    const c = html`<circle cx="50" cy="50" r="38" fill="none" stroke="${item.color}" stroke-width="12" stroke-dasharray="${dash} ${circumference}" stroke-dashoffset="-${offset}" />`;
                                    offset += dash;
                                    return c;
                                })}
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span class="font-mono text-base font-bold text-white leading-none">${d.total_infrastructure}</span>
                                <span class="text-[9px] text-[#707B8A] mt-0.5">Activos</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1.5 text-[11px] min-w-0 flex-1">
                            ${d.distribution.map((it) => html`<div class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-2 text-[#DDE3EA] truncate"><span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${it.color}"></span><span class="truncate">${it.name}</span></span>
                                <span class="font-mono text-[#8D98A8] shrink-0 ml-1">${it.percentage}%</span>
                            </div>`)}
                        </div>
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-bold text-white flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-[#10B981]">health_and_safety</span><span>Salud Operativa del Parque</span></h3>
                        <span class="text-[10px] text-[#707B8A] font-mono">Disponibilidad</span>
                    </div>
                    <div class="space-y-3 flex-1 flex flex-col justify-center">
                        ${d.status_breakdown.map((sb) => html`<div>
                            <div class="flex items-center justify-between text-xs mb-1">
                                <span class="text-[#DDE3EA] flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background-color: ${sb.color}"></span><span>${sb.label}</span></span>
                                <span class="font-mono text-[#8D98A8]"><strong class="text-white">${sb.count}</strong> (${sb.percentage}%)</span>
                            </div>
                            <div class="w-full bg-[#1E293B] rounded-full h-2.5 overflow-hidden"><div class="h-full rounded-full transition-all duration-500" style="width: ${sb.percentage}%; background-color: ${sb.color};"></div></div>
                        </div>`)}
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-bold text-white flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-[#E0A21A]">build_circle</span><span>Incidencias por Infraestructura</span></h3>
                        <span class="text-[10px] text-[#707B8A] font-mono">Histórico vs Activas</span>
                    </div>
                    <div class="space-y-2 flex-1 flex flex-col justify-center text-xs">
                        ${d.incidents_by_infrastructure.length
                            ? d.incidents_by_infrastructure.map((ii) => {
                                  const act = ii.total > 0 ? (ii.active / ii.total) * 100 : 0;
                                  return html`<div>
                                    <div class="flex items-center justify-between text-[11px] mb-1">
                                        <span class="text-[#DDE3EA] truncate max-w-[140px]">${ii.name}</span>
                                        <span class="font-mono text-[#707B8A]"><span class="text-[#D83B52] font-semibold">${ii.active} activas</span> / <span>${ii.total} total</span></span>
                                    </div>
                                    <div class="w-full bg-[#1E293B] rounded-full h-2 overflow-hidden flex">
                                        <div class="bg-[#D83B52] h-full" style="width: ${act}%"></div>
                                        <div class="bg-[#10B981]/70 h-full" style="width: ${100 - act}%"></div>
                                    </div>
                                </div>`;
                              })
                            : html`<div class="text-center text-[#707B8A] py-6 text-xs">Sin datos registrados</div>`}
                    </div>
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-xl p-3.5">
                <form x-data="catalogFilters(${js(filters)})" @submit.prevent="submit()" class="flex flex-col md:flex-row items-center gap-3" autocomplete="off">
                    <div class="relative flex-1 w-full">
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#707B8A]">search</span>
                        <input type="text" x-model="f.search" placeholder="Buscar por código, nombre, ubicación o especificación técnica..." class="w-full pl-9 pr-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] transition-colors">
                    </div>
                    <div class="w-full md:w-56">
                        <select x-model="f.category" class="w-full px-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white focus:outline-none focus:border-[#3D82C6] transition-colors">
                            <option value="">Todos los subsistemas</option>
                            ${d.categories_list.map((c) => html`<option value="${c.slug}" ${filters.category === c.slug ? 'selected' : ''}>${c.name}</option>`)}
                        </select>
                    </div>
                    <div class="w-full md:w-48">
                        <select x-model="f.status" class="w-full px-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white focus:outline-none focus:border-[#3D82C6] transition-colors">
                            <option value="">Todos los estados</option>
                            <option value="ACTIVO">🟢 ACTIVO</option>
                            <option value="FUERA DE SERVICIO">🔴 FUERA DE SERVICIO</option>
                            <option value="INACTIVO">⚪ INACTIVO / MANT.</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2 w-full md:w-auto">
                        <button type="submit" class="w-full md:w-auto px-4 py-2 bg-[#1E293B] hover:bg-[#2A3749] text-[#F2F5F8] text-xs font-semibold rounded-xl border border-[#334155] transition-colors flex items-center justify-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px]">filter_alt</span><span>Filtrar</span>
                        </button>
                        ${Object.keys(filters).length
                            ? html`<a href="#/catalogos" class="px-3 py-2 bg-[#161F2C] hover:bg-[#1E2732] text-[#8D98A8] hover:text-white text-xs rounded-xl border border-[#263241] transition-colors flex items-center justify-center" title="Limpiar filtros"><span class="material-symbols-outlined text-[16px]">clear_all</span></a>`
                            : ''}
                    </div>
                </form>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="bg-[#161F2C] border-b border-[#263241] text-[#8D98A8] font-mono uppercase text-[10px] tracking-wider">
                                <th class="py-3 px-4">Código</th>
                                <th class="py-3 px-4">Subsistema / Infraestructura</th>
                                <th class="py-3 px-4">Cobertura / Ubicación</th>
                                <th class="py-3 px-4 text-center">Incidencias</th>
                                <th class="py-3 px-4 text-center">Disponibilidad</th>
                                <th class="py-3 px-4 text-center">Estado</th>
                                <th class="py-3 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1D2533]">
                            ${d.items.length
                                ? d.items.map((infra) => {
                                      const code = infra.code || `INF-${String(infra.slug).toUpperCase()}`;
                                      const item = { ...infra, code, availability: infra.availability_percentage };
                                      const a = infra.availability_percentage;
                                      return html`<tr class="hover:bg-[#151D28]/60 transition-colors">
                                        <td class="py-3 px-4 font-mono font-bold text-[#3D82C6] whitespace-nowrap">${code}</td>
                                        <td class="py-3 px-4">
                                            <div class="flex items-center gap-2.5">
                                                <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style="background-color: ${infra.color}22; border: 1px solid ${infra.color}44; color: ${infra.color};">
                                                    <span class="material-symbols-outlined text-[16px]">${infra.icon || 'hub'}</span>
                                                </div>
                                                <div>
                                                    <div class="font-semibold text-white">${infra.name}</div>
                                                    <div class="text-[11px] text-[#707B8A] truncate max-w-xs">${infra.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-[#C5CED8]">
                                            <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-[#707B8A]">location_on</span><span class="truncate max-w-[200px]">${infra.location || 'Aeropuerto General (Lado Aire / Lado Tierra)'}</span></div>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <div class="inline-flex items-center gap-1.5">
                                                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1F2937] text-[#9CA3AF] border border-[#374151]">${infra.incidents_count} total</span>
                                                ${infra.active_incidents_count > 0 ? html`<span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#45121A] text-[#F87171] border border-[#7F1D1D]">${infra.active_incidents_count} activas</span>` : ''}
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <div class="inline-flex flex-col items-center">
                                                <span class="${cls('font-mono font-bold text-xs', availabilityColor(a, 'text'))}">${a}%</span>
                                                <div class="w-16 bg-[#1F2937] rounded-full h-1.5 mt-1 overflow-hidden"><div class="${cls('h-full rounded-full', availabilityColor(a, 'bg'))}" style="width: ${a}%"></div></div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">${statusPill(infra.status)}</td>
                                        <td class="py-3 px-4 text-right whitespace-nowrap">
                                            <div class="inline-flex items-center gap-1.5">
                                                <button @click="open('showViewModal', ${js(item)})" type="button" class="p-1.5 rounded-lg bg-[#161F2C] hover:bg-[#1E293B] text-[#A8B0BC] hover:text-white border border-[#263241] transition-colors" title="Ver Ficha Técnica">
                                                    <span class="material-symbols-outlined text-[16px]">visibility</span></button>
                                                ${d.can_manage
                                                    ? html`<button @click="open('showEditModal', ${js(item)})" type="button" class="p-1.5 rounded-lg bg-[#161F2C] hover:bg-[#1E293B] text-[#3D82C6] hover:text-[#93C5FD] border border-[#263241] transition-colors" title="Editar Registro">
                                                        <span class="material-symbols-outlined text-[16px]">edit</span></button>
                                                    <button @click="open('showStatusModal', ${js(item)})" type="button" class="p-1.5 rounded-lg bg-[#161F2C] hover:bg-[#1E293B] text-[#E0A21A] hover:text-[#FCD34D] border border-[#263241] transition-colors" title="Dar de Baja / Cambiar Estado Operacional">
                                                        <span class="material-symbols-outlined text-[16px]">toggle_on</span></button>`
                                                    : ''}
                                            </div>
                                        </td>
                                    </tr>`;
                                  })
                                : html`<tr><td colspan="7" class="py-8 text-center text-[#707B8A]">
                                    <div class="flex flex-col items-center justify-center">
                                        <span class="material-symbols-outlined text-[36px] text-[#475569] mb-2">layers_clear</span>
                                        <p class="font-medium text-white text-sm">No se encontraron recursos de infraestructura</p>
                                        <p class="text-xs text-[#707B8A] mt-1">Pruebe ajustando los filtros de búsqueda o categoría.</p>
                                    </div>
                                </td></tr>`}
                        </tbody>
                    </table>
                </div>
                ${d.meta.last_page > 1 ? html`<div class="p-3.5 border-t border-[#263241] bg-[#161F2C]">${pagination(d.meta, '/catalogos', query)}</div>` : ''}
            </div>

            ${d.can_manage
                ? html`
                ${modalFrame('showCreateModal', 'add_circle', 'text-[#3D82C6]', 'Dar de Alta Recurso de Infraestructura', html`<form @submit.prevent="store()" class="space-y-4" autocomplete="off">
                    ${categoryFields('createItem', true)}
                    ${modalButtons('showCreateModal', 'Guardar en Catálogo')}
                </form>`)}
                ${modalFrame('showEditModal', 'edit', 'text-[#3D82C6]', 'Editar Ficha de Infraestructura', html`<form @submit.prevent="update()" class="space-y-4" autocomplete="off">
                    ${categoryFields('activeItem', false)}
                    ${modalButtons('showEditModal', 'Actualizar Registro')}
                </form>`)}
                ${modalFrame('showStatusModal', 'toggle_on', 'text-[#E0A21A]', 'Gestionar Estado Operacional', html`
                    <div class="p-3 rounded-xl bg-[#16273B] border border-[#234269] text-xs text-[#93C5FD]">
                        <div class="font-bold mb-1" x-text="activeItem.code + ' — ' + activeItem.name"></div>
                        <p class="text-[11px] text-[#A8B0BC]">ℹ️ <strong>Nota de Seguridad Operativa:</strong> "Dar de baja" o poner fuera de servicio no elimina el registro físico de la base de datos, preservando la trazabilidad pericial e histórico de tickets.</p>
                    </div>
                    <form @submit.prevent="updateStatus()" class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-[#C5CED8] mb-1.5">Nuevo Estado *</label>
                            <div class="space-y-2">
                                ${[
                                    ['ACTIVO', 'text-[#10B981]', '🟢 ACTIVO', 'Operativo y disponible para el servicio regular en AIFA.'],
                                    ['FUERA DE SERVICIO', 'text-[#D83B52]', '🔴 FUERA DE SERVICIO', 'Indisponible por falla crítica o degradación estructural.'],
                                    ['INACTIVO', 'text-[#94A3B8]', '⚪ INACTIVO (Dar de Baja)', 'Retirado temporalmente de operación por ventana de mantenimiento.'],
                                ].map(([v, c, t, desc]) => html`<label class="flex items-center gap-3 p-2.5 rounded-xl border border-[#263241] bg-[#161F2C] hover:bg-[#1E2732] cursor-pointer">
                                    <input type="radio" value="${v}" x-model="activeItem.status" class="${cls(c, 'focus:ring-0')}">
                                    <div><div class="${cls('font-semibold text-xs', c)}">${t}</div><div class="text-[11px] text-[#707B8A]">${desc}</div></div>
                                </label>`)}
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-[#C5CED8] mb-1">Motivo / Bitácora del Cambio (Opcional)</label>
                            <input type="text" x-model="reason" maxlength="255" placeholder="Ej: Mantenimiento correctivo mayor programado..." class="${input}">
                        </div>
                        ${modalButtons('showStatusModal', 'Aplicar Cambio')}
                    </form>`, 'max-w-md')}`
                : ''}

            <div x-show="showViewModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <div @click.outside="showViewModal = false" class="bg-[#11151B] border border-[#263241] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
                    <div class="flex items-center justify-between border-b border-[#263241] pb-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="'background-color: ' + activeItem.color + '22; color: ' + activeItem.color + '; border: 1px solid ' + activeItem.color + '44;'">
                                <span class="material-symbols-outlined text-[18px]" x-text="activeItem.icon || 'hub'"></span>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white" x-text="activeItem.name"></h3>
                                <span class="text-[11px] font-mono text-[#3D82C6]" x-text="activeItem.code"></span>
                            </div>
                        </div>
                        <button type="button" @click="showViewModal = false" class="text-[#707B8A] hover:text-white"><span class="material-symbols-outlined text-[20px]">close</span></button>
                    </div>
                    <div class="space-y-3.5 text-xs">
                        <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#161F2C] border border-[#263241]">
                            <div>
                                <span class="text-[#707B8A] text-[10px] block uppercase font-mono">Estado Operacional</span>
                                <span class="font-bold inline-block mt-0.5" :class="activeItem.status === 'ACTIVO' ? 'text-[#10B981]' : (activeItem.status === 'FUERA DE SERVICIO' ? 'text-[#D83B52]' : 'text-[#94A3B8]')" x-text="activeItem.status"></span>
                            </div>
                            <div>
                                <span class="text-[#707B8A] text-[10px] block uppercase font-mono">Disponibilidad Estimada</span>
                                <span class="font-mono font-bold inline-block mt-0.5" :class="activeItem.availability >= 90 ? 'text-[#10B981]' : 'text-[#E0A21A]'" x-text="activeItem.availability + '%'"></span>
                            </div>
                        </div>
                        <div><span class="text-[#707B8A] text-[10px] uppercase font-mono block">Ubicación y Cobertura</span><p class="text-white mt-0.5" x-text="activeItem.location || 'Todo el complejo aeroportuario AIFA'"></p></div>
                        <div><span class="text-[#707B8A] text-[10px] uppercase font-mono block">Descripción Operativa</span><p class="text-[#C5CED8] mt-0.5 leading-relaxed" x-text="activeItem.description || 'Sin descripción detallada'"></p></div>
                        <div><span class="text-[#707B8A] text-[10px] uppercase font-mono block">Especificaciones Técnicas</span>
                            <div class="p-2.5 rounded-xl bg-[#0F1620] border border-[#263241] text-[#93C5FD] font-mono text-[11px] mt-0.5" x-text="activeItem.technical_specs || 'Equipos IP industriales estándar AIFA.'"></div></div>
                        <div class="flex items-center justify-between p-3 rounded-xl bg-[#161F2C] border border-[#263241]">
                            <span class="text-[#C5CED8]">Incidencias Registradas:</span>
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-white font-bold" x-text="activeItem.incidents_count + ' totales'"></span>
                                <template x-if="activeItem.active_incidents_count > 0"><span class="font-mono text-[#F87171] font-semibold" x-text="'(' + activeItem.active_incidents_count + ' activas)'"></span></template>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end pt-3 border-t border-[#263241]">
                        <button @click="showViewModal = false" type="button" class="px-5 py-2 bg-[#1E293B] hover:bg-[#263241] text-white text-xs font-semibold rounded-xl transition-colors">Cerrar Ficha</button>
                    </div>
                </div>
            </div>
        </div>`;
    },
};
