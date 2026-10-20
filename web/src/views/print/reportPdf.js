// resources/views/reports/pdf.blade.php — expediente técnico imprimible (Guardar como PDF)
import { html, raw } from '../../lib/html.js';
import { formatDate } from '../../lib/format.js';
import { actionLabel, isFromCco, isFromCsa, isAssignedToTics } from '../../models/incident.js';

const STYLES = `
@page { size: A4 portrait; margin: 12mm 12mm 14mm 12mm;
  @bottom-left { content: "AIFA • Grupo de Seguridad Tecnológica | Folio Reporte: __FOLIO__"; font-size: 7px; color: #5A6673; }
  @bottom-right { content: "Página " counter(page) " de " counter(pages); font-size: 7px; color: #5A6673; }
}
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Helvetica, Arial, sans-serif; font-size: 8.5px; color: #0F172A; margin: 0; padding: 0; line-height: 1.3; background: #FFFFFF; }
.sheet { width: 100%; border-collapse: collapse; }
.sheet + .sheet { break-before: page; page-break-before: always; }
.sheet > thead > tr > td { padding-bottom: 7px; }
.header { border-bottom: 2px solid #0F172A; padding-bottom: 3px; margin-bottom: 7px; }
.header-table { width: 100%; border-collapse: collapse; }
.header-left { width: 65px; vertical-align: middle; text-align: left; }
.header-logo-gts { height: 48px; width: auto; max-width: 60px; display: block; }
.header-center { vertical-align: middle; text-align: center; padding: 0 8px; }
.header-logo-aifa { height: 28px; width: auto; max-width: 120px; display: block; margin: 0 auto 2px auto; }
.inst-title { font-size: 8.5px; font-weight: bold; color: #0F172A; letter-spacing: 0.03em; text-transform: uppercase; line-height: 1.15; }
.inst-sub { font-size: 7.5px; font-weight: bold; color: #1D4ED8; letter-spacing: 0.02em; line-height: 1.15; margin-top: 1px; }
.inst-dept { font-size: 6.5px; color: #64748B; text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.15; margin-top: 1px; }
.header-right { width: 195px; vertical-align: middle; text-align: right; }
.control-box { border: 1px solid #CBD5E1; background-color: #F8FAFC; padding: 3px 6px; border-radius: 4px; display: inline-block; text-align: left; width: 100%; }
.control-row { font-size: 7px; margin-bottom: 1px; }
.control-label { color: #64748B; }
.control-val { color: #0F172A; font-weight: bold; font-family: Courier, monospace; }
.classification-badge { display: inline-block; background-color: #0F172A; color: #FFFFFF; font-size: 6.5px; font-weight: bold; padding: 1.5px 5px; border-radius: 2px; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 1px; }
.incident-title-bar { background-color: #0F172A; color: #FFFFFF; padding: 5px 8px; border-radius: 3px; margin-bottom: 7px; width: 100%; overflow: hidden; }
.incident-folio-large { font-size: 11px; font-weight: bold; font-family: Courier, monospace; letter-spacing: 0.05em; color: #93C5FD; }
.incident-status-tag { float: right; font-size: 8px; font-weight: bold; text-transform: uppercase; padding: 2px 6px; border-radius: 2px; background-color: #1E293B; color: #F8FAFC; border: 1px solid #334155; }
.section-box { margin-bottom: 6px; border: 1px solid #E2E8F0; border-radius: 3px; overflow: hidden; break-inside: avoid; }
.section-header { background-color: #F1F5F9; border-bottom: 1px solid #CBD5E1; padding: 3px 6px; font-size: 7.5px; font-weight: bold; text-transform: uppercase; color: #334155; letter-spacing: 0.04em; }
.section-body { padding: 5px 7px; background-color: #FFFFFF; }
.grid-table { width: 100%; border-collapse: collapse; }
.grid-table td { padding: 2.5px 4px; vertical-align: top; font-size: 7.5px; }
.field-label { color: #64748B; font-weight: bold; text-transform: uppercase; font-size: 7px; width: 25%; }
.field-value { color: #0F172A; }
.badge-priority, .badge-status { display: inline-block; padding: 1px 4px; border-radius: 2px; font-size: 7px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.03em; }
.badge-priority-critica { background-color: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; }
.badge-priority-alta { background-color: #FFEDD5; color: #C2410C; border: 1px solid #FDBA74; }
.badge-priority-media { background-color: #D1FAE5; color: #065F46; border: 1px solid #6EE7B7; }
.badge-priority-baja { background-color: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
.badge-status-nueva { background-color: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
.badge-status-asignada { background-color: #F5F3FF; color: #6D28D9; border: 1px solid #DDD6FE; }
.badge-status-en_atencion { background-color: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; }
.badge-status-resuelta { background-color: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
.badge-status-cerrada { background-color: #F1F5F9; color: #475569; border: 1px solid #CBD5E1; }
.history-table { width: 100%; border-collapse: collapse; margin-top: 2px; }
.history-table th { background-color: #F8FAFC; color: #475569; font-size: 7px; font-weight: bold; text-transform: uppercase; padding: 3px 5px; border: 1px solid #E2E8F0; text-align: left; }
.history-table td { padding: 3px 5px; border: 1px solid #E2E8F0; font-size: 7.2px; vertical-align: top; }
.history-table tr:nth-child(even) td { background-color: #F8FAFC; }
.action-tag { font-weight: bold; color: #1E293B; font-size: 7px; }
.history-date { font-family: Courier, monospace; color: #475569; white-space: nowrap; font-size: 7px; }
.text-box { font-size: 7.5px; line-height: 1.35; color: #1E293B; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 3px; padding: 4px 6px; margin-top: 2px; white-space: pre-wrap; }
.signatures-table { width: 100%; margin-top: 10px; border-collapse: collapse; break-inside: avoid; }
.signature-cell { width: 48%; text-align: center; vertical-align: bottom; padding: 26px 10px 0 10px; }
.signature-line { border-top: 1px solid #475569; margin-bottom: 3px; }
.signature-name { font-size: 7.5px; font-weight: bold; color: #0F172A; }
.signature-role { font-size: 6.5px; color: #64748B; text-transform: uppercase; }
.footer-note { margin-top: 8px; border-top: 1px solid #E2E8F0; padding-top: 3px; font-size: 6.5px; color: #64748B; text-align: center; }
`;

function header(report, logos) {
    const r = report.requester;
    return html`<div class="header"><table class="header-table" cellpadding="0" cellspacing="0"><tr>
        <td class="header-left"><img src="${logos.gts}" class="header-logo-gts" alt="Logo GTS"></td>
        <td class="header-center">
            <img src="${logos.aifa}" class="header-logo-aifa" alt="Logo AIFA">
            <div class="inst-title">Aeropuerto Internacional Felipe Ángeles</div>
            <div class="inst-sub">GTS — Grupo de Seguridad Tecnológica</div>
            <div class="inst-dept">Expediente Técnico Pericial y Dictamen de Falla Tecnológica</div>
        </td>
        <td class="header-right"><div class="control-box">
            <div class="control-row"><span class="control-label">Folio Reporte:</span> <span class="control-val">${report.report_folio}</span></div>
            <div class="control-row"><span class="control-label">Emisión:</span> <span class="control-val">${report.generated_at}</span></div>
            <div class="control-row"><span class="control-label">Solicitante:</span> <span class="control-val">${r?.name} (${r?.badge_number ?? 'S/N'})</span></div>
            <div style="text-align: right;"><span class="classification-badge">Seguridad Operacional • AIFA</span></div>
        </div></td>
    </tr></table></div>`;
}

function minutesBetween(a, b) {
    return Math.floor(Math.abs(new Date(b) - new Date(a)) / 60000);
}

function sheet(inc, report, logos) {
    const fmt = (v, fallback) => formatDate(v, 'd/m/Y H:i:s', fallback);
    const tics = isAssignedToTics(inc) || inc.is_assigned_to_tics;
    let totalTime = html`<span style="color: #64748B;">En curso</span>`;
    if (inc.created_at && inc.resolved_at) {
        const diff = minutesBetween(inc.created_at, inc.resolved_at);
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        totalTime = html`<strong>${h > 0 ? `${h}h ${m}m` : `${m} min`}</strong>`;
    }

    return html`<table class="sheet"><thead><tr><td>${header(report, logos)}</td></tr></thead><tbody><tr><td>
        <div class="incident-title-bar">
            <span class="incident-folio-large">EXPEDIENTE: ${inc.folio}</span>
            ${isFromCco(inc) ? raw('<span style="font-size: 8px; font-weight: bold; color: #B45309; background-color: #FEF3C7; border: 1px solid #FCD34D; padding: 1px 4px; border-radius: 2px; margin-left: 5px;">ORIGEN: CCO</span>') : ''}
            ${isFromCsa(inc) ? raw('<span style="font-size: 8px; font-weight: bold; color: #C2410C; background-color: #FFEDD5; border: 1px solid #FDBA74; padding: 1px 4px; border-radius: 2px; margin-left: 5px;">ORIGEN: CSA</span>') : ''}
            <span style="font-size: 8px; color: #CBD5E1; margin-left: 8px;">Registrado: ${fmt(inc.created_at)}</span>
            <span class="incident-status-tag">ESTADO: ${inc.status?.name ?? 'NUEVA'}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;"><tr>
            <td style="width: 50%; vertical-align: top; padding-right: 4px;">
                <div class="section-box"><div class="section-header">1. Identificación y Generales</div><div class="section-body"><table class="grid-table">
                    <tr><td class="field-label">Folio:</td><td class="field-value"><strong>${inc.folio}</strong></td></tr>
                    <tr><td class="field-label">Apertura:</td><td class="field-value">${fmt(inc.created_at)}</td></tr>
                    <tr><td class="field-label">Reportante:</td><td class="field-value">${inc.reported_by?.name ?? 'Sistema Automático'} ${inc.reported_by?.badge_number ? `(${inc.reported_by.badge_number})` : ''}</td></tr>
                    <tr><td class="field-label">Procedencia:</td><td class="field-value"><strong>${isFromCco(inc) ? 'APOC-CCO (Centro de Control Operativo)' : isFromCsa(inc) ? 'APOC-CSA (Centro de Servicios Aeroportuarios)' : inc.origin_group ?? inc.reported_by?.role?.name ?? 'GTS'}</strong></td></tr>
                    <tr><td class="field-label">Rol Emisor:</td><td class="field-value">${inc.reported_by?.role?.name ?? 'APOC Operador'}</td></tr>
                </table></div></div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 4px;">
                <div class="section-box"><div class="section-header">2. Clasificación Técnica y Tiempo Estimado</div><div class="section-body"><table class="grid-table">
                    <tr><td class="field-label">Subsistema:</td><td class="field-value"><strong>${inc.category?.name ?? 'Sin asignar'}</strong></td></tr>
                    <tr><td class="field-label">Ubicación:</td><td class="field-value">${inc.location ?? 'No especificada'}</td></tr>
                    <tr><td class="field-label">Prioridad:</td><td class="field-value"><span class="badge-priority badge-priority-${inc.priority?.slug ?? 'media'}">${inc.priority?.name ?? 'Media'}</span></td></tr>
                    <tr><td class="field-label">Estado Actual:</td><td class="field-value"><span class="badge-status badge-status-${String(inc.status?.code ?? 'nueva').toLowerCase()}">${inc.status?.name ?? 'Nueva'}</span></td></tr>
                </table></div></div>
            </td>
        </tr></table>

        <div class="section-box"><div class="section-header">3. Ciclo de Atención y Cronometría Operativa</div><div class="section-body"><table class="grid-table">
            <tr>
                <td class="field-label" style="width: 20%;">Especialista Asignado:</td>
                <td class="field-value" style="width: 30%;">${tics ? html`<strong>TICS</strong> (Área Tecnológica)` : inc.assigned_to ? html`<strong>${inc.assigned_to.name}</strong> ${inc.assigned_to.badge_number ? `(${inc.assigned_to.badge_number})` : ''}` : html`<strong>Sin asignar a cuadrilla</strong>`}</td>
                <td class="field-label" style="width: 20%;">Fecha Asignación:</td>
                <td class="field-value" style="width: 30%;">${fmt(inc.assigned_at, 'Pendiente')}</td>
            </tr>
            <tr>
                <td class="field-label">Primera Atención:</td><td class="field-value">${fmt(inc.attended_at, 'Sin registro de campo')}</td>
                <td class="field-label">Resolución Técnica:</td><td class="field-value">${fmt(inc.resolved_at, 'En proceso técnico')}</td>
            </tr>
            <tr>
                <td class="field-label">Cierre Formal (VoBo):</td><td class="field-value">${fmt(inc.closed_at, 'Pendiente de VoBo APOC')}</td>
                <td class="field-label">Tiempo Total Solución:</td><td class="field-value">${totalTime}</td>
            </tr>
        </table></div></div>

        <div class="section-box"><div class="section-header">4. Descripción Operativa del Reporte Original</div><div class="section-body">
            <div style="font-weight: bold; color: #0F172A; font-size: 8px; margin-bottom: 2px;">Falla: ${inc.title}</div>
            <div class="text-box">${inc.description ?? 'Sin descripción adicional registrada.'}</div>
        </div></div>

        <div class="section-box"><div class="section-header">5. Diagnóstico y Dictamen de Solución Técnica</div><div class="section-body">
            <div class="text-box">${inc.solution_description ? inc.solution_description : html`<em style="color: #64748B;">La incidencia no cuenta con solución definitiva registrada. Continúa en protocolo técnico de atención.</em>`}</div>
            ${inc.rejection_reason ? html`<div style="margin-top: 4px; padding: 4px 6px; background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 3px; font-size: 7px; color: #991B1B;"><strong>Motivo de rechazo de solución previo por APOC:</strong> ${inc.rejection_reason}</div>` : ''}
        </div></div>

        <div class="section-box"><div class="section-header">6. Bitácora de Trazabilidad Cronológica (${inc.histories.length} Eventos Registrados)</div><div class="section-body" style="padding: 2px 4px;">
            <table class="history-table">
                <thead><tr><th style="width: 19%;">Fecha / Hora</th><th style="width: 18%;">Usuario Responsable</th><th style="width: 21%;">Acción Registrada</th><th style="width: 42%;">Detalle / Comentario de Campo</th></tr></thead>
                <tbody>
                    ${inc.histories.length
                        ? inc.histories.map((h) => html`<tr>
                            <td class="history-date">${fmt(h.created_at)}</td>
                            <td><strong>${h.user?.name ?? 'Sistema'}</strong> ${h.user?.role ? html`<span style="color: #64748B; font-size: 6.5px;">(${h.user.role.name})</span>` : ''}</td>
                            <td><span class="action-tag">${actionLabel(h.action)}</span></td>
                            <td>${h.comment ? h.comment : h.field_name ? html`<em>Cambio en ${h.field_name}: ${h.old_value ?? 'N/D'} → ${h.new_value ?? 'N/D'}</em>` : html`<span style="color: #94A3B8;">Acción ejecutada sin nota adicional</span>`}</td>
                        </tr>`)
                        : html`<tr><td colspan="4" style="text-align: center; color: #64748B; padding: 6px;">Sin registros adicionales en la bitácora pericial de trazabilidad.</td></tr>`}
                </tbody>
            </table>
        </div></div>

        <div class="section-box"><div class="section-header">7. Evidencias Fotográficas y Documentación Adjunta</div><div class="section-body">
            ${inc.attachments.length
                ? html`<table class="grid-table">${inc.attachments.map((a) => html`<tr>
                    <td style="width: 4%; font-family: monospace;">📎</td>
                    <td style="width: 46%; font-weight: bold; color: #0F172A;">${a.original_filename}</td>
                    <td style="width: 25%; color: #64748B;">${(Math.round(((a.file_size_bytes ?? 0) / 1024) * 10) / 10).toString()} KB (${a.mime_type ?? 'archivo'})</td>
                    <td style="width: 25%; color: #64748B;">Cargado por: ${a.uploaded_by ?? 'Usuario'}</td>
                </tr>`)}</table>`
                : html`<span style="color: #64748B; font-size: 7.2px;">No se registraron archivos o evidencias fotográficas anexas a este expediente.</span>`}
        </div></div>

        <table class="signatures-table"><tr>
            <td class="signature-cell">
                <div class="signature-line"></div>
                <div class="signature-name">${tics ? 'Especialista TICS' : inc.assigned_to?.name ?? 'Técnico Especialista GTS'}</div>
                <div class="signature-role">${tics ? 'Área de Tecnologías de Información y Comunicaciones' : 'Responsable de Atención / Cuadrilla GTS'}</div>
            </td>
            <td class="signature-cell">
                <div class="signature-line"></div>
                <div class="signature-name">${inc.reported_by?.name ?? 'Centro APOC'}</div>
                <div class="signature-role">Supervisión y Conformidad Operacional APOC</div>
            </td>
        </tr></table>

        <div class="footer-note">
            Ficha Oficial de Incidencia Técnica emitida por el Sistema de Gestión Tecnológica (GTS) del Aeropuerto Internacional Felipe Ángeles.<br>
            Información clasificada para fines de trazabilidad operativa y mantenimiento de infraestructuras críticas. Control: ${report.report_folio} • ${inc.folio}
        </div>
    </td></tr></tbody></table>`;
}

export function reportDocument(report) {
    const base = new URL('./', window.location.href).href;
    const logos = { gts: `${base}images/gts-logo.png`, aifa: `${base}images/aifa-logo.png` };
    const body = report.incidents.length
        ? report.incidents.map((inc) => sheet(inc, report, logos))
        : html`<div style="text-align: center; padding: 40px;"><h2 style="color: #0F172A;">No se encontraron incidencias</h2>
            <p style="color: #64748B; font-size: 11px;">No se seleccionó ninguna incidencia o los criterios de filtrado actuales no arrojaron resultados en la base de datos.</p></div>`;

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Reporte_GTS_${report.report_folio}</title>
        <style>${STYLES.replace("__FOLIO__", report.report_folio)}</style></head><body>${html`${body}`}</body></html>`;
}

// Imprime el documento en un iframe oculto (Destino: "Guardar como PDF")
export function printReport(report) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(reportDocument(report));
        doc.close();

        const images = Array.from(doc.images);
        const ready = Promise.all(images.map((img) => (img.complete ? null : new Promise((r) => { img.onload = r; img.onerror = r; }))));
        ready.then(() => {
            const previousTitle = document.title;
            document.title = `Reporte_GTS_${report.report_folio}`;
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => {
                document.title = previousTitle;
                iframe.remove();
                resolve();
            }, 1000);
        });
    });
}
