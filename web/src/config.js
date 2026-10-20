// Configuración de la aplicación (equivalente a config/app.php + .env)
const runtime = window.GTS_CONFIG || {};

export const config = {
    appName: 'GTS - Grupo de Seguridad Tecnológica AIFA',
    timezone: 'America/Mexico_City',
    locale: 'es-MX',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || runtime.supabaseUrl || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || runtime.supabaseAnonKey || '',
    // Dominio interno para traducir "usuario" → correo de Supabase Auth
    authEmailDomain: 'gts.local',
    evidenceBucket: 'evidencias',
};

export const isConfigured = () => Boolean(config.supabaseUrl && config.supabaseAnonKey);
