// Configuración en tiempo de ejecución.
// Las variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (GitHub Actions) tienen prioridad si existen.
// La clave publicable de Supabase es pública por diseño: la seguridad la aplican las reglas RLS.
// Nunca coloque aquí la clave secreta (sb_secret_...) ni la service_role.
window.GTS_CONFIG = window.GTS_CONFIG || {
    supabaseUrl: 'https://ejwsllzcxtgobuunmcxh.supabase.co',
    supabaseAnonKey: 'sb_publishable_FcHPFtSI_fg_qHuFs1TvbQ_dD-B_eZy',
};
