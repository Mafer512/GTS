// Configuración en tiempo de ejecución (opcional).
// Si la app se compiló con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (GitHub Actions),
// no es necesario llenar este archivo. Útil para publicar sin recompilar.
// La "anon key" de Supabase es pública por diseño: la seguridad la aplican las reglas RLS.
window.GTS_CONFIG = window.GTS_CONFIG || {
    supabaseUrl: '',
    supabaseAnonKey: '',
};
