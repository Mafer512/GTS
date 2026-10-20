// resources/views/indicators/index.blade.php (IndicatorController@index)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import { navigate } from '../../lib/router.js';
import { indicators } from '../../services/appServices.js';
import { formatMinutes } from '../../lib/format.js';

Alpine.data('indicatorFilters', (initial) => ({
    f: { category_id: '', date_from: '', date_to: '', ...initial },
    submit() {
        navigate('/indicadores', this.f);
    },
}));

function presetLink(preset, label, active) {
    return html`<a href="#/indicadores?period_preset=${preset}" class="${cls('px-3 py-2 rounded-xl text-xs font-semibold border transition-all', active ? 'bg-[#3D82C6] text-white border-[#3D82C6] shadow-sm' : 'bg-[#11151B] text-[#A8B0BC] border-[#263241] hover:text-[#F2F5F8] hover:bg-[#101923]')}">${label}</a>`;
}

function targetBadge(sample, within) {
    if (sample <= 0) return html`<span class="text-[#707B8A] text-[11px]">Sin registros</span>`;
    return within
        ? html`<span class="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Cumple tiempo estimado</span>`
        : html`<span class="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>En Riesgo</span>`;
}

function bar(label, dotStyle, count, percentage, barClass, barStyle) {
    return html`<div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-[#DDE3EA] flex items-center gap-2">
                <span class="${cls('w-2 h-2 rounded-full', dotStyle.cls)}" style="${dotStyle.style ?? ''}"></span>
                ${label}
            </span>
            <span class="font-mono text-[#8D98A8]"><span class="text-[#F2F5F8] font-bold">${count}</span> (${percentage}%)</span>
        </div>
        <div class="w-full bg-[#101923] h-2 rounded-full overflow-hidden border border-[#263241]/50">
            <div class="${cls('h-full rounded-full', barClass)}" style="width: ${percentage}%;${barStyle ?? ''}"></div>
        </div>
    </div>`;
}

export default {
    name: 'indicators.index',
    title: 'Indicadores',
    async render({ query }) {
        const filters = {};
        ['period_preset', 'date_from', 'date_to', 'category_id'].forEach((k) => {
            if (query[k]) filters[k] = query[k];
        });
        const m = await indicators.data(filters);
        const noRange = !filters.date_from;
        const bp = m.by_priority;

        return html`<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Telemetría de Ingeniería</span>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#8D98A8] font-medium">Indicadores</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Indicadores de Rendimiento Tecnológico</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#3D82C6] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">speed</span>
                            <span>Norma OACI / AFAC</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Telemetría real de tiempos de respuesta, resolución técnica (MTTR), eficiencia operativa y salud de infraestructura aeroportuaria.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    ${presetLink('today', 'Hoy', m.preset === 'today' && noRange)}
                    ${presetLink('week', 'Últimos 7 días', m.preset === 'week' && noRange)}
                    ${presetLink('month', 'Mes en curso', m.preset === 'month' && noRange)}
                    ${presetLink('all', 'Histórico', m.preset === 'all' && noRange)}
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-2xl shadow-sm">
                <form x-data="indicatorFilters(${js(filters)})" @submit.prevent="submit()" class="flex flex-col sm:flex-row items-center justify-between gap-4" autocomplete="off">
                    <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <span class="text-xs font-medium text-[#8D98A8] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">filter_alt</span>
                            <span>Filtro pericial:</span>
                        </span>
                        <select x-model="f.category_id" @change="submit()" class="bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-1.5 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]">
                            <option value="">Todos los subsistemas</option>
                            ${m.categories.map((c) => html`<option value="${c.id}" ${String(filters.category_id) === String(c.id) ? 'selected' : ''}>${c.name}</option>`)}
                        </select>
                        <div class="flex items-center gap-2">
                            <input type="date" x-model="f.date_from" autocomplete="off" class="bg-[#0B0F14] border border-[#263241] rounded-xl px-2.5 py-1.5 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]" placeholder="Desde">
                            <span class="text-xs text-[#707B8A]">a</span>
                            <input type="date" x-model="f.date_to" autocomplete="off" class="bg-[#0B0F14] border border-[#263241] rounded-xl px-2.5 py-1.5 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]" placeholder="Hasta">
                            <button type="submit" class="px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold rounded-xl border border-[#334155] transition-colors">Filtrar</button>
                        </div>
                    </div>
                    <div class="text-xs text-[#707B8A] font-mono self-start sm:self-auto">Período: <span class="text-[#F2F5F8] font-bold">${m.period_label}</span></div>
                </form>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">MTTR (Resolución)</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${formatMinutes(m.mttr_minutes)}</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-[#3D82C6]/10 text-[#3D82C6] flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">timer</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between flex-wrap gap-1.5 text-xs">
                        <span class="text-[#8D98A8]">Tiempo objetivo estimado: &lt; ${m.mttr_target} min</span>
                        ${targetBadge(m.resolved_sample_count, m.mttr_within_target)}
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">MTTA (Primera Respuesta)</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${formatMinutes(m.mtta_minutes)}</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">avg_pace</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between flex-wrap gap-1.5 text-xs">
                        <span class="text-[#8D98A8]">Tiempo objetivo estimado: &lt; ${m.mtta_target} min</span>
                        ${targetBadge(m.attended_sample_count, m.mtta_within_target)}
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">Eficiencia de Resolución</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${m.resolution_rate}%</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">verified</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs">
                        <span class="text-[#8D98A8]">${m.resolved_count} de ${m.total} cerradas</span>
                        <div class="w-20 bg-[#1F2937] h-2 rounded-full overflow-hidden"><div class="bg-emerald-500 h-full rounded-full" style="width: ${m.resolution_rate}%"></div></div>
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">Salud de Infraestructura</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${m.global_availability}%</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">dns</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs">
                        <span class="text-[#8D98A8]">${m.active_assets} / ${m.total_assets} operativos</span>
                        <span class="inline-flex items-center gap-1 text-[#10B981] font-semibold text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>Activo</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-[#11151B] border border-[#263241] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">sync_alt</span>
                                <h2 class="text-sm font-bold text-[#F2F5F8]">Distribución por Estado Operacional</h2>
                            </div>
                            <span class="text-xs text-[#8D98A8] font-mono">${m.total} eventos</span>
                        </div>
                        <div class="space-y-3">
                            ${Object.values(m.by_status).sort((a, b) => a.step_order - b.step_order).map((st) =>
                                bar(st.name, { cls: st.is_terminal ? 'bg-emerald-400' : 'bg-[#3D82C6]' }, st.count, st.percentage, st.is_terminal ? 'bg-emerald-500' : 'bg-[#3D82C6]')
                            )}
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-[#8D98A8]">
                        <span>Activas en curso: <strong class="text-amber-400">${m.open_count}</strong></span>
                        <span>Concluidas (VoBo): <strong class="text-emerald-400">${m.resolved_count}</strong></span>
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px] text-amber-400">flag</span>
                                <h2 class="text-sm font-bold text-[#F2F5F8]">Distribución por Nivel de Severidad / Prioridad</h2>
                            </div>
                            <span class="text-xs text-[#8D98A8] font-mono">${m.total} registradas</span>
                        </div>
                        <div class="space-y-3">
                            ${Object.values(bp).sort((a, b) => a.level - b.level).map((pr) => bar(`Prioridad ${pr.name}`, { cls: '', style: `background-color: ${pr.color}` }, pr.count, pr.percentage, '', ` background-color: ${pr.color}`))}
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-[#8D98A8]">
                        <span>Críticas + Altas: <strong class="text-rose-400">${(bp.critica?.count ?? 0) + (bp.alta?.count ?? 0)}</strong></span>
                        <span>Medias + Bajas: <strong class="text-blue-400">${(bp.media?.count ?? 0) + (bp.baja?.count ?? 0)}</strong></span>
                    </div>
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-[#0B0F14] border-b border-[#263241] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">hub</span>
                        <span class="font-bold text-[#F2F5F8]">Matriz de Salud Operacional por Subsistema Tecnológico</span>
                    </div>
                    <div class="text-[11px] text-[#707B8A]">Telemetría en tiempo real cruzada contra base de datos PostgreSQL</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#101923] border-b border-[#263241] text-[#8D98A8] text-[11px] font-semibold uppercase tracking-wider">
                                <th class="py-3 px-4">Subsistema / Activo</th>
                                <th class="py-3 px-4">Código</th>
                                <th class="py-3 px-4">Ubicación</th>
                                <th class="py-3 px-4 text-center">Estado Parque</th>
                                <th class="py-3 px-4 text-center">Incidencias Totales</th>
                                <th class="py-3 px-4 text-center">Activas</th>
                                <th class="py-3 px-4 text-center">Resueltas</th>
                                <th class="py-3 px-4 text-center">Condición Operativa</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1F2937] text-xs text-[#DDE3EA]">
                            ${m.infrastructure_health.length
                                ? m.infrastructure_health.map((item) => html`<tr class="hover:bg-[#151B23] transition-colors">
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border" style="background-color: ${item.color}15; border-color: ${item.color}30; color: ${item.color}">
                                                <span class="material-symbols-outlined text-[18px]">${item.icon}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-[#F2F5F8]">${item.name}</span>
                                                <span class="text-[10px] text-[#8D98A8]">${item.slug}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 font-mono text-[11px] text-[#A8B0BC]">${item.code || '—'}</td>
                                    <td class="py-3 px-4 text-[#A8B0BC]">${item.location || 'Instalaciones AIFA'}</td>
                                    <td class="py-3 px-4 text-center">
                                        ${item.status === 'ACTIVO'
                                            ? html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>ACTIVO</span>`
                                            : item.status === 'FUERA DE SERVICIO'
                                              ? html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>FUERA DE SERVICIO</span>`
                                              : html`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">${item.status}</span>`}
                                    </td>
                                    <td class="py-3 px-4 text-center font-mono font-bold text-[#F2F5F8]">${item.total_incidents}</td>
                                    <td class="py-3 px-4 text-center font-mono font-semibold">${item.open_incidents > 0 ? html`<span class="text-amber-400">${item.open_incidents}</span>` : html`<span class="text-[#707B8A]">0</span>`}</td>
                                    <td class="py-3 px-4 text-center font-mono font-semibold text-emerald-400">${item.resolved_incidents}</td>
                                    <td class="py-3 px-4 text-center">
                                        ${item.health_state === 'optimal'
                                            ? html`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"><span class="material-symbols-outlined text-[14px]">check_circle</span><span>Óptimo 100%</span></span>`
                                            : item.health_state === 'degraded'
                                              ? html`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"><span class="material-symbols-outlined text-[14px]">warning</span><span>Con Incidencias</span></span>`
                                              : html`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30"><span class="material-symbols-outlined text-[14px]">error</span><span>Fuera de Servicio</span></span>`}
                                    </td>
                                </tr>`)
                                : html`<tr><td colspan="8" class="py-8 text-center text-[#707B8A]">No hay subsistemas tecnológicos registrados en el catálogo.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    },
};
