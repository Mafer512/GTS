// App\Models\Incident, IncidentHistory e IncidentAttachment — atributos de presentación
import { formatBytesInstitutional } from '../lib/format.js';

export const ACTIVE_CODES = ['NUEVA', 'ASIGNADA', 'EN_ATENCION'];

export const isFromCco = (incident) => incident?.origin_group === 'CCO';
export const isFromCsa = (incident) => incident?.origin_group === 'CSA';

// Incident::getOriginBadgeAttribute
export function originBadge(incident) {
    if (!incident?.reported_by) {
        return null;
    }
    switch (incident.origin_group) {
        case 'CCO':
            return { label: 'CCO', title: 'Procedencia: APOC-CCO', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
        case 'CSA':
            return { label: 'CSA', title: 'Procedencia: APOC-CSA', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' };
        case 'GTS':
            return { label: 'GTS', title: 'Procedencia: GTS', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' };
        case 'ADMIN':
            return { label: 'ADMIN', title: 'Procedencia: Administrador', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
        default: {
            const role = incident.reported_by.role;
            const label = role?.name ?? incident.origin_group ?? 'GTS';
            return {
                label,
                title: `Procedencia: ${label}`,
                bg: role?.badge_bg || 'bg-slate-500/10',
                text: role?.badge_text || 'text-slate-400',
                border: role?.badge_border || 'border-slate-500/20',
            };
        }
    }
}

// Incident::isAssignedToTics
export const isAssignedToTics = (incident) =>
    incident?.assigned_specialist === 'TICS' ||
    (incident?.assigned_areas ?? []).some((a) => String(a.area_code).toLowerCase() === 'tics');

export const assignedAreaNames = (incident) => (incident?.assigned_areas ?? []).map((a) => a.area_name);

// Nombre visible de un área asignada
export const areaLabel = (area) => (area.area_code === 'tics' ? 'TICS' : area.role?.name ?? String(area.area_code).toUpperCase());

export function areaBadgeClasses(area) {
    if (area.area_code === 'tics') {
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
    if (area.role) {
        return `${area.role.badge_bg ?? 'bg-surface-container-high'} ${area.role.badge_text ?? 'text-primary'} ${area.role.badge_border ?? 'border-border-subtle'}`;
    }
    return 'bg-surface-container-high text-on-surface border-border-subtle';
}

// Clases del distintivo de estado en tablas y encabezados
export function statusPillClasses(code) {
    if (code === 'NUEVA' || code === 'ASIGNADA') {
        return 'bg-[rgba(61,130,198,0.15)] text-[#6FA2D2] border border-[rgba(61,130,198,0.30)]';
    }
    if (code === 'EN_ATENCION' || code === 'EN_PROCESO') {
        return 'bg-[rgba(224,162,26,0.15)] text-[#E2B24C] border border-[rgba(224,162,26,0.30)]';
    }
    if (code === 'RESUELTA') {
        return 'bg-[rgba(32,201,151,0.15)] text-[#20C997] border border-[rgba(32,201,151,0.30)]';
    }
    return 'bg-[#151A21] text-[#9AA5B4] border border-[#252C35]';
}

// IncidentHistory::getActionLabel / getActionIcon / getActionBadgeClasses
export const AUDIT_ACTIONS = {
    CREADA: 'Creación de Expediente',
    ASIGNACION: 'Asignación Técnica',
    CAMBIO_ESTADO: 'Cambio de Estado',
    INICIO_ATENCION: 'Inicio de Atención',
    NOTA_TECNICA: 'Nota de Campo',
    RESOLUCION: 'Resolución Técnica',
    RECHAZO_SOLUCION: 'Rechazo de Solución',
    CERRADA: 'Cierre Definitivo (VoBo)',
};

export const actionLabel = (action) => AUDIT_ACTIONS[action] ?? action;

export function actionIcon(action) {
    return (
        {
            CREADA: 'add_circle',
            ASIGNACION: 'person_add',
            CAMBIO_ESTADO: 'sync_alt',
            INICIO_ATENCION: 'engineering',
            NOTA_TECNICA: 'edit_note',
            RESOLUCION: 'task_alt',
            RECHAZO_SOLUCION: 'replay',
            CERRADA: 'verified',
        }[action] ?? 'info'
    );
}

export function actionBadgeClasses(action) {
    return (
        {
            CREADA: 'bg-primary/10 text-primary border border-primary/30',
            ASIGNACION: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
            CAMBIO_ESTADO: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
            INICIO_ATENCION: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
            NOTA_TECNICA: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
            RESOLUCION: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
            RECHAZO_SOLUCION: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
            CERRADA: 'bg-slate-700/60 text-slate-200 border border-slate-600/50',
        }[action] ?? 'bg-surface-container-high text-on-surface-variant border border-border-subtle'
    );
}

// IncidentAttachment — atributos derivados
export const isImage = (att) => String(att?.mime_type ?? '').startsWith('image/');
export const isPdf = (att) => att?.mime_type === 'application/pdf';
export const formattedSize = (att) => formatBytesInstitutional(att?.file_size_bytes);

export function fileIcon(att) {
    if (isImage(att)) return 'image';
    if (isPdf(att)) return 'picture_as_pdf';
    if (String(att?.mime_type ?? '').includes('text')) return 'description';
    return 'attach_file';
}

export function fileBadgeColor(att) {
    if (isImage(att)) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (isPdf(att)) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
}

// Iconos de categorías en "Últimas incidencias"
export function categoryIcon(slug) {
    if (slug === 'cctv') return 'videocam';
    if (slug === 'control-acceso') return 'door_front';
    if (slug === 'fids') return 'tv';
    return 'radio';
}
