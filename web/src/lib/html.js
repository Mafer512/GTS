// Plantillas HTML con escape automático (equivalente a {{ }} de Blade).
// html`...${valor}...` escapa los valores; raw() inserta HTML ya confiable (equivalente a {!! !!}).

class SafeHtml {
    constructor(value) {
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };

export function escape(value) {
    return String(value).replace(/[&<>"'`]/g, (c) => ESCAPES[c]);
}

function render(value) {
    if (value === null || value === undefined || value === false) {
        return '';
    }
    if (value instanceof SafeHtml) {
        return value.value;
    }
    if (Array.isArray(value)) {
        return value.map(render).join('');
    }
    return escape(value);
}

export function html(strings, ...values) {
    let out = '';
    strings.forEach((chunk, i) => {
        out += chunk;
        if (i < values.length) {
            out += render(values[i]);
        }
    });
    return new SafeHtml(out);
}

export const raw = (value) => new SafeHtml(String(value ?? ''));

// Serializa datos para expresiones Alpine dentro de atributos (equivalente a Js::from)
export const js = (value) => new SafeHtml(escape(JSON.stringify(value ?? null)));

// Concatena clases condicionales
export const cls = (...parts) => parts.flat().filter(Boolean).join(' ');

export const when = (condition, a, b = '') => (condition ? a : b);
