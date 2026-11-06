// resources/views/incidents/create.blade.php (IncidentController@create / @store)
import Alpine from 'alpinejs';
import { html, cls } from '../../lib/html.js';
import * as auth from '../../lib/session.js';
import { navigate } from '../../lib/router.js';
import { flash } from '../../lib/flash.js';
import { toApiError } from '../../lib/api.js';
import { formatDate } from '../../lib/format.js';
import { create, createForm, MAX_FILES, MAX_BYTES } from '../../services/incidentService.js';

let defaultPriority = '';

// Precisión mínima aceptada para las coordenadas GPS y tiempo máximo para alcanzarla
const GPS_MAX_ACCURACY_M = 10;
const GPS_MAX_WAIT_MS = 45000;

Alpine.data('incidentCreateForm', () => ({
    form: { title: '', category_id: '', location: '', priority_id: defaultPriority, description: '' },
    errors: [],
    submitting: false,
    files: [],
    isDragging: false,
    errorMessage: '',

    locating: false,
    gpsProgress: '',
    gpsInfo: '',
    gpsError: '',
    gpsWatchId: null,
    gpsTimer: null,
    gpsBest: null,

    get charCount() {
        return this.form.description.length;
    },

    destroy() {
        this.stopLocating();
    },

    // Ubicación precisa del dispositivo (GPS) agregada al campo de ubicación.
    // La primera lectura suele venir de la red (decenas de metros); se sigue
    // escuchando al GPS hasta alcanzar GPS_MAX_ACCURACY_M o agotar GPS_MAX_WAIT_MS.
    useMyLocation() {
        this.gpsInfo = '';
        this.gpsError = '';
        if (!('geolocation' in navigator)) {
            this.gpsError = 'Este navegador no permite obtener la ubicación del dispositivo.';
            return;
        }
        if (!window.isSecureContext) {
            this.gpsError = 'La ubicación precisa solo está disponible en conexiones seguras (https).';
            return;
        }
        this.stopLocating();
        this.locating = true;
        this.gpsBest = null;
        this.gpsProgress = 'Buscando señal GPS…';

        this.gpsWatchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { accuracy } = pos.coords;
                if (!this.gpsBest || accuracy < this.gpsBest.coords.accuracy) this.gpsBest = pos;
                const best = Math.round(this.gpsBest.coords.accuracy);
                if (this.gpsBest.coords.accuracy <= GPS_MAX_ACCURACY_M) {
                    this.stopLocating();
                    this.applyCoordinates(this.gpsBest.coords);
                    return;
                }
                this.gpsProgress = `Afinando señal GPS… precisión actual ±${best} m (se requiere ±${GPS_MAX_ACCURACY_M} m o menos)`;
            },
            (err) => {
                this.stopLocating();
                this.gpsError =
                    {
                        1: 'Permiso de ubicación denegado. Habilítelo en la configuración del navegador para este sitio.',
                        2: 'No fue posible determinar la ubicación del dispositivo. Verifique que el GPS esté activo.',
                    }[err.code] ?? 'No fue posible obtener la ubicación del dispositivo.';
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );

        this.gpsTimer = setTimeout(() => {
            const best = this.gpsBest ? Math.round(this.gpsBest.coords.accuracy) : null;
            this.stopLocating();
            this.gpsError =
                (best === null
                    ? 'No se recibió señal GPS.'
                    : `No se alcanzó la precisión requerida de ±${GPS_MAX_ACCURACY_M} m (mejor lectura: ±${best} m).`) +
                ' Ubíquese en un área abierta o junto a una ventana, active la ubicación precisa del dispositivo e intente de nuevo.';
        }, GPS_MAX_WAIT_MS);
    },

    cancelLocating() {
        this.stopLocating();
    },

    stopLocating() {
        if (this.gpsWatchId !== null) navigator.geolocation.clearWatch(this.gpsWatchId);
        clearTimeout(this.gpsTimer);
        this.gpsWatchId = null;
        this.gpsTimer = null;
        this.locating = false;
        this.gpsProgress = '';
    },

    applyCoordinates({ latitude, longitude, accuracy }) {
        const meters = Math.max(1, Math.round(accuracy));
        const coords = `GPS ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${meters} m)`;
        const base = this.form.location.replace(/\s*·?\s*GPS -?\d+\.\d+, -?\d+\.\d+(?: \(±\d+ m\))?\s*$/, '').trim();
        this.form.location = (base ? `${base} · ${coords}` : coords).slice(0, 255);
        this.gpsInfo = `Ubicación capturada con una precisión de ±${meters} m.`;
    },

    handleFileSelect(event) {
        this.addFiles(event.target.files);
        event.target.value = '';
    },
    handleDrop(event) {
        this.isDragging = false;
        if (event.dataTransfer?.files) this.addFiles(event.dataTransfer.files);
    },
    addFiles(newFileList) {
        this.errorMessage = '';
        const allowed = ['png', 'jpg', 'jpeg', 'pdf', 'txt'];
        for (const file of Array.from(newFileList)) {
            if (this.files.length >= MAX_FILES) {
                this.errorMessage = `Límite alcanzado: solo se admiten hasta ${MAX_FILES} archivos de evidencia simultáneamente.`;
                break;
            }
            const ext = file.name.split('.').pop().toLowerCase();
            if (!allowed.includes(ext)) {
                this.errorMessage = `El archivo "${file.name}" no es válido. Solo se admiten formatos JPG, PNG, PDF o TXT.`;
                continue;
            }
            if (file.size > MAX_BYTES) {
                this.errorMessage = `El archivo "${file.name}" excede los 10 MB máximos permitidos.`;
                continue;
            }
            if (!this.files.some((f) => f.name === file.name && f.size === file.size)) {
                this.files.push(file);
            }
        }
    },
    removeFile(index) {
        this.files.splice(index, 1);
        this.errorMessage = '';
    },
    clearAll() {
        this.files = [];
        this.errorMessage = '';
    },
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    },
    getFileIcon(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg'].includes(ext)) return 'image';
        if (ext === 'pdf') return 'picture_as_pdf';
        if (ext === 'txt') return 'description';
        return 'attach_file';
    },
    getFileBadgeClass(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (['png', 'jpg', 'jpeg'].includes(ext)) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
        if (ext === 'pdf') return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    },

    async submit() {
        if (this.submitting) return;
        this.submitting = true;
        this.errors = [];
        try {
            const result = await create(this.form, this.files);
            flash('success', result.message);
            if (result.warning) flash('error', result.warning);
            navigate(`/incidencias/${result.folio}`);
        } catch (e) {
            this.errors = [toApiError(e).message];
            document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' });
            this.submitting = false;
        }
    },
}));

function channelLabel() {
    if (auth.isGts()) return 'Canal GTS Activo';
    if (auth.isApocCco()) return 'Canal APOC-CCO Activo';
    if (auth.isApocCsa()) return 'Canal APOC-CSA Activo';
    if (auth.isApoc()) return 'Canal APOC Activo';
    if (auth.isAdmin()) return 'Canal Administrador Activo';
    return `Canal ${auth.user()?.role?.name ?? 'Usuario'} Activo`;
}

const PRIORITY_COLORS = {
    baja: ['text-status-neutral', 'bg-status-neutral'],
    media: ['text-[#10B981]', 'bg-[#10B981]'],
    alta: ['text-status-warning', 'bg-status-warning'],
    critica: ['text-status-critical', 'bg-status-critical'],
};

export default {
    name: 'incidents.create',
    title: 'Nueva incidencia',
    async render() {
        const data = await createForm();
        defaultPriority = String(data.priorities.find((p) => p.slug === 'media')?.id ?? '');

        return html`<div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="incidentCreateForm">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs uppercase tracking-widest text-primary font-semibold">Módulo de Despacho Operativo</span>
                        <span class="text-outline text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium">GTS AIFA</span>
                    </div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Nueva Incidencia</h1>
                    <p class="text-sm text-on-surface-variant mt-1 max-w-2xl">Registro de reporte técnico para asignación y seguimiento inmediato del Grupo de Seguridad Tecnológica (GTS).</p>
                </div>
                <div class="flex items-center gap-2 self-start md:self-auto bg-surface-container-low px-4 py-2 rounded-xl border border-border-subtle shadow-sm">
                    <span class="w-2.5 h-2.5 rounded-full bg-status-resolved animate-pulse"></span>
                    <span class="text-xs text-on-surface uppercase tracking-wider font-semibold">${channelLabel()}</span>
                </div>
            </div>

            <div x-show="errors.length" x-cloak class="mb-6 p-4 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A]">
                <div class="flex items-center gap-2 font-semibold text-sm mb-1">
                    <span class="material-symbols-outlined text-[18px]">error</span>
                    <span>Se detectaron errores en el formulario:</span>
                </div>
                <ul class="list-disc list-inside text-xs space-y-0.5">
                    <template x-for="e in errors"><li x-text="e"></li></template>
                </ul>
            </div>

            <form @submit.prevent="submit()" class="flex flex-col gap-6" id="incidentForm" autocomplete="off">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div class="lg:col-span-8 flex flex-col gap-6">
                        <section class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-5">
                            <div class="flex items-center gap-2 pb-1">
                                <span class="material-symbols-outlined text-primary text-[22px]">info</span>
                                <h2 class="text-base font-semibold text-on-surface">Información de la Incidencia</h2>
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-medium text-on-surface flex items-center justify-between" for="title">
                                    <span>Título o Asunto del Problema <span class="text-status-critical">*</span></span>
                                    <span class="text-outline text-xs">Sintético y descriptivo</span>
                                </label>
                                <input x-model="form.title" class="w-full px-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner"
                                    id="title" placeholder="ej. Falla en lectura de tarjeta de acceso Puerta 14B" required autocomplete="off" type="text" maxlength="255" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-medium text-on-surface" for="category_id">Categoría / Subsistema <span class="text-status-critical">*</span></label>
                                    <div class="relative">
                                        <select x-model="form.category_id" id="category_id" required class="w-full appearance-none px-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-10 cursor-pointer">
                                            <option disabled value="">Seleccionar subsistema...</option>
                                            ${data.categories.map((c) => html`<option value="${c.id}">${c.name}</option>`)}
                                        </select>
                                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-medium text-on-surface" for="location">Ubicación / Área Afectada <span class="text-status-critical">*</span></label>
                                    <div class="relative">
                                        <input x-model="form.location" class="w-full px-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors pr-9"
                                            id="location" placeholder="ej. Terminal 1 - Nivel 2, Puerta 14B" required autocomplete="off" type="text" maxlength="255" />
                                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">location_on</span>
                                    </div>
                                    <div class="flex items-center justify-end gap-2 flex-wrap mt-1">
                                        <span class="text-[11px] text-outline flex items-center gap-1">
                                            Si desea utilizar su ubicación precisa, presione el botón
                                            <span class="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
                                        </span>
                                        <button type="button" @click="useMyLocation()" :disabled="locating"
                                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold rounded-lg border border-border-subtle hover:border-primary/40 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-wait"
                                            title="Agregar la ubicación GPS actual de este dispositivo">
                                            <span x-show="locating" x-cloak class="gts-spinner text-[14px]" aria-hidden="true"></span>
                                            <span x-show="!locating" class="material-symbols-outlined text-[16px]">my_location</span>
                                            <span x-text="locating ? 'Obteniendo ubicación…' : 'Usar mi ubicación'">Usar mi ubicación</span>
                                        </button>
                                    </div>
                                    <p x-show="locating" x-cloak class="text-[11px] text-status-warning flex items-center gap-1.5 justify-end text-right">
                                        <span x-text="gpsProgress"></span>
                                        <button type="button" @click="cancelLocating()" class="underline hover:text-on-surface shrink-0">Cancelar</button>
                                    </p>
                                    <p x-show="gpsInfo" x-cloak class="text-[11px] text-status-resolved flex items-center gap-1 justify-end">
                                        <span class="material-symbols-outlined text-[14px]">check_circle</span><span x-text="gpsInfo"></span>
                                    </p>
                                    <p x-show="gpsError" x-cloak class="text-[11px] text-[#E66A7A] flex items-start gap-1 justify-end text-right">
                                        <span class="material-symbols-outlined text-[14px]">error</span><span x-text="gpsError"></span>
                                    </p>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2 pt-1">
                                <label class="text-xs font-medium text-on-surface flex items-center justify-between flex-wrap gap-2">
                                    <span>Prioridad Sugerida <span class="text-status-critical">*</span></span>
                                    <span class="text-outline text-xs">Seleccione el nivel de severidad</span>
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                                    ${data.priorities.map((p) => {
                                        const [text, dot] = PRIORITY_COLORS[p.slug] ?? ['text-primary', 'bg-primary'];
                                        return html`<label class="group relative flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle hover:border-border-active transition-all cursor-pointer has-[:checked]:bg-surface-overlay has-[:checked]:border-primary/50 shadow-sm">
                                            <input class="sr-only peer" x-model="form.priority_id" name="priority_id" type="radio" value="${p.id}" />
                                            <div class="flex items-center justify-between">
                                                <span class="${cls('text-xs font-semibold flex items-center gap-1.5', text)}">
                                                    <span class="${cls('w-2 h-2 rounded-full inline-block', dot, p.slug === 'critica' && 'animate-ping')}"></span>
                                                    ${p.name}
                                                </span>
                                                <span class="material-symbols-outlined text-[16px] text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                                            </div>
                                        </label>`;
                                    })}
                                </div>
                            </div>
                        </section>

                        <section class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-3">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-[22px]">subject</span>
                                    <h2 class="text-base font-semibold text-on-surface">Descripción del Evento</h2>
                                </div>
                                <span class="text-xs text-outline font-mono" :class="charCount > 2800 ? 'text-status-warning' : ''" x-text="charCount + ' / 3000'">0 / 3000</span>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <textarea x-model="form.description" class="w-full p-4 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner resize-y leading-relaxed"
                                    id="incident_description" placeholder="Describa detalladamente el síntoma observado, mensajes de error o comportamiento anómalo en el equipo..." required rows="5" maxlength="3000"></textarea>
                                <span class="text-xs text-outline px-1">Incluya números de serie de dispositivos o códigos en pantalla si están disponibles.</span>
                            </div>
                        </section>

                        <section class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-[22px]">attach_file</span>
                                    <h2 class="text-base font-semibold text-on-surface">Evidencia o Adjuntos</h2>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span x-show="files.length > 0" x-cloak class="text-xs px-2.5 py-0.5 rounded bg-primary/20 text-primary font-mono font-medium border border-primary/30">
                                        <span x-text="files.length"></span> / 5 seleccionados
                                    </span>
                                    <span class="text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant border border-border-subtle">Opcional</span>
                                </div>
                            </div>

                            <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop($event)" @click="$refs.fileInput.click()"
                                :class="isDragging ? 'border-primary bg-primary/10 ring-2 ring-primary/40' : 'border-border-subtle hover:border-border-active bg-surface-container-low hover:bg-surface-container'"
                                class="relative border rounded-xl p-6 sm:p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-inner group">
                                <input type="file" x-ref="fileInput" id="attachments" multiple accept=".png,.jpg,.jpeg,.pdf,.txt" @change="handleFileSelect($event)" @click.stop class="sr-only" />
                                <div class="w-12 h-12 rounded-xl bg-surface-container-high border border-border-active flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform shadow-sm pointer-events-none">
                                    <span class="material-symbols-outlined text-[26px]">cloud_upload</span>
                                </div>
                                <p class="text-sm font-medium text-on-surface pointer-events-none">Arrastra y suelta capturas de error, bitácoras o documentos</p>
                                <p class="text-xs text-outline mt-1 pointer-events-none">Formatos admitidos: PNG, JPG, PDF o TXT (Máximo 10 MB por archivo, hasta 5 archivos)</p>
                                <button type="button" class="mt-3 px-3.5 py-1.5 bg-surface-card border border-border-subtle rounded-lg text-primary text-xs font-semibold group-hover:bg-primary group-hover:text-on-primary transition-colors pointer-events-none">Explorar archivos locales</button>
                            </div>

                            <div x-show="errorMessage" x-cloak class="p-3 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A] text-xs flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                                <span x-text="errorMessage"></span>
                            </div>

                            <template x-if="files.length > 0">
                                <div class="flex flex-col gap-2 pt-1">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-outline">Evidencias preparadas (<span x-text="files.length"></span>)</span>
                                        <button type="button" @click="clearAll()" class="text-xs text-outline hover:text-[#E66A7A] transition-colors">Quitar todas</button>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <template x-for="(file, index) in files" :key="index + '-' + file.name">
                                            <div class="p-3 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between gap-3 shadow-sm hover:border-border-active transition-colors">
                                                <div class="flex items-center gap-2.5 min-w-0">
                                                    <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border" :class="getFileBadgeClass(file)">
                                                        <span class="material-symbols-outlined text-[20px]" x-text="getFileIcon(file)"></span>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-xs font-mono font-medium text-on-surface truncate" x-text="file.name" :title="file.name"></span>
                                                        <span class="text-[11px] font-mono text-outline" x-text="formatBytes(file.size)"></span>
                                                    </div>
                                                </div>
                                                <button type="button" @click.stop="removeFile(index)" class="p-1.5 rounded-lg text-outline hover:text-[#E66A7A] hover:bg-status-critical/10 transition-colors shrink-0" title="Quitar archivo">
                                                    <span class="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </section>
                    </div>

                    <div class="lg:col-span-4 flex flex-col gap-6">
                        <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center gap-2 pb-1">
                                <span class="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
                                <h3 class="text-base font-semibold text-on-surface">Datos de Control</h3>
                            </div>
                            <p class="text-xs text-on-surface-variant -mt-2">Valores inmutables de auditoría generados por el motor de telemetría aeroportuaria.</p>
                            <div class="flex flex-col gap-3 pt-2">
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Folio Preliminar Asignado</span>
                                    <div class="flex items-center justify-between mt-1">
                                        <span class="font-mono text-base font-bold text-primary tracking-wider">${data.preliminary_folio}</span>
                                        <span class="text-xs px-2 py-0.5 rounded bg-surface-overlay text-on-surface-variant font-mono border border-border-subtle">AUTOGÉN</span>
                                    </div>
                                </div>
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Fecha / Hora de Registro</span>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="material-symbols-outlined text-outline text-[16px]">schedule</span>
                                        <span class="text-xs text-on-surface font-medium">${formatDate(new Date(), 'Y-m-d • H:i:s')} hrs</span>
                                    </div>
                                </div>
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Operador Responsable</span>
                                    <div class="flex items-center gap-2.5 mt-2">
                                        <div class="w-8 h-8 rounded-full bg-surface-container-high border border-border-active flex items-center justify-center text-primary font-semibold flex-shrink-0">
                                            <span class="material-symbols-outlined text-[18px]">terminal</span>
                                        </div>
                                        <div class="flex flex-col min-w-0">
                                            <span class="text-xs font-semibold text-on-surface truncate">${auth.user()?.name}</span>
                                            <span class="text-xs text-on-surface-variant truncate">${auth.user()?.role?.name ?? 'APOC'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Despacho Automático: GTS</span>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                                        <span class="text-xs text-on-surface font-medium">GTS</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-surface-card border border-border-subtle p-5 rounded-xl shadow-sm flex flex-col gap-2.5">
                            <div class="flex items-center gap-2 text-primary">
                                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                                <span class="text-xs font-semibold tracking-wide uppercase font-mono">Protocolo GTS AIFA</span>
                            </div>
                            <p class="text-xs text-on-surface-variant leading-relaxed">Una vez remitida, la incidencia se encola de forma síncrona en el tablero de radiodespacho y se genera la bitácora criptográfica de trazabilidad en base de datos.</p>
                            <div class="flex items-center gap-2 pt-1 text-outline text-xs">
                                <span class="material-symbols-outlined text-[14px]">call</span>
                                <span>Soporte 55-57-98-98-00 Ext. 13202</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sticky bottom-4 z-30 bg-surface-subtle/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-border-subtle shadow-xl flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-2">
                    <div class="flex items-center gap-2 text-outline text-xs">
                        <span class="material-symbols-outlined text-[18px]">lock</span>
                        <span>Transmisión protegida por TLS 1.3 interna AIFA</span>
                    </div>
                    <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button class="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-surface-container-high border border-border-subtle hover:bg-surface-overlay text-on-surface text-sm font-medium transition-colors flex items-center justify-center gap-2" onclick="history.back()" type="button">
                            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Cancelar</span>
                        </button>
                        <button :disabled="submitting" :class="submitting ? 'opacity-75 cursor-not-allowed pointer-events-none' : ''"
                            class="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer" id="btnSubmit" type="submit">
                            <span x-show="submitting" x-cloak class="gts-spinner text-[16px]" aria-hidden="true"></span>
                            <span x-show="!submitting" class="material-symbols-outlined text-[18px]">send</span>
                            <span x-text="submitting ? 'Despachando a GTS...' : 'Crear Incidencia'">Crear Incidencia</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>`;
    },
};
