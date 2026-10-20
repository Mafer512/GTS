// Enrutador por hash (#/ruta?param=valor) — compatible con GitHub Pages (sitio estático)

const routes = [];
let notFoundHandler = null;
let onNavigate = null;

export function route(pattern, handler, name = null) {
    const keys = [];
    const regex = new RegExp(
        '^' +
            pattern.replace(/\/:([a-zA-Z_]+)/g, (_, key) => {
                keys.push(key);
                return '/([^/]+)';
            }) +
            '/?$'
    );
    routes.push({ pattern, regex, keys, handler, name });
}

export function fallback(handler) {
    notFoundHandler = handler;
}

export function onRouteChange(callback) {
    onNavigate = callback;
}

export function parseHash(hash = window.location.hash) {
    const value = hash.replace(/^#/, '') || '/';
    const [path, queryString = ''] = value.split('?');
    const query = {};
    const params = new URLSearchParams(queryString);
    for (const key of new Set(params.keys())) {
        const all = params.getAll(key);
        query[key] = key.endsWith('[]') ? all : all[all.length - 1];
    }
    return { path: decodeURI(path || '/'), query };
}

export function current() {
    return parseHash();
}

export function buildUrl(path, query = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value === null || value === undefined || value === '') continue;
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
        } else {
            params.append(key, value);
        }
    }
    const qs = params.toString();
    return `#${path}${qs ? `?${qs}` : ''}`;
}

export function navigate(path, query = {}) {
    const url = buildUrl(path, query);
    if (window.location.hash === url) {
        resolve();
    } else {
        window.location.hash = url;
    }
}

export function reload() {
    resolve();
}

export async function resolve() {
    const { path, query } = parseHash();
    for (const r of routes) {
        const match = path.match(r.regex);
        if (match) {
            const params = {};
            r.keys.forEach((key, i) => {
                params[key] = decodeURIComponent(match[i + 1]);
            });
            if (onNavigate) onNavigate({ path, query, params, name: r.name });
            return r.handler({ path, query, params, name: r.name });
        }
    }
    if (notFoundHandler) {
        return notFoundHandler({ path, query, params: {} });
    }
    return undefined;
}

export function start() {
    window.addEventListener('hashchange', resolve);
    return resolve();
}

// Nombre de la ruta activa (equivalente a request()->routeIs())
let activeName = null;
export const setActive = (name) => {
    activeName = name;
};
export const routeIs = (...patterns) =>
    patterns.some((p) => (p.endsWith('*') ? (activeName || '').startsWith(p.slice(0, -1)) : activeName === p));
