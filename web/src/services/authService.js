// Autenticación (AuthenticatedSessionController + LoginRequest) sobre Supabase Auth
import { supabase, setRemember } from '../lib/supabase.js';
import { rpc, ApiError } from '../lib/api.js';
import { setSession, clearSession } from '../lib/session.js';
import { config } from '../config.js';

export const INACTIVE_MESSAGE = 'Su cuenta institucional se encuentra inactiva. Contacte al Administrador.';

export const usernameToEmail = (username) => `${String(username || '').trim().toLowerCase()}@${config.authEmailDomain}`;

// Carga el perfil operativo, permisos y alcances del usuario autenticado
export async function bootstrap() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
        clearSession();
        return null;
    }

    const boot = await rpc('app_bootstrap');
    if (!boot) {
        await supabase.auth.signOut();
        clearSession();
        throw new ApiError('La cuenta no tiene un perfil operativo asignado. Contacte al Administrador.', 403);
    }
    if (!boot.user?.is_active) {
        await supabase.auth.signOut();
        clearSession();
        throw new ApiError(INACTIVE_MESSAGE, 403);
    }

    setSession(boot);
    return boot;
}

export async function login(username, password, remember) {
    if (!String(username || '').trim()) {
        throw new ApiError('El campo usuario es obligatorio.');
    }
    if (!password) {
        throw new ApiError('El campo contraseña es obligatorio.');
    }

    setRemember(Boolean(remember));
    const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });

    if (error) {
        const msg = String(error.message || '');
        if (/banned/i.test(msg) || error.code === 'user_banned') {
            throw new ApiError(INACTIVE_MESSAGE, 403);
        }
        if (error.status === 429 || /rate limit|too many/i.test(msg)) {
            throw new ApiError('Demasiados intentos de acceso. Por favor intente de nuevo en unos minutos.', 429);
        }
        throw new ApiError('Estas credenciales no coinciden con nuestros registros.', 422);
    }

    return bootstrap();
}

export async function logout() {
    await supabase.auth.signOut();
    clearSession();
}
