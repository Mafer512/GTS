// resources/views/reports/index.blade.php (ReportController@index / exportPdf / sendEmail / shareWhatsApp)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import * as auth from '../../lib/session.js';
import * as gates from '../../policies/gates.js';
import { navigate, buildUrl } from '../../lib/router.js';
import { toApiError } from '../../lib/api.js';
import { formatDate } from '../../lib/format.js';
import * as reports from '../../services/reportService.js';
import { badgePriority, pagination, alertBanner } from '../components/ui.js';
import { isFromCco, isFromCsa } from '../../models/incident.js';
import { printReport } from '../print/reportPdf.js';
import { lookups } from '../../services/appServices.js';

const FILTER_KEYS = ['report_type', 'period_preset', 'date_from', 'date_to', 'status_id', 'priority_id', 'category_id', 'assigned_to', 'reported_by', 'search', 'folio'];

let page = null;

Alpine.data('reportsPage', () => ({
    showEmailModal: false,
    showWhatsAppModal: false,
    emailRecipient: page.requesterEmail ?? '',
    emailNotes: '',
    whatsAppPhone: '',
    copiedWhatsApp: false,
    selectedIds: [],
    selectAll: false,
    visibleIds: page.visibleIds,
    generating: false,
    actionError: '',
    actionMessage: '',

    toggleAll() {
        this.selectedIds = this.selectAll ? [...this.visibleIds] : [];
    },
    toggleOne(id) {
        const idx = this.selectedIds.indexOf(id);
        if (idx > -1) this.selectedIds.splice(idx, 1);
        else this.selectedIds.push(id);
        this.selectAll = this.visibleIds.length > 0 && this.selectedIds.length === this.visibleIds.length;
    },
    isSelected(id) {
        return this.selectedIds.includes(id);
    },
    clearSelection() {
        this.selectedIds = [];
        this.selectAll = false;
    },
    async fetchReport() {
        return reports.exportData(page.filters, this.selectedIds.length ? this.selectedIds : null);
    },
    async generatePdf() {
        if (this.generating) return;
        this.generating = true;
        this.actionError = '';
        try {
            const report = await this.fetchReport();
            await printReport(report);
        } catch (e) {
            this.actionError = toApiError(e).message;
        } finally {
            this.generating = false;
        }
    },
    async sendEmail() {
        this.actionError = '';
        try {
            const report = await this.fetchReport();
            window.location.href = reports.mailtoUrl(
                this.emailRecipient,
                report.report_folio,
                report.summary,
                report.applied_filters,
                auth.user()?.name,
                this.emailNotes
            );
            this.showEmailModal = false;
            this.actionMessage = `Se abrió su cliente de correo con el reporte formal #${report.report_folio}. Adjunte el PDF generado con "Descargar PDF Institucional".`;
        } catch (e) {
            this.actionError = toApiError(e).message;
        }
    },
    shareWhatsApp() {
        const selectedFolios = this.selectedIds.length
            ? page.rows.filter((r) => this.selectedIds.includes(r.id)).map((r) => r.folio)
            : null;
        const message = reports.formatWhatsAppMessage(
            page.summary,
            page.filters,
            reports.generateReportFolio(),
            window.location.href,
            selectedFolios
        );
        window.open(reports.whatsAppUrl(this.whatsAppPhone, message), '_blank', 'noopener');
        this.showWhatsAppModal = false;
    },
    copyPreview() {
        navigator.clipboard?.writeText(this.$refs.whatsAppText.innerText);
        this.copiedWhatsApp = true;
        setTimeout(() => (this.copiedWhatsApp = false), 2500);
    },
}));

Alpine.data('reportFilters', (initial) => ({
    f: { date_from: '', date_to: '', status_id: '', priority_id: '', category_id: '', assigned_to: '', search: '', ...initial },
    submit() {
        navigate('/reportes', this.f);
    },
}));

const STATUS_STYLES = {
    NUEVA: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    ASIGNADA: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    EN_ATENCION: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    RESUELTA: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    CERRADA: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

function preset(href, label, active, activeClass, hoverClass = 'hover:border-[#3D82C6]') {
    return html`<a href="${href}" class="${cls('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', active ? activeClass : `bg-[#0B0F14] border-[#263241] text-[#A8B0BC] ${hoverClass}`)}">${label}</a>`;
}

function selectField(label, model, placeholder, options, value) {
    return html`<div class="flex flex-col gap-1">
        <label class="text-[11px] font-medium text-[#8D98A8]">${label}</label>
        <select x-model="f.${model}" class="w-full text-xs px-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
            <option value="">${placeholder}</option>
            ${options.map((o) => html`<option value="${o.id}" ${String(value) === String(o.id) ? 'selected' : ''}>${o.name}</option>`)}
        </select>
    </div>`;
}

function summaryCard(label, labelClass, indicator, value, valueClass, sub) {
    return html`<div class="bg-[#11151B] border border-[#263241] p-3.5 rounded-xl flex flex-col justify-between">
        <div class="flex items-center justify-between text-[#8D98A8]">
            <span class="${cls('text-[11px] font-medium uppercase', labelClass)}">${label}</span>
            ${indicator}
        </div>
        <div class="mt-2">
            <span class="${cls('text-2xl font-bold font-mono', valueClass)}">${value}</span>
            <span class="text-[10px] text-[#707B8A] block">${sub}</span>
        </div>
    </div>`;
}

export default {
    name: 'reports.index',
    title: 'Reportes',
    async render({ query }) {
        const filters = {};
        FILTER_KEYS.forEach((k) => {
            if (query[k]) filters[k] = query[k];
        });
        const [d, lk] = await Promise.all([reports.data(filters, query.page || 1), lookups()]);
        const s = d.summary;
        const canExport = gates.reportsExport();
        const has = (k) => k in query;
        const keep = (omit, add) => {
            const q = { ...filters };
            omit.forEach((k) => delete q[k]);
            return buildUrl('/reportes', { ...q, ...add });
        };

        page = {
            filters,
            summary: s,
            rows: d.data,
            visibleIds: d.data.map((r) => r.id),
            requesterEmail: d.requester_email,
        };

        const preview = reports.formatWhatsAppMessage(s, filters, `PREV-${formatDate(new Date(), 'Ymd')}`, window.location.href);
        const showOrigin = gates.seesOriginBadges();
        const warning = d.search_warning;

        return html`<div x-data="reportsPage" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            <template x-if="actionMessage"><div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-emerald-400">check_circle</span><span class="font-medium" x-text="actionMessage"></span></div>
                <button type="button" @click="actionMessage = ''" class="text-emerald-400 hover:text-emerald-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>
            <template x-if="actionError"><div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-rose-400">error</span><span class="font-medium" x-text="actionError"></span></div>
                <button type="button" @click="actionError = ''" class="text-rose-400 hover:text-rose-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>
            ${alertBanner('warning', warning)}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Gestión Documental Operativa</span>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#8D98A8] font-medium">AIFA & GTS</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Sistema Profesional de Reportes</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#3D82C6] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">summarize</span><span>Centro Ejecutivo</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Generación de informes técnicos de turno, exportación pericial en PDF (1 ficha por página) y despacho multicanal para APOC y GTS.</p>
                </div>
                ${canExport
                    ? html`<div class="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                        <button type="button" @click="generatePdf()" :disabled="generating" class="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#3D82C6] hover:bg-[#316cb0] text-white font-semibold text-xs rounded-xl shadow-md transition-all group disabled:opacity-70" title="Se abrirá el diálogo de impresión: elija «Guardar como PDF»">
                            <span class="material-symbols-outlined text-[18px]" :class="generating ? 'animate-spin' : ''" x-text="generating ? 'progress_activity' : 'picture_as_pdf'">picture_as_pdf</span>
                            <span x-text="selectedIds.length > 0 ? \`Descargar PDF (\${selectedIds.length} seleccionadas)\` : 'Descargar PDF Institucional'"></span>
                        </button>
                        <button type="button" @click="showEmailModal = true" class="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#11151B] hover:bg-[#151B23] text-[#DDE3EA] border border-[#263241] font-semibold text-xs rounded-xl transition-all">
                            <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">mail</span>
                            <span x-text="selectedIds.length > 0 ? \`Enviar por Correo (\${selectedIds.length})\` : 'Enviar por Correo'"></span>
                        </button>
                        <button type="button" @click="showWhatsAppModal = true" class="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#11151B] hover:bg-[#151B23] text-[#DDE3EA] border border-[#263241] font-semibold text-xs rounded-xl transition-all">
                            <span class="material-symbols-outlined text-[18px] text-[#20C997]">chat</span>
                            <span x-text="selectedIds.length > 0 ? \`WhatsApp (\${selectedIds.length})\` : 'WhatsApp'"></span>
                        </button>
                    </div>`
                    : ''}
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">tune</span>
                        <span>Sección 1 — Presets y Tipos de Reporte</span>
                    </span>
                    ${FILTER_KEYS.some(has)
                        ? html`<a href="#/reportes" class="text-[11px] text-[#707B8A] hover:text-[#3D82C6] underline flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">refresh</span><span>Restablecer filtros</span></a>`
                        : ''}
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    ${preset('#/reportes', '🌐 General Completo', !has('period_preset') && !has('report_type') && !has('date_from'), 'bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold')}
                    ${preset(keep(['date_from', 'date_to'], { period_preset: 'today' }), '⏱️ Turno de Hoy', query.period_preset === 'today', 'bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold')}
                    ${preset(keep(['date_from', 'date_to'], { period_preset: 'week' }), '📅 Últimos 7 Días', query.period_preset === 'week', 'bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold')}
                    ${preset(keep(['date_from', 'date_to'], { period_preset: 'month' }), '📊 Mes en Curso', query.period_preset === 'month', 'bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold')}
                    ${preset(keep(['priority_id'], { report_type: 'critical' }), '🚨 Incidencias Críticas', query.report_type === 'critical', 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold', 'hover:border-rose-500/50')}
                    ${preset(keep(['status_id'], { report_type: 'open' }), '⏳ Pendientes en Atención', query.report_type === 'open', 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold', 'hover:border-amber-500/50')}
                    ${preset(keep(['status_id'], { report_type: 'resolved' }), '✅ Resueltas / VoBo', query.report_type === 'resolved', 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold', 'hover:border-emerald-500/50')}
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-5 rounded-2xl shadow-sm">
                <form x-data="reportFilters(${js({ ...(query.report_type ? { report_type: query.report_type } : {}), ...(query.period_preset && !query.date_from ? { period_preset: query.period_preset } : {}), ...filters })})" @submit.prevent="submit()" class="flex flex-col gap-4" autocomplete="off">
                    <div class="flex items-center justify-between border-b border-[#1F2937] pb-2.5 flex-wrap gap-2">
                        <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">filter_list</span>
                            <span>Sección 2 — Filtros Operativos Avanzados</span>
                        </span>
                        <span class="text-[11px] text-[#707B8A]">Los filtros se reflejan de forma idéntica en PDF, Correo y WhatsApp</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] font-medium text-[#8D98A8]">Fecha Inicial:</label>
                            <input type="date" x-model="f.date_from" class="w-full text-xs px-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] font-medium text-[#8D98A8]">Fecha Final:</label>
                            <input type="date" x-model="f.date_to" class="w-full text-xs px-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
                        </div>
                        ${selectField('Estado Operativo:', 'status_id', 'Todos los estados', lk.statuses, filters.status_id)}
                        ${selectField('Prioridad:', 'priority_id', 'Todas las prioridades', lk.priorities, filters.priority_id)}
                        ${selectField('Subsistema / Área:', 'category_id', 'Todas las áreas', lk.categories, filters.category_id)}
                        ${selectField('Técnico GTS:', 'assigned_to', 'Todos los técnicos', d.gts_users, filters.assigned_to)}
                    </div>
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div class="w-full sm:max-w-md relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707B8A] text-[18px]">search</span>
                            <input type="text" x-model="f.search" placeholder="Buscar por folio (ej. INC-2026-0106), título, ubicación..."
                                class="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6]">
                        </div>
                        <div class="flex items-center gap-2 self-end sm:self-auto">
                            <a href="#/reportes" class="px-4 py-2 rounded-xl bg-[#0B0F14] hover:bg-[#151A21] border border-[#263241] text-[#A8B0BC] text-xs font-semibold transition-all">Limpiar</a>
                            <button type="submit" class="px-5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-[#3D82C6] hover:text-white border border-[#3D82C6]/40 font-semibold text-xs transition-all flex items-center gap-2 shadow-sm">
                                <span class="material-symbols-outlined text-[17px]">filter_alt</span><span>Aplicar Filtros</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div>
                <div class="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                    <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">analytics</span>
                        <span>Sección 3 — Resumen Ejecutivo Previo (Incidencias Filtradas)</span>
                    </span>
                    <span class="text-xs text-[#707B8A] font-mono">${s.total} registros consolidados</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    ${summaryCard('Total', '', html`<span class="material-symbols-outlined text-[18px] text-[#3D82C6]">receipt_long</span>`, s.total, 'text-[#F2F5F8]', 'Incidencias en reporte')}
                    ${summaryCard('Nuevas', 'text-blue-400', html`<span class="w-2 h-2 rounded-full bg-blue-500"></span>`, s.by_status.NUEVA ?? 0, 'text-blue-400', 'Por asignar')}
                    ${summaryCard('En Atención', 'text-amber-400', html`<span class="w-2 h-2 rounded-full bg-amber-500"></span>`, s.by_status.EN_ATENCION ?? 0, 'text-amber-400', 'Técnico en campo')}
                    ${summaryCard('Resueltas', 'text-emerald-400', html`<span class="w-2 h-2 rounded-full bg-emerald-500"></span>`, s.by_status.RESUELTA ?? 0, 'text-emerald-400', 'Pendientes VoBo')}
                    ${summaryCard('Cerradas', 'text-[#8D98A8]', html`<span class="w-2 h-2 rounded-full bg-slate-500"></span>`, s.by_status.CERRADA ?? 0, 'text-[#DDE3EA]', 'Concluidas con VoBo')}
                    ${summaryCard('Eficacia', 'text-[#3D82C6]', html`<span class="material-symbols-outlined text-[18px] text-[#3D82C6]">speed</span>`, `${s.resolution_rate}%`, 'text-[#3D82C6]', `MTTR: ${s.avg_resolution_time_formatted}`)}
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div class="p-4 border-b border-[#263241] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold">Listado Nominal de Incidencias</span>
                        <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-[#151B23] border border-[#263241] text-[#3D82C6]">${d.meta.total} registros</span>
                    </div>
                    <div class="text-[11px] text-[#707B8A]">Página ${d.meta.current_page} de ${d.meta.last_page}</div>
                </div>

                <div x-show="selectedIds.length > 0" x-cloak x-transition class="p-3 bg-[#152336] border-b border-[#263241] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2 text-[#93C5FD] font-medium">
                        <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">check_box</span>
                        <span class="font-bold text-[#F2F5F8]" x-text="selectedIds.length"></span>
                        <span x-text="selectedIds.length === 1 ? 'incidencia seleccionada para el reporte' : 'incidencias seleccionadas para el reporte'"></span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        ${canExport
                            ? html`<button type="button" @click="generatePdf()" class="px-3 py-1.5 rounded-lg bg-[#3D82C6] hover:bg-[#316cb0] text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm" title="Descargar reporte con incidencias seleccionadas">
                                <span class="material-symbols-outlined text-[15px]">picture_as_pdf</span><span>Descargar Reporte (<span x-text="selectedIds.length"></span>)</span></button>
                            <button type="button" @click="showEmailModal = true" class="px-3 py-1.5 rounded-lg bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#DDE3EA] font-semibold flex items-center gap-1.5 transition-all">
                                <span class="material-symbols-outlined text-[15px] text-[#3D82C6]">mail</span><span>Correo (<span x-text="selectedIds.length"></span>)</span></button>
                            <button type="button" @click="showWhatsAppModal = true" class="px-3 py-1.5 rounded-lg bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#DDE3EA] font-semibold flex items-center gap-1.5 transition-all">
                                <span class="material-symbols-outlined text-[15px] text-[#20C997]">chat</span><span>WhatsApp (<span x-text="selectedIds.length"></span>)</span></button>`
                            : ''}
                        <button type="button" @click="clearSelection()" class="text-[#707B8A] hover:text-[#DDE3EA] underline text-[11px] ml-1">Deseleccionar todas</button>
                    </div>
                </div>

                <div class="w-full overflow-x-auto">
                    <table class="w-full min-w-[860px] table-fixed text-left text-xs text-[#DDE3EA]">
                        <thead class="bg-[#0B0F14] border-b border-[#263241] text-[10px] uppercase font-bold text-[#8D98A8] tracking-wider">
                            <tr>
                                <th class="py-2.5 px-2.5 w-[4%] text-center">
                                    <input type="checkbox" x-model="selectAll" @change="toggleAll()" class="rounded bg-[#0B0F14] border-[#263241] text-[#3D82C6] focus:ring-0 focus:ring-offset-0 cursor-pointer" title="Seleccionar todas las incidencias visibles">
                                </th>
                                <th class="py-2.5 px-2.5 w-[13%]">Folio</th>
                                <th class="py-2.5 px-2.5 w-[12%]">Apertura</th>
                                <th class="py-2.5 px-2.5 w-[13%]">Subsistema</th>
                                <th class="py-2.5 px-2.5 w-[13%]">Ubicación</th>
                                <th class="py-2.5 px-2.5 w-[23%]">Falla / Título</th>
                                <th class="py-2.5 px-2.5 w-[10%] text-center">Prioridad</th>
                                <th class="py-2.5 px-2.5 w-[12%] text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1F2937]">
                            ${d.data.length
                                ? d.data.map((inc) => html`<tr :class="isSelected(${inc.id}) ? 'bg-[#152336] border-l-2 border-[#3D82C6]' : 'hover:bg-[#151B23]'" class="transition-colors">
                                    <td class="py-2.5 px-2.5 w-[4%] text-center">
                                        <input type="checkbox" :checked="isSelected(${inc.id})" @change="toggleOne(${inc.id})" class="rounded bg-[#0B0F14] border-[#263241] text-[#3D82C6] focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                    </td>
                                    <td class="py-2.5 px-2.5 w-[13%] font-mono font-bold text-[#3D82C6]">
                                        <div class="flex flex-col">
                                            <a href="#/incidencias/${encodeURIComponent(inc.folio)}" class="hover:underline flex items-center gap-1 truncate" title="${inc.folio}">
                                                <span>${inc.folio}</span><span class="material-symbols-outlined text-[13px] text-[#707B8A]">open_in_new</span>
                                            </a>
                                            ${showOrigin
                                                ? isFromCco(inc)
                                                    ? html`<span class="inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Procedencia: APOC-CCO">CCO</span>`
                                                    : isFromCsa(inc)
                                                      ? html`<span class="inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20" title="Procedencia: APOC-CSA">CSA</span>`
                                                      : inc.origin_group
                                                        ? html`<span class="inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">${inc.origin_group}</span>`
                                                        : ''
                                                : ''}
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2.5 w-[12%] font-mono text-[#8D98A8] whitespace-nowrap text-[11px]">${formatDate(inc.created_at, 'd/m/Y H:i')}</td>
                                    <td class="py-2.5 px-2.5 w-[13%] font-semibold text-[#F2F5F8] truncate" title="${inc.category?.name ?? 'Sin categoría'}">${inc.category?.name ?? 'Sin categoría'}</td>
                                    <td class="py-2.5 px-2.5 w-[13%] text-[#A8B0BC] truncate" title="${inc.location}">${inc.location}</td>
                                    <td class="py-2.5 px-2.5 w-[23%] text-[#DDE3EA] truncate font-medium" title="${inc.title}">${inc.title}</td>
                                    <td class="py-2.5 px-2.5 w-[10%] text-center whitespace-nowrap">${badgePriority(inc.priority)}</td>
                                    <td class="py-2.5 px-2.5 w-[12%] text-center whitespace-nowrap">
                                        <span class="${cls('px-2 py-0.5 rounded-full text-[10px] font-semibold border', STATUS_STYLES[inc.status?.code] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30')}">${inc.status?.name ?? 'N/D'}</span>
                                    </td>
                                </tr>`)
                                : html`<tr><td colspan="8" class="py-12 text-center text-[#707B8A]">
                                    <div class="flex flex-col items-center gap-2">
                                        <span class="${cls('material-symbols-outlined text-[36px]', warning ? 'text-amber-400' : 'text-[#263241]')}">${warning ? 'warning' : 'search_off'}</span>
                                        <span class="${cls('text-xs font-medium', warning && 'text-amber-300')}">${warning ?? 'No se encontraron incidencias con los criterios de filtrado seleccionados.'}</span>
                                        <a href="#/reportes" class="text-xs text-[#3D82C6] hover:underline mt-1">Restablecer todos los filtros</a>
                                    </div>
                                </td></tr>`}
                        </tbody>
                    </table>
                </div>
                ${d.meta.last_page > 1 ? html`<div class="p-4 border-t border-[#263241] bg-[#0B0F14]">${pagination(d.meta, '/reportes', query)}</div>` : ''}
            </div>

            ${canExport
                ? html`<div x-show="showEmailModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div @click.outside="showEmailModal = false" class="w-full max-w-lg bg-[#11151B] border border-[#263241] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div class="p-5 border-b border-[#263241] bg-[#151B23] flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-lg bg-[#3D82C6]/15 border border-[#3D82C6]/30 flex items-center justify-center text-[#3D82C6]"><span class="material-symbols-outlined text-[19px]">mail</span></div>
                                <div>
                                    <h3 class="text-sm font-bold text-[#F2F5F8]">Despachar Reporte Oficial por Correo</h3>
                                    <span class="text-[10px] text-[#8D98A8]">Prepara el correo con el resumen ejecutivo del reporte</span>
                                </div>
                            </div>
                            <button type="button" @click="showEmailModal = false" class="text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[20px]">close</span></button>
                        </div>
                        <form @submit.prevent="sendEmail()" class="p-5 flex flex-col gap-4" autocomplete="off">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-semibold text-[#DDE3EA]">Correo Institucional Destinatario:</label>
                                <input type="email" x-model="emailRecipient" required placeholder="destinatario@aifa.aero o usuario@dominio.com"
                                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
                                <span class="text-[10px] text-[#707B8A]">Se abrirá su cliente de correo con el resumen ejecutivo y los criterios aplicados.</span>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-semibold text-[#DDE3EA]">Notas u Observaciones del Solicitante (Opcional):</label>
                                <textarea x-model="emailNotes" rows="3" maxlength="1000" placeholder="Ingrese notas aclaratorias sobre el turno, instrucciones para la jefatura de guardia o contexto relevante..."
                                    class="w-full text-xs p-3 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]"></textarea>
                            </div>
                            <div class="p-3 rounded-xl bg-[#0B0F14] border border-[#263241] text-[11px] text-[#8D98A8] flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">attach_file</span>
                                <span>Adjunte el PDF institucional (<strong class="text-[#DDE3EA] font-mono">Reporte_GTS_${formatDate(new Date(), 'Ymd')}.pdf</strong>, <span x-text="selectedIds.length > 0 ? \`\${selectedIds.length} incidencias seleccionadas\` : '${s.total} incidencias'"></span>) generado con «Descargar PDF Institucional».</span>
                            </div>
                            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1F2937]">
                                <button type="button" @click="showEmailModal = false" class="px-4 py-2 rounded-xl bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#A8B0BC] text-xs font-medium transition-all">Cancelar</button>
                                <button type="submit" class="px-5 py-2 rounded-xl bg-[#3D82C6] hover:bg-[#316cb0] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[16px]">send</span><span>Enviar Reporte Ahora</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div x-show="showWhatsAppModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div @click.outside="showWhatsAppModal = false" class="w-full max-w-lg bg-[#11151B] border border-[#263241] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div class="p-5 border-b border-[#263241] bg-[#151B23] flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400"><span class="material-symbols-outlined text-[19px]">chat</span></div>
                                <div>
                                    <h3 class="text-sm font-bold text-[#F2F5F8]">Compartir Resumen por WhatsApp</h3>
                                    <span class="text-[10px] text-[#8D98A8]">Despacho mediante enlace seguro de WhatsApp Web/Móvil</span>
                                </div>
                            </div>
                            <button type="button" @click="showWhatsAppModal = false" class="text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[20px]">close</span></button>
                        </div>
                        <form @submit.prevent="shareWhatsApp()" class="p-5 flex flex-col gap-4" autocomplete="off">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-semibold text-[#DDE3EA]">Número Telefónico del Destinatario (con lada):</label>
                                <input type="tel" x-model="whatsAppPhone" required minlength="10" maxlength="25" placeholder="Ej. +52 55 1234 5678 o 5512345678"
                                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono">
                                <span class="text-[10px] text-[#707B8A]">Formato estándar con 10 dígitos o prefijo internacional (+52 para México).</span>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-semibold text-[#8D98A8]">Vista Previa del Mensaje Oficial:</label>
                                    <button type="button" @click="copyPreview()" class="text-[11px] text-[#3D82C6] hover:text-white flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[13px]">content_copy</span>
                                        <span x-text="copiedWhatsApp ? '¡Copiado!' : 'Copiar texto'"></span>
                                    </button>
                                </div>
                                <div x-ref="whatsAppText" class="w-full text-[11px] p-3 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#A8B0BC] font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">${preview}</div>
                            </div>
                            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1F2937]">
                                <button type="button" @click="showWhatsAppModal = false" class="px-4 py-2 rounded-xl bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#A8B0BC] text-xs font-medium transition-all">Cancelar</button>
                                <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[16px]">send</span><span>Enviar por WhatsApp</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>`
                : ''}
        </div>`;
    },
};
