// Punto de entrada — equivalente a routes/web.php + bootstrap de Laravel
import './app.css';
import Alpine from 'alpinejs';
import { isConfigured } from './config.js';
import { supabase } from './lib/supabase.js';
import * as router from './lib/router.js';
import { isAuthenticated, clearSession } from './lib/session.js';
import { toApiError } from './lib/api.js';
import { flash } from './lib/flash.js';
import { html } from './lib/html.js';
import { bootstrap, INACTIVE_MESSAGE } from './services/authService.js';
import { appLayout, guestLayout, errorPage } from './views/layout/appLayout.js';
import { loadingBlock } from './views/components/ui.js';

import loginPage from './views/pages/login.js';
import setupPage from './views/pages/setup.js';
import dashboardPage from './views/pages/dashboard.js';
import incidentsIndexPage from './views/pages/incidentsIndex.js';
import incidentCreatePage from './views/pages/incidentCreate.js';
import incidentShowPage from './views/pages/incidentShow.js';
import indicatorsPage from './views/pages/indicators.js';
import reportsPage from './views/pages/reports.js';
import auditPage from './views/pages/audit.js';
import catalogsPage from './views/pages/catalogs.js';
import usersPage from './views/pages/users.js';
import rolesIndexPage from './views/pages/rolesIndex.js';
import rolesManagePage from './views/pages/rolesManage.js';
import profilePage from './views/pages/profile.js';

window.Alpine = Alpine;

const app = document.getElementById('app');
let renderToken = 0;
function mount(content) {
    app.innerHTML = String(content);
    const main = document.getElementById('main');
    if (main) main.scrollTop = 0;
}

async function show(page, ctx) {
    const token = ++renderToken;
    router.setActive(page.name);
    document.title = page.title ? `${page.title} · GTS AIFA` : 'GTS - Grupo de Seguridad Tecnológica AIFA';

    if (page.guest) {
        mount(guestLayout(await page.render(ctx)));
        return;
    }

    if (!isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    // Esqueleto inmediato mientras llega la información
    mount(appLayout(loadingBlock()));

    let content;
    try {
        content = await page.render(ctx);
    } catch (e) {
        const err = toApiError(e);
        if (err.status === 401) {
            clearSession();
            await supabase.auth.signOut();
            flash('login_error', err.message);
            router.navigate('/login');
            return;
        }
        if (/Usuario inactivo|No autenticado/.test(err.message)) {
            clearSession();
            await supabase.auth.signOut();
            flash('login_error', INACTIVE_MESSAGE);
            router.navigate('/login');
            return;
        }
        content = errorPage(err.status === 422 ? 500 : err.status, err.message);
    }

    if (token !== renderToken) return;
    mount(appLayout(content));
}

const page = (p) => (ctx) => show(p, ctx);

function registerRoutes() {
    router.route('/login', page(loginPage), 'login');
    router.route('/dashboard', page(dashboardPage), 'dashboard');
    router.route('/incidencias', page(incidentsIndexPage.all), 'incidents.index');
    router.route('/incidencias/mis', page(incidentsIndexPage.mine), 'incidents.my');
    router.route('/incidencias/nueva', page(incidentCreatePage), 'incidents.create');
    router.route('/incidencias/:folio', page(incidentShowPage), 'incidents.show');
    router.route('/reportes', page(reportsPage), 'reports.index');
    router.route('/indicadores', page(indicatorsPage), 'indicators.index');
    router.route('/auditoria', page(auditPage), 'audit.index');
    router.route('/catalogos', page(catalogsPage), 'catalogs.index');
    router.route('/configuracion/usuarios', page(usersPage), 'users.index');
    router.route('/configuracion/roles', page(rolesIndexPage), 'roles.index');
    router.route('/configuracion/roles/:id', page(rolesManagePage), 'roles.manage');
    router.route('/perfil', page(profilePage), 'profile.edit');
    router.route('/', () => router.navigate(isAuthenticated() ? '/dashboard' : '/login'));
    router.fallback(() => show({ name: 'error', render: async () => errorPage(404, 'La página solicitada no existe.') }, {}));
}

async function boot() {
    if (!isConfigured()) {
        mount(guestLayout(await setupPage.render()));
        return;
    }

    try {
        await bootstrap();
    } catch (e) {
        flash('login_error', toApiError(e).message);
    }

    supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
            clearSession();
            if (router.current().path !== '/login') {
                router.navigate('/login');
            }
        }
    });

    registerRoutes();
    Alpine.start();
    await router.start();
}

boot().catch((e) => {
    app.innerHTML = String(html`<div class="p-8 text-sm text-[#E66A7A] font-mono">No fue posible iniciar la aplicación: ${e.message}</div>`);
});
