// Componentes Blade compartidos (resources/views/components/*)
import { html, cls } from '../../lib/html.js';
import { buildUrl } from '../../lib/router.js';

const asset = (path) => `./${path}`;

// <x-badge-priority>
export function badgePriority(priority) {
    const slug = typeof priority === 'string' ? priority.toLowerCase() : priority?.slug ?? 'media';
    const name = typeof priority === 'string' ? priority.charAt(0).toUpperCase() + priority.slice(1) : priority?.name ?? 'Media';

    if (slug === 'critica') {
        return html`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(216,59,82,0.15)] text-[#E66A7A] border border-[rgba(216,59,82,0.30)] shadow-sm whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#D83B52] animate-pulse"></span>
            ${name}
        </span>`;
    }
    if (slug === 'alta') {
        return html`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(224,109,36,0.15)] text-[#E8813C] border border-[rgba(224,109,36,0.30)] shadow-sm whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#E06D24]"></span>
            ${name}
        </span>`;
    }
    if (slug === 'media') {
        return html`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(16,185,129,0.15)] text-[#34D399] border border-[rgba(16,185,129,0.30)] shadow-sm whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            ${name}
        </span>`;
    }
    return html`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(91,134,180,0.15)] text-[#82A8D1] border border-[rgba(91,134,180,0.30)] shadow-sm whitespace-nowrap">
        <span class="w-1.5 h-1.5 rounded-full bg-[#5B86B4]"></span>
        ${name}
    </span>`;
}

// <x-badge-status>
export function badgeStatus(status) {
    const code = typeof status === 'string' ? status.toUpperCase() : status?.code ?? 'NUEVA';
    const name = typeof status === 'string' ? status : status?.name ?? 'Nueva';

    if (code === 'EN_ATENCION' || code === 'EN_PROCESO') {
        return html`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(224,162,26,0.15)] text-[#E2B24C] border border-[rgba(224,162,26,0.30)] shadow-sm whitespace-nowrap">En proceso</span>`;
    }
    if (code === 'RESUELTA') {
        return html`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(32,201,151,0.15)] text-[#20C997] border border-[rgba(32,201,151,0.30)] shadow-sm whitespace-nowrap">Resuelta</span>`;
    }
    if (code === 'NUEVA' || code === 'ASIGNADA') {
        return html`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(61,130,198,0.15)] text-[#6FA2D2] border border-[rgba(61,130,198,0.30)] shadow-sm whitespace-nowrap">${name}</span>`;
    }
    return html`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#151A21] text-[#9AA5B4] border border-[#252C35] shadow-sm whitespace-nowrap">${name}</span>`;
}

// <x-application-logo>
export function applicationLogo({ showBrandText = false, imgClass = 'w-9 h-9', wrapperClass = '' } = {}) {
    return html`<div class="${cls('inline-flex items-center gap-2.5 select-none', wrapperClass)}">
        <img src="${asset('images/gts-logo.png')}" alt="GTS - Grupo de Seguridad Tecnológica AIFA" class="${cls(imgClass, 'object-contain shrink-0')}" loading="eager" />
        ${showBrandText
            ? html`<div class="flex flex-col text-left leading-tight">
                <span class="font-extrabold text-base tracking-wider text-white font-sans">GTS</span>
                <span class="text-[9px] uppercase tracking-wider text-[#8A95A4] font-medium">Grupo de Seguridad Tecnológica</span>
            </div>`
            : ''}
    </div>`;
}

// <x-aifa-logo>
export function aifaLogo({ imgClass = 'h-7 lg:h-8', wrapperClass = '', subtext = 'AEROPUERTO INTERNACIONAL FELIPE ÁNGELES' } = {}) {
    return html`<div class="${cls('inline-flex items-center gap-3 select-none', wrapperClass)}">
        <img src="${asset('images/aifa-logo.png')}" alt="Aeropuerto Internacional Felipe Ángeles" class="${cls(imgClass, 'w-auto object-contain shrink-0')}" loading="eager" />
        <div class="flex items-center gap-2.5">
            <div class="h-6 w-px bg-[#263241]"></div>
            <div class="flex flex-col text-left leading-none">
                <span class="font-extrabold text-sm sm:text-base tracking-widest text-[#F2F5F8] font-sans">AIFA</span>
                ${subtext ? html`<span class="text-[8px] uppercase tracking-wider text-[#8D98A8] font-medium mt-0.5 whitespace-nowrap">${subtext}</span>` : ''}
            </div>
        </div>
    </div>`;
}

// Paginación (equivalente a $paginator->links() en modo oscuro)
export function pagination(meta, path, query = {}, pageParam = 'page') {
    if (!meta || meta.last_page <= 1) {
        return '';
    }
    const current = meta.current_page;
    const last = meta.last_page;
    const link = (page) => buildUrl(path, { ...query, [pageParam]: page });

    const pages = [];
    for (let p = 1; p <= last; p++) {
        if (p === 1 || p === last || Math.abs(p - current) <= 2) {
            pages.push(p);
        } else if (pages[pages.length - 1] !== '…') {
            pages.push('…');
        }
    }

    const base = 'relative inline-flex items-center px-3 py-1.5 text-xs font-medium border border-[#252C35] transition-colors';
    return html`<nav role="navigation" aria-label="Paginación" class="flex items-center justify-between w-full gap-3">
        <p class="text-xs text-[#8D98A8]">
            Mostrando <span class="font-semibold text-[#F2F5F8]">${meta.from}</span> a
            <span class="font-semibold text-[#F2F5F8]">${meta.to}</span> de
            <span class="font-semibold text-[#F2F5F8]">${meta.total}</span> resultados
        </p>
        <span class="inline-flex rounded-lg shadow-sm overflow-hidden">
            ${current > 1
                ? html`<a href="${link(current - 1)}" class="${cls(base, 'rounded-l-lg bg-[#11151B] text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23]')}" aria-label="Anterior">
                    <span class="material-symbols-outlined text-[16px]">chevron_left</span></a>`
                : html`<span class="${cls(base, 'rounded-l-lg bg-[#0B0F14] text-[#505A68] cursor-default')}"><span class="material-symbols-outlined text-[16px]">chevron_left</span></span>`}
            ${pages.map((p) =>
                p === '…'
                    ? html`<span class="${cls(base, '-ml-px bg-[#11151B] text-[#707B8A]')}">…</span>`
                    : p === current
                      ? html`<span aria-current="page" class="${cls(base, '-ml-px bg-[#123A70] text-white font-bold')}">${p}</span>`
                      : html`<a href="${link(p)}" class="${cls(base, '-ml-px bg-[#11151B] text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23]')}">${p}</a>`
            )}
            ${current < last
                ? html`<a href="${link(current + 1)}" class="${cls(base, '-ml-px rounded-r-lg bg-[#11151B] text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23]')}" aria-label="Siguiente">
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span></a>`
                : html`<span class="${cls(base, '-ml-px rounded-r-lg bg-[#0B0F14] text-[#505A68] cursor-default')}"><span class="material-symbols-outlined text-[16px]">chevron_right</span></span>`}
        </span>
    </nav>`;
}

// Banner de éxito / error descartable (session('status_message') / session('error'))
export function alertBanner(type, message) {
    if (!message) return '';
    const styles = {
        success: ['bg-emerald-500/10 border-emerald-500/30 text-emerald-300', 'text-emerald-400', 'check_circle', 'text-emerald-400 hover:text-emerald-200'],
        error: ['bg-rose-500/10 border-rose-500/30 text-rose-300', 'text-rose-400', 'error', 'text-rose-400 hover:text-rose-200'],
        warning: ['bg-amber-500/10 border-amber-500/30 text-amber-300', 'text-amber-400', 'warning', 'text-amber-400 hover:text-amber-200'],
    }[type] ?? [];
    return html`<div class="${cls('p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between shadow-lg', styles[0])}">
        <div class="flex items-center gap-3">
            <span class="${cls('material-symbols-outlined text-[22px]', styles[1])}">${styles[2]}</span>
            <span class="font-medium">${message}</span>
        </div>
        <button type="button" onclick="this.parentElement.remove()" class="${styles[3]}">
            <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
    </div>`;
}

// Pestañas de Configuración (Mi Cuenta / Usuarios / Roles)
export function configTabs(active, { showUsers, showRoles }) {
    const tab = (key, href, icon, label) =>
        key === active
            ? html`<a href="${href}" class="px-4 py-2 text-xs font-semibold rounded-t-xl bg-[#11151B] border-t border-x border-[#263241] text-[#3D82C6]">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">${icon}</span><span>${label}</span></span></a>`
            : html`<a href="${href}" class="px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors text-[#8D98A8] hover:text-[#F2F5F8] hover:bg-[#101923]">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">${icon}</span><span>${label}</span></span></a>`;

    return html`<div class="flex items-center gap-2 border-b border-[#263241] pb-1 overflow-x-auto">
        ${tab('profile', '#/perfil', 'account_circle', 'Mi Cuenta')}
        ${showUsers || active === 'users' ? tab('users', '#/configuracion/usuarios', 'group', 'Gestión de Usuarios y Cuadrillas') : ''}
        ${showRoles || active === 'roles' ? tab('roles', '#/configuracion/roles', 'admin_panel_settings', 'Gestión de Roles y Permisos') : ''}
    </div>`;
}

// Estado de carga
export function loadingBlock(label = 'Cargando información operativa…') {
    return html`<div class="w-full py-24 flex items-center justify-center gap-2 text-xs font-mono text-brand-text-muted">
        <span class="material-symbols-outlined animate-spin text-[18px] text-[#3D82C6]">progress_activity</span>
        <span>${label}</span>
    </div>`;
}
