import { createClient } from '@supabase/supabase-js';
import { config, isConfigured } from '../config.js';

// "Recordarme": la sesión persiste en localStorage; si no, solo dura la pestaña (sessionStorage)
const REMEMBER_KEY = 'gts.remember';

const storage = {
    getItem(key) {
        try {
            return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem(key, value) {
        try {
            const remember = window.localStorage.getItem(REMEMBER_KEY) === '1';
            (remember ? window.localStorage : window.sessionStorage).setItem(key, value);
            (remember ? window.sessionStorage : window.localStorage).removeItem(key);
        } catch {
            // almacenamiento no disponible: la sesión vivirá solo en memoria
        }
    },
    removeItem(key) {
        try {
            window.localStorage.removeItem(key);
            window.sessionStorage.removeItem(key);
        } catch {
            // sin acción
        }
    },
};

export function setRemember(remember) {
    try {
        if (remember) {
            window.localStorage.setItem(REMEMBER_KEY, '1');
        } else {
            window.localStorage.removeItem(REMEMBER_KEY);
        }
    } catch {
        // sin acción
    }
}

export const supabase = isConfigured()
    ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
          auth: { storage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      })
    : null;
