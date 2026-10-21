// resources/views/layouts/app.blade.php + components/topbar, sidebar y notifications-dropdown
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import * as auth from '../../lib/session.js';
import * as gates from '../../policies/gates.js';
import { routeIs, current, navigate } from '../../lib/router.js';
import { applicationLogo, aifaLogo } from '../components/ui.js';
import { notifications as notificationService } from '../../services/appServices.js';
import { logout } from '../../services/authService.js';
import { diffShort } from '../../lib/format.js';

const LEVEL_COLORS = {
    critical: { bg: 'bg-[#D83B52]/15', text: 'text-[#E66A7A]', border: 'border-[#D83B52]/30' },
    warning: { bg: 'bg-[#E0A21A]/15', text: 'text-[#E2B24C]', border: 'border-[#E0A21A]/30' },
    success: { bg: 'bg-[#20C997]/15', text: 'text-[#20C997]', border: 'border-[#20C997]/30' },
    info: { bg: 'bg-[#123A70]/30', text: 'text-[#3D82C6]', border: 'border-[#164A8A]/40' },
};

Alpine.data('appShell', () => ({
    sidebarHover: false,
    hoverTimeout: null,
    openSidebar() {
        clearTimeout(this.hoverTimeout);
        this.sidebarHover = true;
    },
    closeSidebar() {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
            this.sidebarHover = false;
        }, 180);
    },
}));

Alpine.data('notificationsDropdown', () => ({
    openNotif: false,
    loaded: false,
    items: [],
    unreadCount: 0,
    async init() {
        await this.refresh();
    },
    async refresh() {
        try {
            const data = await notificationService.list();
            this.items = (data.notifications || []).map((n) => {
                const d = n.data || {};
                const level = LEVEL_COLORS[d.level] ? d.level : 'info';
                return {
                    id: n.id,
                    isUnread: !n.read_at,
                    level,
                    colors: LEVEL_COLORS[level],
                    icon: d.icon || 'notifications',
                    title: d.title || 'Alerta Operacional',
                    message: d.message || '',
                    folio: d.folio || null,
                    url: d.action_url || '#',
                    ago: diffShort(n.created_at),
                };
            });
            this.unreadCount = this.items.filter((i) => i.isUnread).length;
        } catch {
            // Fallo silencioso: el centro de notificaciones no bloquea la operación
        }
        this.loaded = true;
    },
    async markAsRead(id, targetUrl = null) {
        try {
            await notificationService.markRead(id);
        } catch {
            // sin acción
        }
        if (targetUrl && targetUrl !== '#') {
            this.openNotif = false;
            window.location.hash = targetUrl.replace(/^#/, '');
        }
        await this.refresh();
    },
    async markAllAsRead() {
        try {
            await notificationService.markAllRead();
        } catch {
            // sin acción
        }
        await this.refresh();
    },
}));

Alpine.data('userMenu', () => ({
    userMenuOpen: false,
    async signOut() {
        await logout();
        navigate('/login');
    },
}));

Alpine.data('sidebarSearch', () => ({
    searchFocused: false,
    term: current().query.search || '',
    submit() {
        navigate('/incidencias', { search: this.term.trim() });
    },
    focusSearch(e) {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
            e.preventDefault();
            this.$refs.sidebarSearch.focus();
        }
    },
}));

Alpine.data('accordion', (open = false) => ({ open }));

function notificationsDropdown() {
    return html`<div x-data="notificationsDropdown" class="relative">
        <button @click="openNotif = !openNotif" type="button"
            class="relative p-2 rounded-lg text-[#8D98A8] hover:text-[#F2F5F8] hover:bg-[#11151B] transition-colors focus:outline-none"
            title="Centro de Notificaciones GTS" aria-label="Notificaciones" :aria-expanded="openNotif">
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span x-show="unreadCount > 0" x-cloak x-text="unreadCount > 99 ? '99+' : unreadCount"
                class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D83B52] text-white text-[10px] font-bold flex items-center justify-center font-mono ring-2 ring-[#070A0F] animate-pulse"></span>
        </button>

        <div x-show="openNotif" x-cloak @click.outside="openNotif = false"
            x-transition:enter="transition ease-out duration-150"
            x-transition:enter-start="transform opacity-0 scale-95 -translate-y-1"
            x-transition:enter-end="transform opacity-100 scale-100 translate-y-0"
            x-transition:leave="transition ease-in duration-100"
            x-transition:leave-start="transform opacity-100 scale-100 translate-y-0"
            x-transition:leave-end="transform opacity-0 scale-95 -translate-y-1"
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-[#11151B] border border-[#252C35] rounded-2xl shadow-enterprise z-50 overflow-hidden flex flex-col">
            <div class="px-4 py-3 border-b border-[#1B2129] flex items-center justify-between bg-[#0D1117]">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-[#F2F5F8] tracking-wide">Notificaciones</span>
                    <span x-show="unreadCount > 0" x-cloak class="px-2 py-0.5 text-[10px] font-semibold font-mono rounded-full bg-[#D83B52]/20 text-[#E66A7A] border border-[#D83B52]/30">
                        <span x-text="unreadCount"></span> nuevas
                    </span>
                </div>
                <button x-show="unreadCount > 0" x-cloak @click="markAllAsRead()" type="button"
                    class="text-[11px] font-medium text-[#3D82C6] hover:text-[#5B9FE0] transition-colors focus:outline-none flex items-center gap-1" title="Marcar todas como leídas">
                    <span class="material-symbols-outlined text-[14px]">done_all</span>
                    <span>Marcar todas</span>
                </button>
            </div>

            <div class="max-h-80 overflow-y-auto divide-y divide-[#1B2129] scrollbar-thin">
                <template x-for="notif in items" :key="notif.id">
                    <div class="p-3 transition-colors flex items-start gap-3 group" :class="notif.isUnread ? 'bg-[#151A21]/70 hover:bg-[#18202A]' : 'bg-transparent hover:bg-[#151B23]'">
                        <div class="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5" :class="notif.colors.bg + ' ' + notif.colors.text + ' ' + notif.colors.border">
                            <span class="material-symbols-outlined text-[16px]" x-text="notif.icon"></span>
                        </div>
                        <div @click="markAsRead(notif.id, notif.url)" class="flex-1 min-w-0 cursor-pointer text-left">
                            <div class="flex items-center justify-between gap-1 mb-0.5">
                                <span class="text-xs font-semibold text-[#F2F5F8] truncate leading-tight group-hover:text-[#3D82C6] transition-colors" x-text="notif.title"></span>
                                <span class="text-[10px] font-mono text-[#778394] shrink-0" x-text="notif.ago"></span>
                            </div>
                            <p class="text-[11px] text-[#A8B0BC] leading-snug line-clamp-2" x-text="notif.message"></p>
                            <template x-if="notif.folio">
                                <div class="mt-1 flex items-center gap-2">
                                    <span class="text-[10px] font-mono font-bold text-[#3D82C6] bg-[#123A70]/30 px-1.5 py-0.5 rounded border border-[#164A8A]/40" x-text="notif.folio"></span>
                                    <span x-show="notif.isUnread" class="inline-flex items-center gap-1 text-[9px] font-medium text-[#E2B24C]">
                                        <span class="w-1.5 h-1.5 rounded-full bg-[#E0A21A]"></span>
                                        Sin leer
                                    </span>
                                </div>
                            </template>
                        </div>
                        <button x-show="notif.isUnread" @click.stop="markAsRead(notif.id)" type="button"
                            class="p-1 rounded text-[#778394] hover:text-[#20C997] hover:bg-[#11151B] transition-colors shrink-0 focus:outline-none" title="Marcar como leída">
                            <span class="material-symbols-outlined text-[15px]">check</span>
                        </button>
                    </div>
                </template>

                <template x-if="loaded && items.length === 0">
                    <div class="py-8 px-4 text-center flex flex-col items-center justify-center gap-2 text-[#778394]">
                        <div class="w-10 h-10 rounded-full bg-[#0D1117] border border-[#252C35] flex items-center justify-center text-[#8D98A8]">
                            <span class="material-symbols-outlined text-[20px]">notifications_paused</span>
                        </div>
                        <p class="text-xs font-medium text-[#F2F5F8]">Sin notificaciones pendientes</p>
                        <p class="text-[11px] text-[#707B8A] max-w-[220px]">Las alertas de asignación, resolución y cambios de estado aparecerán aquí.</p>
                    </div>
                </template>
            </div>

            <div class="px-4 py-2 bg-[#0D1117] border-t border-[#1B2129] flex items-center justify-between text-[10px] font-mono text-[#778394]">
                <span class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#20C997]"></span>
                    <span>GTS • Canal Operacional Seguro</span>
                </span>
                <span class="text-[#8D98A8] font-sans">${auth.profileLabel()}</span>
            </div>
        </div>
    </div>`;
}

function topbar() {
    const u = auth.user();
    return html`<header class="h-16 px-4 sm:px-6 bg-brand-topbar border-b border-[#1B2129] flex items-center justify-between gap-4 shrink-0 select-none z-30 w-full">
        <div class="flex items-center gap-3 shrink-0">
            <a href="#/dashboard" class="flex items-center gap-3 group focus:outline-none">
                ${applicationLogo({ showBrandText: true, imgClass: 'w-10 h-10' })}
            </a>
        </div>

        <div class="hidden md:flex items-center justify-center flex-1 px-4">
            ${aifaLogo({ imgClass: 'h-7 lg:h-8' })}
        </div>

        <div class="flex items-center gap-3 sm:gap-4 shrink-0">
            ${notificationsDropdown()}

            <div x-data="userMenu" class="relative">
                <button @click="userMenuOpen = !userMenuOpen" @click.outside="userMenuOpen = false" type="button"
                    class="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#11151B] transition-colors focus:outline-none">
                    <div class="w-8 h-8 rounded-full bg-[#123A70] text-white font-bold text-xs flex items-center justify-center border border-[#164A8A] shrink-0 font-mono shadow-sm">
                        ${auth.initials()}
                    </div>
                    <div class="hidden md:flex flex-col text-left leading-tight">
                        <span class="text-xs font-semibold text-[#F2F5F8]">${u?.name}</span>
                        <span class="text-[10px] text-[#8D98A8] font-medium">${auth.topbarRoleLabel()}</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-[#778394] hidden md:inline">expand_more</span>
                </button>

                <div x-show="userMenuOpen" x-cloak
                    x-transition:enter="transition ease-out duration-150"
                    x-transition:enter-start="transform opacity-0 scale-95 -translate-y-1"
                    x-transition:enter-end="transform opacity-100 scale-100 translate-y-0"
                    x-transition:leave="transition ease-in duration-100"
                    x-transition:leave-start="transform opacity-100 scale-100 translate-y-0"
                    x-transition:leave-end="transform opacity-0 scale-95 -translate-y-1"
                    class="absolute right-0 mt-2 w-52 bg-[#11151B] border border-[#252C35] rounded-xl shadow-enterprise py-1.5 z-50 divide-y divide-[#1B2129]">
                    <div class="px-3 py-2">
                        <p class="text-xs font-semibold text-[#F2F5F8]">${u?.name}</p>
                        <p class="text-[10px] text-[#8D98A8] font-mono truncate">${u?.email ? u.email : `@${u?.username}`}</p>
                        <div class="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-[#707B8A]">
                            <span>${u?.role?.name ?? 'Usuario'}</span>
                        </div>
                    </div>
                    <div class="py-1">
                        <a href="#/perfil" class="flex items-center gap-2 px-3 py-1.5 text-xs text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23] transition-colors">
                            <span class="material-symbols-outlined text-[16px]">person</span>
                            <span>Mi Perfil</span>
                        </a>
                        ${gates.auditView()
                            ? html`<a href="#/auditoria" class="flex items-center gap-2 px-3 py-1.5 text-xs text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23] transition-colors">
                                <span class="material-symbols-outlined text-[16px]">history</span>
                                <span>Bitácora de Auditoría</span>
                            </a>`
                            : ''}
                    </div>
                    <div class="py-1">
                        <button type="button" @click="signOut()" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#E66A7A] hover:bg-[#D83B52]/10 transition-colors">
                            <span class="material-symbols-outlined text-[16px]">logout</span>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>`;
}

const itemClass = (active) =>
    active
        ? 'text-[#F2F5F8] bg-[#11151B] border border-[#263241]'
        : 'border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]';

const subItemClass = (active) =>
    active
        ? 'text-[#F2F5F8] bg-[#101923] border border-[#263241] font-semibold'
        : 'border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]';

function sidebar() {
    const { query } = current();
    const search = query.search || '';
    const incOpen = routeIs('incidents.*');

    return html`
    <div @mouseenter="openSidebar()" class="fixed top-16 bottom-0 left-0 w-3.5 z-30 pointer-events-auto bg-transparent select-none" aria-hidden="true"></div>

    <aside @mouseenter="openSidebar()" @mouseleave="closeSidebar()" @focusin="openSidebar()" @focusout="closeSidebar()"
        :class="sidebarHover ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full shadow-none'"
        class="fixed inset-y-0 left-0 z-40 top-16 w-64 bg-[#070A0F] border-r border-[#1B2129] flex flex-col justify-between -translate-x-full shadow-none transition-transform duration-200 ease-out shrink-0 select-none">

        ${gates.incidentViewAny()
            ? html`<div class="p-3 border-b border-[#1B2129] shrink-0" x-data="sidebarSearch" @keydown.window.slash="focusSearch($event)" @keydown.window.ctrl.k.prevent="$refs.sidebarSearch.focus()" @keydown.window.cmd.k.prevent="$refs.sidebarSearch.focus()">
                <form @submit.prevent="submit()" class="relative" autocomplete="off">
                    <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none transition-colors" :class="searchFocused ? 'text-[#3D82C6]' : 'text-[#707B8A]'">
                        <span class="material-symbols-outlined text-[16px]">search</span>
                    </span>
                    <input x-ref="sidebarSearch" x-model="term" @focus="searchFocused = true" @blur="searchFocused = false"
                        type="search" name="search" placeholder="Buscar incidencias..." autocomplete="off" autocorrect="off" spellcheck="false"
                        class="w-full pl-8 pr-7 py-2 bg-[#0D1117] border border-[#252C35] hover:border-[#344050] focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-xl text-xs text-[#D6DCE4] placeholder-[#6F7A89] transition-all outline-none">
                    ${search
                        ? html`<a href="#/incidencias" class="absolute inset-y-0 right-0 pr-2 flex items-center text-[#707B8A] hover:text-[#E66A7A] transition-colors" title="Limpiar búsqueda">
                            <span class="material-symbols-outlined text-[14px]">close</span></a>`
                        : html`<span class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#566170] text-[10px] font-mono select-none" title="Presiona / para buscar">/</span>`}
                </form>
            </div>`
            : ''}

        <div class="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-thin p-3.5 space-y-1.5">
            <a href="#/dashboard" class="${cls('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all', routeIs('dashboard') ? 'bg-gradient-to-r from-[#0E2D56] to-[#123A70] text-[#F2F5F8] border border-[#164A8A]/40 shadow-sm' : 'border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]')}">
                <span class="material-symbols-outlined text-[19px]">home</span>
                <span>Inicio</span>
            </a>

            ${auth.canAny('incidents.create', 'incidents.view_assigned', 'incidents.view_department', 'incidents.view_all')
                ? html`<div x-data="accordion(${js(incOpen)})" class="space-y-1">
                    <button @click="open = !open" type="button" class="${cls('w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all', itemClass(incOpen))}">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-[19px]">confirmation_number</span>
                            <span>Incidencias</span>
                        </div>
                        <span class="material-symbols-outlined text-[16px] text-[#707B8A] transition-transform duration-200" :class="open ? 'rotate-180 text-[#F2F5F8]' : ''">expand_more</span>
                    </button>
                    <div x-show="open" x-cloak
                        x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0"
                        x-transition:leave="transition ease-in duration-100" x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 -translate-y-1"
                        class="pl-4 pr-1 py-1 space-y-1">
                        ${gates.incidentCreate()
                            ? html`<a href="#/incidencias/nueva" class="${cls('flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors', subItemClass(routeIs('incidents.create')))}">
                                <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">add</span>
                                <span>Registrar incidencia</span>
                            </a>`
                            : ''}
                        ${gates.incidentMine()
                            ? html`<a href="#/incidencias/mis" class="${cls('flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors', subItemClass(routeIs('incidents.my')))}">
                                <span class="material-symbols-outlined text-[16px] text-[#707B8A]">format_list_bulleted</span>
                                <span>Mis incidencias</span>
                            </a>`
                            : ''}
                        ${gates.incidentAll()
                            ? html`<a href="#/incidencias" class="${cls('flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors', subItemClass(routeIs('incidents.index')))}">
                                <span class="material-symbols-outlined text-[16px] text-[#707B8A]">view_list</span>
                                <span>Todas las incidencias</span>
                            </a>`
                            : ''}
                    </div>
                </div>`
                : ''}

            ${gates.reportsView()
                ? html`<a href="#/reportes" class="${cls('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all', itemClass(routeIs('reports.*')))}" title="Descargar reporte">
                    <span class="material-symbols-outlined text-[19px]">bar_chart</span>
                    <span>Descargar reporte</span>
                </a>`
                : ''}

            <a href="#/indicadores" class="${cls('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all', itemClass(routeIs('indicators.*')))}">
                <span class="material-symbols-outlined text-[19px]">speed</span>
                <span>Indicadores</span>
            </a>

            ${gates.auditView()
                ? html`<a href="#/auditoria" class="${cls('w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all', itemClass(routeIs('audit.*')))}">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[19px]">manage_history</span>
                        <span>Auditoría</span>
                    </div>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1E293B] text-[#93C5FD]">LOG</span>
                </a>`
                : ''}

            ${gates.rolesView()
                ? html`<a href="#/configuracion/roles" class="${cls('w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all', itemClass(routeIs('roles.*')))}">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[19px]">admin_panel_settings</span>
                        <span>Roles y Permisos</span>
                    </div>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1E293B] text-[#A78BFA]">SEC</span>
                </a>`
                : ''}

            <a href="#/catalogos" class="${cls('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all', itemClass(routeIs('catalogs.*')))}">
                <span class="material-symbols-outlined text-[19px]">layers</span>
                <span>Catálogos</span>
            </a>

            <a href="#/perfil" class="${cls('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all', routeIs('profile.*', 'users.*', 'roles.*') ? 'bg-gradient-to-r from-[#0E2D56] to-[#123A70] text-[#F2F5F8] border border-[#164A8A]/40 font-semibold shadow-sm' : 'border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]')}">
                <span class="material-symbols-outlined text-[19px]">settings</span>
                <span>Configuración</span>
            </a>
        </div>

        <div class="px-4 py-3 border-t border-[#1B2129] bg-[#070A0F]/60 flex items-center justify-between text-[10px] font-mono text-[#707B8A] shrink-0">
            <span>v1.0.0</span>
            <span class="text-[#707B8A] font-mono text-[10px] uppercase">${auth.roleName()}</span>
        </div>
    </aside>`;
}

export function appLayout(content) {
    return html`<div x-data="appShell" @keydown.escape.window="sidebarHover = false" class="flex h-screen w-screen flex-col overflow-hidden bg-brand-canvas">
        ${topbar()}
        <div class="flex-1 flex overflow-hidden min-h-0">
            ${sidebar()}
            <main id="main" class="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin">${content}</main>
        </div>
    </div>`;
}

export function guestLayout(content) {
    return html`<div class="relative font-sans text-brand-text-primary antialiased bg-brand-canvas min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden selection:bg-brand-primary selection:text-white">
        <!-- Fondo institucional: AIFA nocturno difuminado -->
        <div class="gts-login-bg fixed inset-0 bg-cover bg-center scale-[1.02] blur-[2px] saturate-[1.1]" style="background-image: url('./images/aifa-noche-4k.jpg');" aria-hidden="true"></div>
        <div class="fixed inset-0 bg-gradient-to-b from-[#05070A]/45 via-[#05070A]/15 to-[#05070A]/60" aria-hidden="true"></div>
        <div class="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,10,0.45)_80%)]" aria-hidden="true"></div>

        <div class="relative z-10 w-full sm:max-w-md flex flex-col items-center gap-6">
            <a href="#/login" class="flex flex-col items-center gap-2 group focus:outline-none">
                ${applicationLogo({ imgClass: 'w-20 h-20 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]' })}
                <div class="flex flex-col items-center text-center mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <span class="text-xl font-bold text-brand-text-primary tracking-wider leading-tight">GTS AIFA</span>
                    <span class="text-xs text-[#C5CED8] mt-0.5">Grupo de Seguridad Tecnológica</span>
                </div>
            </a>
            <div class="w-full bg-[#11151B]/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-enterprise-lg p-6 sm:p-8">${content}</div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-[#A8B0BC] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#20C997]"></span>
                <span>NOC / APOC • Sistema Operativo Seguro</span>
            </div>
        </div>
    </div>`;
}

// Error HTTP (403 / 404 / 500) dentro del layout
export function errorPage(status, message) {
    const titles = { 403: 'Acceso denegado', 404: 'Recurso no encontrado', 0: 'Sin conexión', 500: 'Error del sistema' };
    const icons = { 403: 'gpp_bad', 404: 'search_off', 0: 'wifi_off', 500: 'error' };
    return html`<div class="w-full max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-[#11151B] border border-[#252C35] flex items-center justify-center text-[#E66A7A]">
            <span class="material-symbols-outlined text-[34px]">${icons[status] ?? 'error'}</span>
        </div>
        <span class="font-mono text-xs text-[#707B8A] tracking-widest">${status ? `ERROR ${status}` : 'ERROR'}</span>
        <h1 class="text-2xl font-bold text-[#F2F5F8]">${titles[status] ?? 'Error'}</h1>
        <p class="text-sm text-[#8D98A8] max-w-md">${message}</p>
        <a href="#/dashboard" class="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all">
            <span class="material-symbols-outlined text-[18px]">home</span>
            <span>Volver al inicio</span>
        </a>
    </div>`;
}
