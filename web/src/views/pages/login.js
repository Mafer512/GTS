// resources/views/auth/login.blade.php
import Alpine from 'alpinejs';
import { html } from '../../lib/html.js';
import { takeFlash } from '../../lib/flash.js';
import { navigate } from '../../lib/router.js';
import { isAuthenticated } from '../../lib/session.js';
import { login } from '../../services/authService.js';
import { toApiError } from '../../lib/api.js';

let initialError = null;

Alpine.data('loginForm', () => ({
    username: '',
    password: '',
    remember: false,
    error: initialError,
    submitting: false,
    async submit() {
        if (this.submitting) return;
        this.submitting = true;
        this.error = null;
        try {
            await login(this.username, this.password, this.remember);
            navigate('/dashboard');
        } catch (e) {
            this.error = toApiError(e).message;
            this.password = '';
        } finally {
            this.submitting = false;
        }
    },
}));

export default {
    name: 'login',
    title: 'Iniciar sesión',
    guest: true,
    async render() {
        if (isAuthenticated()) {
            navigate('/dashboard');
            return html``;
        }
        initialError = takeFlash().login_error ?? null;

        return html`<form x-data="loginForm" @submit.prevent="submit()">
            <div>
                <label for="username" class="block font-medium text-xs text-brand-text-secondary uppercase tracking-wider mb-1.5">Usuario</label>
                <input id="username" x-model="username" class="bg-brand-surface-subtle border border-brand-border text-brand-text-primary placeholder:text-brand-text-muted focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-lg shadow-sm text-sm px-3 py-2 transition-colors outline-none block mt-1 w-full"
                    type="text" name="username" required autofocus autocomplete="username" placeholder="ej. admin o gts.mendoza" />
                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1 mt-2"><li x-text="error"></li></ul>
            </div>

            <div class="mt-4">
                <label for="password" class="block font-medium text-xs text-brand-text-secondary uppercase tracking-wider mb-1.5">Contraseña</label>
                <input id="password" x-model="password" class="bg-brand-surface-subtle border border-brand-border text-brand-text-primary placeholder:text-brand-text-muted focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-lg shadow-sm text-sm px-3 py-2 transition-colors outline-none block mt-1 w-full"
                    type="password" name="password" required autocomplete="current-password" placeholder="••••••••" />
            </div>

            <div class="block mt-4">
                <label for="remember_me" class="inline-flex items-center">
                    <input id="remember_me" x-model="remember" type="checkbox" class="rounded bg-[#0A0D12] border-[#252C35] text-[#123A70] shadow-sm focus:ring-[#164A8A] focus:ring-offset-[#0A0D12]" name="remember">
                    <span class="ms-2 text-xs text-brand-text-muted">Recordarme</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                <button type="submit" :disabled="submitting" class="ms-3 inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white text-xs font-semibold rounded-lg shadow-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#164A8A] transition-all duration-150 disabled:opacity-60">
                    <span x-show="submitting" x-cloak class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    <span x-text="submitting ? 'Verificando…' : 'Iniciar sesión'">Iniciar sesión</span>
                </button>
            </div>
        </form>`;
    },
};
