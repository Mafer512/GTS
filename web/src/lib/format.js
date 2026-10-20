// Formato de fechas y números (equivalente a Carbon::format / diffForHumans en America/Mexico_City)
import { config } from '../config.js';

const partsFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: config.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
});

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function toDate(value) {
    if (!value) {
        return null;
    }
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function parts(date) {
    const p = {};
    for (const { type, value } of partsFormatter.formatToParts(date)) {
        p[type] = value;
    }
    if (p.hour === '24') {
        p.hour = '00';
    }
    return p;
}

// Patrones estilo PHP: d m Y H i s M
export function formatDate(value, pattern = 'd/m/Y H:i', fallback = 'N/D') {
    const date = toDate(value);
    if (!date) {
        return fallback;
    }
    const p = parts(date);
    const map = {
        d: p.day,
        m: p.month,
        Y: p.year,
        H: p.hour,
        i: p.minute,
        s: p.second,
        M: MONTHS_SHORT[Number(p.month) - 1],
    };
    return pattern.replace(/[dmYHisM]/g, (token) => map[token]);
}

const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'always' });

// Carbon::diffForHumans() en español
export function diffForHumans(value) {
    const date = toDate(value);
    if (!date) {
        return '';
    }
    const seconds = Math.round((date.getTime() - Date.now()) / 1000);
    const abs = Math.abs(seconds);
    if (abs < 60) return rtf.format(Math.trunc(seconds) || -1, 'second');
    if (abs < 3600) return rtf.format(Math.trunc(seconds / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.trunc(seconds / 3600), 'hour');
    if (abs < 604800) return rtf.format(Math.trunc(seconds / 86400), 'day');
    if (abs < 2629800) return rtf.format(Math.trunc(seconds / 604800), 'week');
    if (abs < 31557600) return rtf.format(Math.trunc(seconds / 2629800), 'month');
    return rtf.format(Math.trunc(seconds / 31557600), 'year');
}

// diffForHumans(null, true, true): forma corta y absoluta
export function diffShort(value) {
    const date = toDate(value);
    if (!date) {
        return '';
    }
    const abs = Math.abs(Math.round((Date.now() - date.getTime()) / 1000));
    if (abs < 60) return `${Math.max(abs, 1)} s`;
    if (abs < 3600) return `${Math.trunc(abs / 60)} min`;
    if (abs < 86400) return `${Math.trunc(abs / 3600)} h`;
    if (abs < 604800) return `${Math.trunc(abs / 86400)} d`;
    if (abs < 2629800) return `${Math.trunc(abs / 604800)} sem`;
    if (abs < 31557600) return `${Math.trunc(abs / 2629800)} mes`;
    return `${Math.trunc(abs / 31557600)} año`;
}

export const pad2 = (n) => String(n ?? 0).padStart(2, '0');

export const numberFormat = (n) => new Intl.NumberFormat('en-US').format(Number(n ?? 0));

// IndicatorService::formatMinutes
export function formatMinutes(minutes) {
    const m = Number(minutes || 0);
    if (m <= 0) return '0 min';
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const rest = m % 60;
    return rest > 0 ? `${h} h ${rest} min` : `${h} h`;
}

// IncidentAttachment::getFormattedSizeAttribute
export function formatBytesInstitutional(bytes) {
    const b = Number(bytes || 0);
    if (b >= 1048576) return `${(b / 1048576).toFixed(1)} MB`;
    if (b >= 1024) return `${Math.round(b / 1024)} KB`;
    return `${b} B`;
}

// Fecha local de hoy (YYYY-MM-DD) en la zona institucional
export function todayIso() {
    const p = parts(new Date());
    return `${p.year}-${p.month}-${p.day}`;
}
