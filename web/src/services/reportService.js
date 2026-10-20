// ReportService + WhatsAppReportService + IncidentReportMail (versión cliente)
import { rpc } from '../lib/api.js';
import { formatDate } from '../lib/format.js';

export const data = (filters, page = 1) => rpc('reports_data', { p_filters: filters, p_page: Number(page) || 1 });

export const exportData = (filters, selectedIds = null) =>
    rpc('reports_export', {
        p_filters: filters,
        p_selected_ids: selectedIds && selectedIds.length ? selectedIds.map(Number) : selectedIds ? [] : null,
    });

const PERIODS = { today: 'Turno Actual (Hoy)', last_7_days: 'Últimos 7 Días', week: 'Últimos 7 Días', this_month: 'Mes en Curso', month: 'Mes en Curso' };

// WhatsAppReportService::formatReportMessage
export function formatWhatsAppMessage(summary, filters, reportFolio, reportUrl = null, selectedFolios = null) {
    const dateStr = formatDate(new Date(), 'd/m/Y H:i');
    let periodLabel = 'General (Histórico Completo)';
    if (selectedFolios?.length) {
        periodLabel = `${selectedFolios.length} Incidencias Seleccionadas`;
    } else if (filters.date_from && filters.date_to) {
        periodLabel = `Del ${filters.date_from} al ${filters.date_to}`;
    } else if (filters.period_preset) {
        periodLabel = PERIODS[filters.period_preset] ?? filters.period_preset.charAt(0).toUpperCase() + filters.period_preset.slice(1);
    }

    const s = summary?.by_status ?? {};
    const selectedLine = selectedFolios?.length
        ? `🎯 *Folios Seleccionados:* ${selectedFolios.slice(0, 10).join(', ')}${selectedFolios.length > 10 ? ' y más...' : ''}\n\n`
        : '';
    const urlLine = reportUrl ? `\n🔗 *Acceso Seguro:* ${reportUrl}` : '';

    return (
        '🏛️ *AIFA — GTS (Grupo de Seguridad Tecnológica)*\n' +
        '📋 *REPORTE OPERATIVO DE INCIDENCIAS*\n' +
        `🔖 *Folio:* #${reportFolio}\n` +
        `📅 *Emisión:* ${dateStr} hrs\n` +
        `⏱️ *Período / Criterio:* ${periodLabel}\n\n` +
        selectedLine +
        '📊 *RESUMEN EJECUTIVO:*\n' +
        `• *Total Incidencias:* ${summary?.total ?? 0}\n` +
        `• 🔵 *Nuevas:* ${s.NUEVA ?? 0}\n` +
        `• 🟣 *Asignadas:* ${s.ASIGNADA ?? 0}\n` +
        `• 🟡 *En Atención:* ${s.EN_ATENCION ?? 0}\n` +
        `• 🟢 *Resueltas:* ${s.RESUELTA ?? 0}\n` +
        `• ⚪ *Cerradas:* ${s.CERRADA ?? 0}\n` +
        `• ⚡ *Tasa de Eficacia:* ${summary?.resolution_rate ?? 0}%\n` +
        `• ⏳ *MTTR Promedio:* ${summary?.avg_resolution_time_formatted ?? 'N/A'}\n` +
        urlLine +
        '\n\n' +
        '🔒 _Control Operativo Aeroportuario AIFA • Sistema GTS_'
    );
}

// WhatsAppReportService::sanitizePhoneNumber
export function sanitizePhoneNumber(phone) {
    let cleaned = String(phone || '').replace(/[^\d+]/g, '');
    if (cleaned.length === 10 && !cleaned.startsWith('+')) {
        cleaned = `52${cleaned}`;
    }
    return cleaned.replace(/^\+/, '');
}

// Modo "Enlace Oficial" de WhatsApp (api.whatsapp.com/send)
export const whatsAppUrl = (phone, message) =>
    `https://api.whatsapp.com/send?phone=${sanitizePhoneNumber(phone)}&text=${encodeURIComponent(message)}`;

export function generateReportFolio() {
    const bytes = crypto.getRandomValues(new Uint8Array(2));
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    return `REP-${formatDate(new Date(), 'Ymd')}-${hex}`;
}

// Correo: abre el cliente de correo con el resumen ejecutivo (el PDF se adjunta manualmente)
export function mailtoUrl(email, reportFolio, summary, appliedFilters, requesterName, notes) {
    const filtersText = Object.entries(appliedFilters || {})
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
    const s = summary?.by_status ?? {};
    const body =
        `Reporte Operativo de Incidencias #${reportFolio}\n` +
        `Emitido por: ${requesterName}\n` +
        `Fecha: ${formatDate(new Date(), 'd/m/Y H:i')} hrs\n\n` +
        `Criterios aplicados:\n${filtersText}\n\n` +
        `Resumen ejecutivo:\n` +
        `• Total: ${summary?.total ?? 0}\n• Nuevas: ${s.NUEVA ?? 0}\n• Asignadas: ${s.ASIGNADA ?? 0}\n` +
        `• En atención: ${s.EN_ATENCION ?? 0}\n• Resueltas: ${s.RESUELTA ?? 0}\n• Cerradas: ${s.CERRADA ?? 0}\n` +
        `• Tasa de eficacia: ${summary?.resolution_rate ?? 0}%\n• MTTR promedio: ${summary?.avg_resolution_time_formatted ?? 'N/D'}\n` +
        (notes ? `\nNotas del solicitante:\n${notes}\n` : '') +
        `\nAdjunto: Reporte_GTS_${reportFolio}.pdf\n\n— Control Operativo Aeroportuario AIFA • Sistema GTS`;
    const subject = `[GTS AIFA] Reporte Operativo de Incidencias #${reportFolio}`;
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
