// resources/views/dashboard.blade.php + dashboard/partials/recent-incidents-rows.blade.php
import Alpine from 'alpinejs';
import { html, cls } from '../../lib/html.js';
import * as auth from '../../lib/session.js';
import * as gates from '../../policies/gates.js';
import { dashboard } from '../../services/appServices.js';
import { formatDate } from '../../lib/format.js';
import { badgePriority, badgeStatus, applicationLogo } from '../components/ui.js';
import { originBadge, categoryIcon } from '../../models/incident.js';

function recentRows(incidents) {
    if (!incidents.length) {
        return html`<tr><td colspan="5" class="py-6 text-center text-xs text-[#7E8998]">No hay incidencias registradas en el sistema.</td></tr>`;
    }
    return html`${incidents.slice(0, 5).map((inc) => {
        const badge = originBadge(inc);
        const href = `#/incidencias/${encodeURIComponent(inc.folio)}`;
        return html`<tr onclick="window.location.hash='${href.slice(1)}'" class="hover:bg-[#151B23] cursor-pointer transition-colors group" title="Ver expediente ${inc.folio}">
            <td class="py-1.5 px-3.5 font-mono font-bold text-[#3D82C6] whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                    <a href="${href}" class="group-hover:underline">${inc.folio}</a>
                    ${badge ? html`<span class="${cls('inline-flex items-center px-1 py-0.2 rounded text-[8.5px] font-bold font-mono tracking-wider border', badge.bg, badge.text, badge.border)}" title="${badge.title}">${badge.label}</span>` : ''}
                </div>
            </td>
            <td class="py-1.5 px-3.5 text-[#7E8998] font-mono whitespace-nowrap">${formatDate(inc.created_at, 'd/m/Y H:i')}</td>
            <td class="py-1.5 px-3.5 whitespace-nowrap">
                <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-[#707B8A]">${categoryIcon(inc.category?.slug)}</span>
                    <span>${inc.category?.name ?? 'CCTV'}</span>
                </span>
            </td>
            <td class="py-1.5 px-3.5 whitespace-nowrap">${badgeStatus(inc.status)}</td>
            <td class="py-1.5 px-3.5 whitespace-nowrap">${badgePriority(inc.priority)}</td>
        </tr>`;
    })}`;
}

// Sondeo en tiempo real de "Últimas incidencias" (equivalente al polling con ETag)
Alpine.data('recentIncidentsPoller', () => ({
    timer: null,
    signature: null,
    isPolling: false,
    onVisible: null,
    init() {
        this.timer = setInterval(() => this.poll(), 4000);
        this.onVisible = () => {
            if (document.visibilityState === 'visible') this.poll();
        };
        document.addEventListener('visibilitychange', this.onVisible);
    },
    destroy() {
        if (this.timer) clearInterval(this.timer);
        document.removeEventListener('visibilitychange', this.onVisible);
    },
    async poll() {
        if (this.isPolling) return;
        this.isPolling = true;
        try {
            const incidents = await dashboard.recent();
            const signature = incidents.map((i) => `${i.id}:${i.updated_at}`).join('|');
            if (signature !== this.signature) {
                if (this.signature !== null && this.$refs.recentTableBody) {
                    this.$refs.recentTableBody.innerHTML = String(recentRows(incidents));
                }
                this.signature = signature;
            }
        } catch {
            // Red resiliente: fallo silencioso ante cortes momentáneos de conectividad
        } finally {
            this.isPolling = false;
        }
    },
}));

Alpine.data('clock', () => ({
    timeStr: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    dateStr: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    timer: null,
    init() {
        this.timer = setInterval(() => {
            this.timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    },
    destroy() {
        clearInterval(this.timer);
    },
}));

function donut(items, total, colorOf) {
    let offset = 0;
    return html`<svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="38" fill="none" stroke="#1B2129" stroke-width="12" />
        ${items.map((item) => {
            const dash = total > 0 ? Math.round((item.count / total) * 238.76) : 0;
            if (dash <= 0) return '';
            const circle = html`<circle cx="50" cy="50" r="38" fill="none" stroke="${colorOf(item)}" stroke-width="12" stroke-dasharray="${dash} 239" stroke-dashoffset="-${offset}" />`;
            offset += dash;
            return circle;
        })}
    </svg>`;
}

const PRIO_COLORS = { critica: '#D83B52', alta: '#F59E0B', media: '#10B981', baja: '#1E5FA7' };

function kpi(icon, bg, value, label, footer, footerClass) {
    return html`<div class="bg-brand-surface border border-brand-border rounded-xl p-2.5 flex flex-col justify-between shadow-enterprise-sm hover:border-[#2A3440] transition-all">
        <div class="flex items-center gap-2.5">
            <div class="${cls('w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm', bg)}">
                <span class="material-symbols-outlined text-[18px]">${icon}</span>
            </div>
            <div class="flex flex-col leading-tight min-w-0">
                <span class="font-mono text-xl lg:text-2xl font-bold text-[#F2F5F8] tabular-nums">${value}</span>
                <span class="text-[11px] text-[#7F8A99] truncate">${label}</span>
            </div>
        </div>
        <div class="${cls('flex items-center gap-1 mt-1 text-[10px] font-medium', footerClass)}">
            <span class="truncate">${footer}</span>
        </div>
    </div>`;
}

function quickAction(href, icon, title, subtitle) {
    return html`<a href="${href}" class="w-full p-1.5 rounded-lg bg-[#0F141B] border border-[#252C35] hover:border-[#2A3440] hover:bg-[#151A21] text-[#E2E7ED] flex items-center gap-2.5 transition-all group">
        <div class="w-6 h-6 rounded-md bg-[#151A21] border border-[#252C35] flex items-center justify-center text-[#8A95A4] shrink-0 group-hover:text-white group-hover:bg-[#1A222C] transition-colors">
            <span class="material-symbols-outlined text-[15px]">${icon}</span>
        </div>
        <div class="flex flex-col text-left leading-tight">
            <span class="text-xs font-semibold text-[#E2E7ED]">${title}</span>
            <span class="text-[9px] text-[#8A95A4]">${subtitle}</span>
        </div>
    </a>`;
}

export default {
    name: 'dashboard',
    title: 'Inicio',
    async render() {
        const d = await dashboard.data('today');
        const m = d.metrics;
        const dist = d.distribution;
        const prios = d.priorities_summary;
        const sh = d.systems_health;

        return html`<div class="min-h-full lg:h-full p-3.5 lg:p-4 flex flex-col justify-between lg:overflow-hidden gap-3 select-none bg-brand-canvas">
            <div class="sr-only" aria-hidden="true">
                <h1>Dashboard Operativo</h1>
                ${d.immediate_attention.map((u) => html`<div>${u.folio} - ${u.title}</div>`)}
            </div>

            <div class="flex items-center justify-between gap-4 shrink-0">
                <div class="flex flex-col">
                    <h1 class="text-lg lg:text-xl font-bold text-white tracking-tight">Bienvenido, ${auth.user()?.name}</h1>
                    <p class="text-xs text-brand-text-muted mt-0.5">Aquí encontrarás el resumen de las incidencias y el estado operativo de los sistemas de seguridad tecnológica.</p>
                </div>
                <div x-data="clock" class="hidden sm:flex flex-col items-end text-right shrink-0 leading-tight">
                    <div class="flex items-center gap-3 text-xs font-mono text-slate-300">
                        <span class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[15px] text-[#707B8A]">calendar_today</span>
                            <span x-text="dateStr"></span>
                        </span>
                        <span class="flex items-center gap-1.5 font-bold text-[#F2F5F8]">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">schedule</span>
                            <span x-text="timeStr"></span>
                        </span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-[#707B8A] font-medium mt-0.5">
                        <span class="material-symbols-outlined text-[12px] text-[#D83B52]">location_on</span>
                        <span>AIFA • Santa Lucía, Edo. de México</span>
                    </div>
                </div>
            </div>

            <div class="flex-1 min-h-0 grid grid-cols-12 gap-3">
                <div class="col-span-12 lg:col-span-9 flex flex-col justify-between gap-3 lg:h-full lg:overflow-hidden">
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 shrink-0">
                        ${kpi('description', 'bg-[#164A8A]', m.total, 'Total incidencias', 'Histórico plataforma', 'text-[#7F8A99]')}
                        ${kpi('inbox', 'bg-[#0284C7]', m.new, 'Nuevas', 'Por asignar', m.new > 0 ? 'text-[#38BDF8]' : 'text-[#7F8A99]')}
                        ${kpi('schedule', 'bg-[#D99A18]', m.in_process, 'En proceso', 'Atención técnica activa', 'text-[#FBBF24]')}
                        ${kpi('check_circle', 'bg-[#12B886]', m.resolved, 'Resueltas', 'Cerradas y concluidas', 'text-[#20C997]')}
                        ${kpi('warning', 'bg-[#D83B52]', m.critical, 'Críticas', 'Severidad alta activa', m.critical > 0 ? 'text-[#F87171]' : 'text-[#7F8A99]')}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:h-[152px] shrink-0">
                        <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm hover:border-[#2A3440] transition-all">
                            <div class="flex items-center justify-between border-b border-[#202731] pb-1.5 shrink-0">
                                <h2 class="text-xs font-bold text-[#F2F5F8] flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-[15px] text-[#3D82C6]">pie_chart</span>
                                    <span>Incidencias por tipo</span>
                                </h2>
                                <span class="px-2 py-0.5 rounded text-[10px] font-mono text-[#7E8998] bg-[#151B23] border border-[#202731]">Categorías AIFA</span>
                            </div>
                            <div class="flex items-center justify-between gap-4 flex-1 min-h-0 pt-1.5">
                                <div class="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                    ${donut(dist.categories, dist.total_active, (c) => c.color)}
                                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                        <span class="font-mono text-sm font-bold text-[#F2F5F8] leading-none">${dist.total_active}</span>
                                        <span class="text-[8px] text-[#707B8A] mt-0.5">Activas</span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[10.5px] min-w-0 flex-1 overflow-y-auto scrollbar-thin pr-1">
                                    ${dist.categories.length
                                        ? dist.categories.map((c) => html`<div class="flex items-center justify-between bg-[#11161D]/50 px-2 py-0.5 rounded border border-[#1A222C]">
                                            <span class="flex items-center gap-1.5 text-[#DDE3EA] truncate" title="${c.name}">
                                                <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${c.color}"></span>
                                                <span class="truncate text-[10.5px]">${c.name}</span>
                                            </span>
                                            <span class="font-mono text-[#9AA5B4] shrink-0 ml-1 text-[10px]">
                                                <span class="font-bold text-[#F2F5F8]">${c.count}</span>
                                                <span class="text-[#707B8A] text-[9px]">(${c.percentage}%)</span>
                                            </span>
                                        </div>`)
                                        : html`<div class="col-span-2 text-[10px] text-[#707B8A] py-2 text-center">Sin incidencias activas</div>`}
                                </div>
                            </div>
                        </div>

                        <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm hover:border-[#2A3440] transition-all">
                            <div class="flex items-center justify-between border-b border-[#202731] pb-1.5 shrink-0">
                                <h2 class="text-xs font-bold text-[#F2F5F8] flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-[15px] text-[#F59E0B]">signal_cellular_alt</span>
                                    <span>Incidencias por prioridad</span>
                                </h2>
                                <span class="px-2 py-0.5 rounded text-[10px] font-mono text-[#7E8998] bg-[#151B23] border border-[#202731]">Severidad OACI</span>
                            </div>
                            <div class="flex items-center justify-between gap-4 flex-1 min-h-0 pt-1.5">
                                <div class="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                    ${donut(prios.items, prios.total, (p) => PRIO_COLORS[p.slug] ?? '#687383')}
                                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                        <span class="font-mono text-sm font-bold text-[#F2F5F8] leading-none">${prios.total}</span>
                                        <span class="text-[8px] text-[#707B8A] mt-0.5">Activas</span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[10.5px] min-w-0 flex-1 pr-1">
                                    ${prios.items.length
                                        ? prios.items.map((p) => html`<div class="flex items-center justify-between bg-[#11161D]/50 px-2.5 py-1 rounded border border-[#1A222C]">
                                            <span class="flex items-center gap-1.5 text-[#DDE3EA] truncate">
                                                <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${PRIO_COLORS[p.slug] ?? '#687383'}"></span>
                                                <span class="truncate font-medium text-[11px]">${p.name}</span>
                                            </span>
                                            <span class="font-mono text-[#9AA5B4] shrink-0 ml-1 text-[10.5px]">
                                                <span class="font-bold text-[#F2F5F8]">${p.count}</span>
                                                <span class="text-[#707B8A] text-[9.5px]">(${p.percentage}%)</span>
                                            </span>
                                        </div>`)
                                        : html`<div class="col-span-2 text-[10px] text-[#707B8A] text-center">Sin prioridades activas</div>`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div x-data="recentIncidentsPoller" class="bg-brand-surface border border-brand-border rounded-xl shadow-enterprise flex flex-col flex-1 min-h-[220px] overflow-hidden hover:border-[#2A3440] transition-all">
                        <div class="px-3.5 py-1.5 border-b border-[#202731] flex items-center justify-between shrink-0 bg-[#0D1117]">
                            <div class="flex items-center gap-2">
                                <h2 class="text-xs font-bold text-[#F2F5F8]">Últimas incidencias</h2>
                                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#151B23] text-[10px] font-mono text-[#7E8998] border border-[#202731]">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>En tiempo real</span>
                                </span>
                            </div>
                            ${gates.incidentViewAny()
                                ? html`<a href="#/incidencias" class="text-[11px] font-medium text-[#3D82C6] hover:text-[#6FA2D2] flex items-center gap-1 transition-colors group">
                                    <span>Ver todas las incidencias</span>
                                    <span class="text-[13px] group-hover:translate-x-0.5 transition-transform">→</span>
                                </a>`
                                : ''}
                        </div>
                        <div class="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin">
                            <table class="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr class="bg-[#0D1117] text-[10px] font-semibold text-[#7E8998] border-b border-[#202731] sticky top-0 z-10 select-none">
                                        <th class="py-1.5 px-3.5 font-mono">Folio</th>
                                        <th class="py-1.5 px-3.5">Fecha / Hora</th>
                                        <th class="py-1.5 px-3.5">Tipo / Categoría</th>
                                        <th class="py-1.5 px-3.5">Estado</th>
                                        <th class="py-1.5 px-3.5">Prioridad</th>
                                    </tr>
                                </thead>
                                <tbody x-ref="recentTableBody" class="divide-y divide-[#202731] text-[11px] text-[#DDE3EA]">
                                    ${recentRows(d.recent_incidents)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-3 flex flex-col justify-between gap-3 lg:h-full lg:overflow-hidden">
                    <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm shrink-0">
                        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-[#202731]">
                            <h2 class="text-xs font-bold text-[#F2F5F8] flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-[15px] text-[#3D82C6]">hub</span>
                                <span>Estado de sistemas (monitoreo)</span>
                            </h2>
                            ${sh.total > 0
                                ? html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono border"
                                    style="background-color: ${sh.badge_bg}; color: ${sh.color}; border-color: ${sh.badge_border};"
                                    title="Disponibilidad: ${sh.active}/${sh.total} sistemas operativos">
                                    <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${sh.color}"></span>
                                    ${sh.state} (${sh.percentage}%)
                                </span>`
                                : html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[#707B8A] bg-[#151B23] border border-[#202731]">Sin registros</span>`}
                        </div>
                        <div class="space-y-1.5 text-xs max-h-48 overflow-y-auto scrollbar-thin pr-1">
                            ${sh.systems.length
                                ? sh.systems.map((s) => html`<div class="flex items-center justify-between py-0.5">
                                    <span class="flex items-center gap-2 text-[#D6DCE4] truncate min-w-0" title="${s.name} (${s.code ?? 'S/C'})">
                                        <span class="material-symbols-outlined text-[17px] text-brand-text-muted shrink-0">${s.icon}</span>
                                        <span class="truncate">${s.name}</span>
                                    </span>
                                    <span class="flex items-center gap-1.5 text-[11px] font-medium shrink-0 ml-1.5" style="color: ${s.status_color}">
                                        <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${s.status_color}"></span>
                                        ${s.status_label}
                                    </span>
                                </div>`)
                                : html`<div class="py-3 text-center text-xs text-[#707B8A]">No hay sistemas registrados en el catálogo.</div>`}
                        </div>
                        <a href="#/catalogos" class="mt-2 pt-1.5 border-t border-brand-border/60 text-[10px] font-medium text-[#3D82C6] hover:text-[#5B9FE0] flex items-center justify-end gap-1 transition-colors">
                            <span>Ver detalle de sistemas</span>
                            <span class="text-[12px]">→</span>
                        </a>
                    </div>

                    <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm flex-1 min-h-0">
                        <div>
                            <h2 class="text-xs font-bold text-[#F2F5F8] mb-1.5">Acciones rápidas</h2>
                            <div class="space-y-1.5">
                                ${gates.incidentCreate()
                                    ? html`<a href="#/incidencias/nueva" class="w-full p-2 rounded-xl bg-[#123A70] hover:bg-[#164A8A] border border-white/10 text-white flex items-center gap-2.5 transition-all shadow-sm group">
                                        <div class="w-7 h-7 rounded-lg bg-[#164A8A] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                                            <span class="material-symbols-outlined text-[18px]">add</span>
                                        </div>
                                        <div class="flex flex-col text-left leading-tight">
                                            <span class="text-xs font-bold">Registrar incidencia</span>
                                            <span class="text-[9px] text-[#A8C4E6]">Crear un nuevo reporte</span>
                                        </div>
                                    </a>`
                                    : ''}
                                ${gates.incidentViewAny() ? quickAction('#/incidencias', 'search', 'Consultar incidencias', 'Buscar y filtrar reportes') : ''}
                                ${quickAction('#/indicadores', 'analytics', 'Ver indicadores', 'Métricas y desempeño')}
                                ${gates.reportsView() ? quickAction('#/reportes', 'description', 'Descargar reporte', 'Exportar información') : ''}
                            </div>
                        </div>
                        <div class="mt-2 p-2 rounded-xl bg-[#0F141B] border border-[#252C35] flex items-center gap-2.5">
                            ${applicationLogo({ imgClass: 'w-7 h-7', wrapperClass: 'shrink-0' })}
                            <div class="flex flex-col text-left leading-tight min-w-0">
                                <span class="font-bold text-[11px] text-[#F2F5F8]">GTS</span>
                                <span class="text-[9px] text-[#8A95A4] truncate">Grupo de Seguridad Tecnológica • Operación Crítica AIFA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },
};
