// Pantalla mostrada cuando la app se publicó sin configurar Supabase
import { html } from '../../lib/html.js';

export default {
    name: 'setup',
    guest: true,
    async render() {
        return html`<div class="flex flex-col gap-4 text-xs text-[#8D98A8]">
            <div class="flex items-center gap-2 text-[#E2B24C] font-semibold text-sm">
                <span class="material-symbols-outlined text-[20px]">settings_alert</span>
                <span>Falta configurar la conexión a Supabase</span>
            </div>
            <p>La aplicación se publicó sin la URL ni la clave pública (<span class="font-mono">anon key</span>) del proyecto de Supabase.</p>
            <ol class="list-decimal list-inside space-y-1.5">
                <li>En GitHub, abra <strong class="text-[#F2F5F8]">Settings → Secrets and variables → Actions → Variables</strong>.</li>
                <li>Cree <span class="font-mono text-[#93C5FD]">SUPABASE_URL</span> y <span class="font-mono text-[#93C5FD]">SUPABASE_ANON_KEY</span> con los datos de <strong class="text-[#F2F5F8]">Project Settings → API</strong> de Supabase.</li>
                <li>Vuelva a ejecutar el flujo <strong class="text-[#F2F5F8]">Desplegar en GitHub Pages</strong> desde la pestaña Actions.</li>
            </ol>
            <p class="text-[11px] text-[#707B8A]">Alternativa: edite <span class="font-mono">config.js</span> en la raíz del sitio publicado.</p>
        </div>`;
    },
};
