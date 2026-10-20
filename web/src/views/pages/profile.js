// resources/views/profile/edit.blade.php + partials (ProfileController / PasswordController)
import Alpine from 'alpinejs';
import { html, js } from '../../lib/html.js';
import * as auth from '../../lib/session.js';
import * as gates from '../../policies/gates.js';
import { navigate } from '../../lib/router.js';
import { toApiError } from '../../lib/api.js';
import { profile } from '../../services/appServices.js';
import { bootstrap, logout } from '../../services/authService.js';
import { configTabs } from '../components/ui.js';

Alpine.data('profileInfoForm', (initial) => ({
    form: { ...initial },
    saved: false,
    error: '',
    saving: false,
    async submit() {
        if (this.saving) return;
        this.saving = true;
        this.error = '';
        try {
            await profile.update(this.form.name, this.form.email, auth.isAdmin() ? this.form.username : null);
            await bootstrap();
            this.saved = true;
            setTimeout(() => (this.saved = false), 2000);
        } catch (e) {
            this.error = toApiError(e).message;
        } finally {
            this.saving = false;
        }
    },
}));

Alpine.data('passwordForm', () => ({
    current: '',
    password: '',
    confirmation: '',
    saved: false,
    error: '',
    saving: false,
    async submit() {
        if (this.saving) return;
        this.saving = true;
        this.error = '';
        try {
            await profile.changePassword(this.current, this.password, this.confirmation);
            this.current = this.password = this.confirmation = '';
            this.saved = true;
            setTimeout(() => (this.saved = false), 2000);
        } catch (e) {
            this.error = toApiError(e).message;
        } finally {
            this.saving = false;
        }
    },
}));

Alpine.data('deleteAccount', () => ({
    show: false,
    password: '',
    error: '',
    async submit() {
        this.error = '';
        try {
            await profile.destroy(this.password);
            await logout();
            navigate('/login');
        } catch (e) {
            this.error = toApiError(e).message;
        }
    },
}));

const input = 'bg-brand-surface-subtle border border-brand-border text-brand-text-primary placeholder:text-brand-text-muted focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-lg shadow-sm text-sm px-3 py-2 transition-colors outline-none mt-1 block w-full';
const label = 'block font-medium text-xs text-brand-text-secondary uppercase tracking-wider mb-1.5';
const primary = 'inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white text-xs font-semibold rounded-lg shadow-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#164A8A] transition-all duration-150 disabled:opacity-60';

export default {
    name: 'profile.edit',
    title: 'Mi perfil',
    async render() {
        await bootstrap();
        const u = auth.user();
        const isAdmin = auth.isAdmin();

        return html`<div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${isAdmin || auth.canAny('users.view', 'roles.view') ? configTabs('profile', { showUsers: gates.usersView(), showRoles: gates.rolesView() }) : ''}

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Credenciales y Seguridad</span>
                        <span class="text-brand-text-faint">•</span>
                        <span class="text-xs uppercase tracking-widest text-brand-text-muted font-mono">AIFA ID-${u.id}</span>
                    </div>
                    <h1 class="text-2xl font-bold text-brand-text-primary tracking-tight">Perfil de Operador</h1>
                    <p class="text-xs text-brand-text-muted mt-0.5">Gestión de identidad, contraseña y parámetros de cuenta institucional AIFA.</p>
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-xs font-mono text-brand-text-secondary self-start sm:self-auto">
                    <span class="w-2 h-2 rounded-full bg-[#20C997] animate-pulse"></span><span>Sesión Activa</span>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6">
                <div class="p-6 bg-brand-surface border border-brand-border rounded-xl shadow-enterprise">
                    <div class="max-w-xl">
                        <section x-data="profileInfoForm(${js({ name: u.name, email: u.email ?? '', username: u.username })})">
                            <header>
                                <h2 class="text-lg font-medium text-brand-text-primary">Información del Perfil</h2>
                                <p class="mt-1 text-sm text-brand-text-muted">Actualice la información de su cuenta y su correo electrónico.</p>
                            </header>
                            <form @submit.prevent="submit()" class="mt-6 space-y-6" autocomplete="off">
                                <div>
                                    <label for="name" class="${label}">Nombre</label>
                                    <input id="name" x-model="form.name" type="text" class="${input}" required maxlength="255" autocomplete="off" />
                                </div>
                                ${isAdmin
                                    ? html`<div>
                                        <label for="username" class="${label}">Usuario (Login)</label>
                                        <input id="username" x-model="form.username" type="text" class="${input}" required maxlength="50" autocomplete="off" />
                                    </div>`
                                    : html`<div>
                                        <div class="flex items-center justify-between mb-1">
                                            <label for="username" class="${label}">Usuario (Login)</label>
                                            <span class="text-[10px] font-mono text-[#707B8A] bg-[#11151B] px-2 py-0.5 rounded border border-[#263241] flex items-center gap-1">
                                                <span class="material-symbols-outlined text-[13px] text-amber-400">lock</span><span>No editable</span>
                                            </span>
                                        </div>
                                        <input id="username" type="text" class="${input} bg-[#070A0F] text-[#8D98A8] border-[#1F2937] cursor-not-allowed opacity-80 select-none font-mono" value="${u.username}" readonly disabled />
                                        <p class="mt-1 text-[11px] text-[#707B8A]">El nombre de usuario institucional es permanente y únicamente puede ser gestionado por la Administración del Sistema.</p>
                                    </div>`}
                                <div>
                                    <label for="email" class="${label}">Correo Electrónico (Opcional)</label>
                                    <input id="email" x-model="form.email" type="email" class="${input}" maxlength="255" autocomplete="off" />
                                </div>
                                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1"><li x-text="error"></li></ul>
                                <div class="flex items-center gap-4">
                                    <button type="submit" :disabled="saving" class="${primary}">Guardar</button>
                                    <p x-show="saved" x-transition x-cloak class="text-sm text-[#20C997] font-medium">Guardado.</p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                <div class="p-6 bg-brand-surface border border-brand-border rounded-xl shadow-enterprise">
                    <div class="max-w-xl">
                        <section x-data="passwordForm">
                            <header>
                                <h2 class="text-lg font-medium text-brand-text-primary">Actualizar Contraseña</h2>
                                <p class="mt-1 text-sm text-brand-text-muted">Asegúrese de que su cuenta use una contraseña larga y aleatoria para mantenerla segura.</p>
                            </header>
                            <form @submit.prevent="submit()" class="mt-6 space-y-6">
                                <div><label for="current_password" class="${label}">Contraseña Actual</label><input id="current_password" x-model="current" type="password" class="${input}" autocomplete="current-password" /></div>
                                <div><label for="new_password" class="${label}">Nueva Contraseña</label><input id="new_password" x-model="password" type="password" class="${input}" autocomplete="new-password" /></div>
                                <div><label for="password_confirmation" class="${label}">Confirmar Contraseña</label><input id="password_confirmation" x-model="confirmation" type="password" class="${input}" autocomplete="new-password" /></div>
                                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1"><li x-text="error"></li></ul>
                                <div class="flex items-center gap-4">
                                    <button type="submit" :disabled="saving" class="${primary}">Guardar</button>
                                    <p x-show="saved" x-transition x-cloak class="text-sm text-[#20C997] font-medium">Guardado.</p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                ${isAdmin
                    ? html`<div class="p-6 bg-brand-surface border border-[#D83B52]/20 rounded-xl shadow-enterprise bg-[#D83B52]/[0.02]">
                        <div class="max-w-xl">
                            <section class="space-y-6" x-data="deleteAccount">
                                <header>
                                    <h2 class="text-lg font-medium text-brand-text-primary">Eliminar Cuenta</h2>
                                    <p class="mt-1 text-sm text-brand-text-muted">Una vez eliminada su cuenta, todos sus recursos y datos se eliminarán de forma permanente. Antes de eliminarla, descargue cualquier información que desee conservar.</p>
                                </header>
                                <button type="button" @click="show = true" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D83B52] hover:bg-[#C23348] active:bg-[#A82B3E] text-white text-xs font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D83B52]/50 transition-all duration-150">Eliminar Cuenta</button>
                                <div x-show="show" x-cloak class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50" @keydown.escape.window="show = false">
                                    <div class="fixed inset-0 transform transition-all" @click="show = false"><div class="absolute inset-0 bg-[#05070A]/80 backdrop-blur-sm"></div></div>
                                    <div class="mb-6 bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-enterprise-lg transform transition-all sm:w-full sm:max-w-2xl sm:mx-auto relative">
                                        <form @submit.prevent="submit()" class="p-6" autocomplete="off">
                                            <h2 class="text-lg font-medium text-brand-text-primary">¿Está seguro de que desea eliminar su cuenta?</h2>
                                            <p class="mt-1 text-sm text-brand-text-muted">Una vez eliminada su cuenta, todos sus recursos y datos se eliminarán de forma permanente. Ingrese su contraseña para confirmar.</p>
                                            <div class="mt-6">
                                                <input type="password" x-model="password" class="${input} w-3/4" placeholder="Contraseña" />
                                                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1 mt-2"><li x-text="error"></li></ul>
                                            </div>
                                            <div class="mt-6 flex justify-end">
                                                <button type="button" @click="show = false" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-surface-subtle hover:bg-brand-surface-hover border border-brand-border text-brand-text-secondary hover:text-brand-text-primary text-xs font-medium rounded-lg shadow-sm transition-all duration-150">Cancelar</button>
                                                <button type="submit" class="ms-3 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D83B52] hover:bg-[#C23348] text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-150">Eliminar Cuenta</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>`
                    : ''}
            </div>
        </div>`;
    },
};
