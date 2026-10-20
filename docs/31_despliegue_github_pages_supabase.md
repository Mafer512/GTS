# PASO 31: VERSIÓN WEB SIN PHP — GITHUB PAGES + SUPABASE

## 1. Qué cambió

GTS ahora se puede publicar como **aplicación web estática** en GitHub Pages, sin servidor PHP.
La lógica de negocio que vivía en Laravel se trasladó a **PostgreSQL de Supabase**:

| Laravel (PHP) | Versión web |
|---|---|
| `database/migrations`, `database/seeders` | `supabase/migrations/*.sql`, `supabase/seed.sql` |
| `app/Services/*` (IncidentService, NotificationService, FolioGeneratorService, ReportService…) | Funciones SQL (RPC) en `supabase/migrations/…_incident_service.sql`, `…_read_api.sql`, `…_admin_api.sql` |
| `app/Policies/*`, permisos y alcances inter-rol | Funciones `user_*` / `incident_abilities` + reglas RLS (`…_authorization.sql`, `…_security.sql`) |
| `app/Http/Requests/*` (validaciones) | Validaciones dentro de cada RPC, con los mismos mensajes |
| Controladores y rutas | Una RPC por acción + enrutador `web/src/lib/router.js` (`#/incidencias/…`) |
| Vistas Blade + Tailwind + Alpine | `web/src/views/**` (mismas clases Tailwind, mismo diseño) |
| `app/Models/*` (atributos de presentación) | `web/src/models/*` |
| Disco privado `storage/app/private` | Supabase Storage, bucket privado `evidencias` |
| Sesión Laravel / login por usuario | Supabase Auth; el usuario `admin` inicia sesión internamente como `admin@gts.local` |

La aplicación Laravel original se conserva en el repositorio como referencia; la versión publicable vive en `web/` y `supabase/`.

## 2. Publicar (una sola vez)

### 2.1 Supabase

1. Cree un proyecto en <https://supabase.com> (región sugerida: la más cercana a México).
2. **Authentication → Sign In / Providers → Email**: desactive *Allow new users to sign up*. Las cuentas solo las crea el Administrador desde la app.
3. Abra `supabase/instalar.sql`, **cambie la contraseña inicial** (busque `CONTRASEÑA INICIAL`), péguelo completo en **SQL Editor → New query** y presione **Run**.
   Crea tablas, reglas de seguridad, funciones, bucket de evidencias, catálogos y las cuentas `admin`, `apoc`, `gts.morales` y `gts.mendoza`.
4. En **Project Settings → API** copie la **Project URL** y la **anon / publishable key**. Esa clave es pública por diseño; la seguridad la aplican las reglas RLS.

### 2.2 GitHub

1. **Settings → Secrets and variables → Actions → Variables → New repository variable**:
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_ANON_KEY` = anon / publishable key
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Actions → Desplegar en GitHub Pages → Run workflow**. Cada `push` a `main` que toque `web/` vuelve a publicar.
4. La app queda en `https://<usuario>.github.io/<repositorio>/` (para este repo: `https://mafer512.github.io/GTS/`).

### 2.3 Primer acceso

Entre con `admin` y la contraseña que definió, cambie su contraseña en **Configuración → Mi Cuenta** y dé de alta al personal real en **Gestión de Usuarios y Cuadrillas**.

## 3. Desarrollo local

```bash
cd web
cp .env.example .env      # y llene VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm install
npm run dev               # http://localhost:5173
npm run build             # genera web/dist
```

## 4. Diferencias respecto a la versión PHP

- **PDF institucional:** se genera con el diálogo de impresión del navegador (*Guardar como PDF*), con la misma plantilla de una ficha por página.
- **Correo:** abre el cliente de correo del usuario con el resumen ejecutivo; el PDF se adjunta manualmente (un sitio estático no puede enviar correos).
- **WhatsApp:** usa el enlace oficial `api.whatsapp.com/send` (modo enlace del sistema original). El envío por WhatsApp Cloud API requeriría una Edge Function con el token.
- **Recuperación de contraseña por correo y registro público:** no se incluyen; el Administrador restablece contraseñas desde Gestión de Usuarios.
- **Seguridad:** toda escritura pasa por funciones del servidor con validación de permisos; las tablas no aceptan escrituras directas y la bitácora es inmutable (trigger).

## 5. Solución de problemas

- *La app muestra "Falta configurar la conexión a Supabase"*: faltan las variables `SUPABASE_URL` / `SUPABASE_ANON_KEY` o el flujo no se volvió a ejecutar.
- *Error `permission denied for table users` al ejecutar `instalar.sql`*: su proyecto restringe la escritura en el esquema `auth`. Cree las cuentas en **Authentication → Users → Add user** con correo `<usuario>@gts.local` y avise al equipo técnico para vincularlas.
- *"Estas credenciales no coinciden"*: el login es por **usuario** (no por correo); verifique mayúsculas y la contraseña definida en el instalador.
