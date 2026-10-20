// resources/views/incidents/show.blade.php (IncidentController@show y acciones del expediente)
import Alpine from 'alpinejs';
import { html, cls, js } from '../../lib/html.js';
import * as auth from '../../lib/session.js';
import * as gates from '../../policies/gates.js';
import { reload } from '../../lib/router.js';
import { flash, takeFlash } from '../../lib/flash.js';
import { toApiError } from '../../lib/api.js';
import { formatDate } from '../../lib/format.js';
import * as incidents from '../../services/incidentService.js';
import { badgePriority } from '../components/ui.js';
import {
    isFromCco,
    isFromCsa,
    originBadge,
    statusPillClasses,
    areaBadgeClasses,
    areaLabel,
    isImage,
    formattedSize,
    fileIcon,
    fileBadgeColor,
} from '../../models/incident.js';

let page = null;

const scrollTop = () => document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' });

async function run(component, action, closeFlag = null) {
    if (component.busy) return;
    component.busy = true;
    component.pageError = '';
    try {
        const result = await action();
        flash('success', result?.message ?? 'Operación realizada exitosamente.');
        if (closeFlag) component[closeFlag] = false;
        reload();
    } catch (e) {
        component.pageError = toApiError(e).message;
        component.busy = false;
        if (!closeFlag) scrollTop();
    }
}

Alpine.data('incidentShowPage', () => ({
    showAssignModal: false,
    showResolveModal: false,
    showRejectModal: false,
    showCloseModal: false,
    showUploadModal: false,
    busy: false,
    pageError: '',
    note: '',
    solution: '',
    rejection: '',
    closeComment: '',

    take() {
        return run(this, () => incidents.take(page.id, auth.user().id));
    },
    startAttention() {
        return run(this, () => incidents.startAttention(page.id));
    },
    addNote() {
        return run(this, () => incidents.addNote(page.id, this.note));
    },
    resolve() {
        return run(this, () => incidents.resolve(page.id, this.solution), 'showResolveModal');
    },
    reject() {
        return run(this, () => incidents.rejectResolution(page.id, this.rejection), 'showRejectModal');
    },
    closeIncident() {
        return run(this, () => incidents.close(page.id, this.closeComment), 'showCloseModal');
    },
    upload() {
        const files = this.$refs.uploadInput?.files ?? [];
        return run(this, () => incidents.uploadAttachments(page.id, files, 'upload'), 'showUploadModal');
    },
    async download(path, filename) {
        try {
            window.location.href = await incidents.downloadUrl(path, filename);
        } catch (e) {
            this.pageError = toApiError(e).message;
            scrollTop();
        }
    },
}));

Alpine.data('assignModal', () => ({
    allAreas: page.assign.areas,
    allTechnicians: page.assign.technicians,
    selectedAreas: [...page.assign.initialAreas],
    selectedUserId: page.assign.initialUserId,
    areaToAdd: '',
    isSubmitting: false,
    errorMessage: '',
    comment: '',

    get filteredTechnicians() {
        if (this.selectedAreas.length === 0) return [];
        const selected = this.selectedAreas.map((a) => a.toLowerCase());
        return this.allTechnicians.filter((t) => selected.includes(t.role_slug));
    },
    get unselectedAreas() {
        const selected = this.selectedAreas.map((a) => a.toLowerCase());
        return this.allAreas.filter((a) => !selected.includes(a.code.toLowerCase()));
    },
    addArea(code) {
        if (!code) return;
        const clean = code.toLowerCase();
        if (!this.selectedAreas.map((a) => a.toLowerCase()).includes(clean)) {
            this.selectedAreas.push(clean);
        }
        this.areaToAdd = '';
        this.errorMessage = '';
    },
    removeArea(code) {
        const clean = code.toLowerCase();
        this.selectedAreas = this.selectedAreas.filter((a) => a.toLowerCase() !== clean);
        this.validateSelectedUser();
        this.errorMessage = '';
    },
    validateSelectedUser() {
        if (this.selectedUserId && !this.filteredTechnicians.some((t) => String(t.id) === String(this.selectedUserId))) {
            this.selectedUserId = '';
        }
    },
    getAreaMeta(code) {
        const clean = code.toLowerCase();
        return (
            this.allAreas.find((a) => a.code.toLowerCase() === clean) || {
                code,
                name: code.toUpperCase(),
                badge_bg: 'bg-surface-container-high',
                badge_text: 'text-on-surface',
                badge_border: 'border-border-subtle',
            }
        );
    },
    async submitAssignment() {
        if (this.selectedAreas.length === 0 || this.isSubmitting) return;
        this.isSubmitting = true;
        this.errorMessage = '';
        try {
            const result = await incidents.assign(page.id, this.selectedAreas, this.selectedUserId || null, this.comment);
            flash('success', result.message);
            reload();
        } catch (e) {
            this.errorMessage = toApiError(e).message;
            this.isSubmitting = false;
        }
    },
}));

function stepper(inc) {
    const s = inc.status.step_order;
    const step = (n, label, date, pending, ringClass) => {
        const done = s > n;
        const active = s === n;
        return html`<div class="${cls('p-3 rounded-lg flex items-center gap-3', s >= n ? 'bg-surface-container-low border border-border-subtle' : 'opacity-40')}">
            <div class="${cls('w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs', done ? 'bg-status-resolved/20 text-status-resolved' : active ? ringClass : 'bg-surface-container-high text-outline')}">
                ${done ? html`<span class="material-symbols-outlined text-[18px]">check</span>` : n}
            </div>
            <div class="flex flex-col min-w-0">
                <span class="font-semibold text-xs text-on-surface">${n}. ${label}</span>
                <span class="text-[10px] text-outline truncate font-mono">${date ? formatDate(date, 'd M H:i') : pending}</span>
            </div>
        </div>`;
    };
    return html`<div class="bg-surface-subtle border border-border-subtle p-4 rounded-xl shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4">
            ${step(1, 'Nueva', inc.reported_at, 'Pendiente', 'bg-[#123A70]/30 text-[#3D82C6] ring-2 ring-[#164A8A]/40')}
            ${step(2, 'Asignada', inc.assigned_at, s >= 2 ? 'En espera' : 'Pendiente', 'bg-purple-500/20 text-purple-400 ring-2 ring-purple-500/30')}
            ${step(3, 'En Atención', inc.attended_at, 'Pendiente', 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/30')}
            ${step(4, 'Resuelta', inc.resolved_at, 'Pendiente', 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30')}
            <div class="${cls('p-3 rounded-lg flex items-center gap-3', s === 5 ? 'bg-surface-container-low border border-primary/30' : 'opacity-40')}">
                <div class="${cls('w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs', s === 5 ? 'bg-primary/20 text-primary ring-2 ring-primary/40' : 'bg-surface-container-high text-outline')}">
                    ${s === 5 ? html`<span class="material-symbols-outlined text-[18px]">verified</span>` : '5'}
                </div>
                <div class="flex flex-col min-w-0">
                    <span class="font-semibold text-xs text-on-surface">5. Cerrada</span>
                    <span class="text-[10px] text-outline truncate font-mono">${inc.closed_at ? formatDate(inc.closed_at, 'd M H:i') : 'Pendiente'}</span>
                </div>
            </div>
        </div>
    </div>`;
}

const HISTORY_DOT = {
    NOTA_TECNICA: 'border-amber-400 bg-amber-400/30',
    RESUELTA: 'border-emerald-400 bg-emerald-400/30',
    RECHAZO_SOLUCION: 'border-rose-500 bg-rose-500/30',
    CERRADA: 'border-primary bg-primary/30',
    CAMBIO_ESTADO: 'border-[#3D82C6]',
};

const HISTORY_TAG = {
    NOTA_TECNICA: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    RESUELTA: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    RECHAZO_SOLUCION: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    CERRADA: 'bg-primary/15 text-primary border border-primary/30',
    CAMBIO_ESTADO: 'bg-[rgba(61,130,198,0.15)] text-[#6FA2D2] border border-[rgba(61,130,198,0.30)]',
    ASIGNADA: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    REASIGNADA: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
};

function historyBody(h) {
    const box = (bg, border, color, icon, title) => html`<div class="${cls('p-3.5 rounded-xl border text-xs text-on-surface leading-relaxed mt-1', bg, border)}">
        <div class="${cls('flex items-center gap-1.5 font-semibold text-[11px] mb-1', color)}">
            <span class="material-symbols-outlined text-[15px]">${icon}</span>
            <span>${title}</span>
        </div>
        <p class="whitespace-pre-line text-on-surface-variant font-sans">${h.comment}</p>
    </div>`;

    switch (h.action) {
        case 'NOTA_TECNICA':
            return box('bg-amber-500/5', 'border-amber-500/20', 'text-amber-400', 'engineering', 'Avance / Diagnóstico Técnico:');
        case 'RESUELTA':
            return box('bg-emerald-500/5', 'border-emerald-500/20', 'text-emerald-400', 'task_alt', 'Solución Técnica Certificada por GTS:');
        case 'RECHAZO_SOLUCION':
            return box('bg-rose-500/5', 'border-rose-500/20', 'text-rose-400', 'cancel', 'Motivo de Rechazo por APOC:');
        case 'CERRADA':
            return box('bg-primary/5', 'border-primary/20', 'text-primary', 'verified', `Conformidad Operacional y Cierre Formal (${h.user ? h.user.role_tag : 'VoBo'}):`);
        default:
            return h.comment
                ? html`<p class="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border border-border-subtle mt-1 font-sans">${h.comment}</p>`
                : '';
    }
}

function modalShell(flag, icon, iconClass, title, body, maxWidth = 'max-w-lg', overlay = 'bg-surface-base/80') {
    return html`<div x-show="${flag}" x-cloak class="${cls('fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm', overlay)}" @keydown.escape.window="${flag} = false">
        <div class="${cls('bg-surface-subtle border border-border-subtle w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[92vh] overflow-y-auto', maxWidth)}" @click.outside="${flag} = false">
            <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div class="flex items-center gap-2">
                    <span class="${cls('material-symbols-outlined text-[22px]', iconClass)}">${icon}</span>
                    <h3 class="text-base font-bold text-on-surface">${title}</h3>
                </div>
                <button type="button" @click="${flag} = false" class="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>
            <div x-show="pageError" x-cloak class="p-3 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A] text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span x-text="pageError"></span>
            </div>
            ${body}
        </div>
    </div>`;
}

function assignModal(inc) {
    const reassign = Boolean(inc.assigned_to || inc.assigned_areas.length);
    return html`<div x-show="showAssignModal" x-cloak x-data="assignModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-sm" @keydown.escape.window="showAssignModal = false">
        <div class="bg-surface-subtle border border-border-subtle w-full max-w-xl rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[92vh] overflow-y-auto" @click.outside="showAssignModal = false">
            <div class="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-[24px]">device_hub</span>
                    <div>
                        <h3 class="text-base font-bold text-on-surface">${reassign ? 'Reasignar Especialista y Áreas' : 'Asignar Especialista y Áreas'}</h3>
                        <p class="text-[11px] text-outline">Gestione las áreas responsables y asigne opcionalmente un especialista técnico.</p>
                    </div>
                </div>
                <button type="button" @click="showAssignModal = false" class="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <form class="flex flex-col gap-4" @submit.prevent="submitAssignment()">
                <div x-show="errorMessage" x-cloak class="p-3 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A] text-xs flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                    <span x-text="errorMessage"></span>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-xs font-semibold text-on-surface flex items-center justify-between">
                        <span class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-primary">domain</span>
                            <span>1. Área Responsable <span class="text-status-critical">*</span></span>
                        </span>
                        <span class="text-[11px] text-outline font-normal">Seleccionadas: <strong class="text-primary font-mono" x-text="selectedAreas.length"></strong></span>
                    </label>
                    <div class="min-h-[46px] p-2.5 bg-surface-container-low border border-border-subtle rounded-xl flex flex-wrap items-center gap-2">
                        <template x-for="code in selectedAreas" :key="code">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" :class="getAreaMeta(code).badge_bg + ' ' + getAreaMeta(code).badge_text + ' ' + getAreaMeta(code).badge_border">
                                <span class="font-mono text-[11px]" x-text="getAreaMeta(code).name"></span>
                                <button type="button" @click="removeArea(code)" title="Retirar área" class="hover:opacity-75 transition-opacity ml-1 p-0.5 rounded-full hover:bg-black/20 text-current flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[13px] leading-none">close</span>
                                </button>
                            </span>
                        </template>
                        <template x-if="selectedAreas.length === 0">
                            <span class="text-outline text-xs italic flex items-center gap-1.5 px-1">
                                <span class="material-symbols-outlined text-[16px]">info</span>
                                Ninguna área seleccionada. Elija al menos un área responsable.
                            </span>
                        </template>
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                        <div class="relative flex-1">
                            <select x-model="areaToAdd" @change="addArea(areaToAdd)" :disabled="unselectedAreas.length === 0"
                                class="w-full bg-none appearance-none px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-9 cursor-pointer shadow-inner disabled:opacity-60 disabled:cursor-not-allowed">
                                <option value="" x-text="unselectedAreas.length === 0 ? 'Todas las áreas autorizadas ya han sido agregadas' : '-- Seleccionar área para agregar --'"></option>
                                <template x-for="area in unselectedAreas" :key="area.code">
                                    <option :value="area.code" x-text="area.name"></option>
                                </template>
                            </select>
                            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none select-none">expand_more</span>
                        </div>
                    </div>
                    <template x-if="allAreas.length === 0">
                        <p class="text-[11px] text-status-critical flex items-center gap-1 mt-1">
                            <span class="material-symbols-outlined text-[14px]">warning</span>
                            No tiene destinos de asignación autorizados según su rol y alcances operativos.
                        </p>
                    </template>
                </div>

                <div class="flex flex-col gap-1.5 pt-1">
                    <label for="modal_assigned_to_user_id" class="text-xs font-semibold text-on-surface flex items-center justify-between">
                        <span class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-primary">person</span>
                            <span>2. Usuario Responsable <span class="text-outline font-normal">(Opcional)</span></span>
                        </span>
                        <span class="text-[11px] text-outline font-normal">Compatibles: <strong class="text-primary font-mono" x-text="filteredTechnicians.length"></strong></span>
                    </label>
                    <div class="relative">
                        <select id="modal_assigned_to_user_id" x-model="selectedUserId" :disabled="filteredTechnicians.length === 0 || selectedAreas.length === 0"
                            class="w-full bg-none appearance-none px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-9 cursor-pointer shadow-inner disabled:opacity-60 disabled:cursor-not-allowed">
                            <option value="" x-text="selectedAreas.length === 0 ? '-- Primero seleccione al menos un área responsable --' : (filteredTechnicians.length === 0 ? '-- Las áreas seleccionadas no cuentan con especialistas individuales --' : '-- Sin usuario asignado (asignar solo a nivel de área) --')"></option>
                            <template x-for="tech in filteredTechnicians" :key="tech.id">
                                <option :value="tech.id" x-text="'[' + tech.role_name + '] ' + tech.name + ' (' + tech.badge + ')'"></option>
                            </template>
                        </select>
                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none select-none">expand_more</span>
                    </div>
                    <p class="text-[11px] text-outline" x-show="selectedAreas.length > 0 && filteredTechnicians.length === 0">* Las áreas seleccionadas operarán sin asignación individual de técnico.</p>
                </div>

                <div class="flex flex-col gap-1.5">
                    <label for="modal_comment" class="text-xs font-semibold text-on-surface">Observaciones de Asignación <span class="text-outline font-normal">(Opcional)</span></label>
                    <textarea id="modal_comment" x-model="comment" rows="2" maxlength="500" placeholder="Motivo de la asignación, instrucciones operativas a pista o consola..."
                        class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner resize-none"></textarea>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-border-subtle">
                    <div class="text-[11px] text-outline">
                        <span x-show="selectedAreas.length === 0" class="text-status-critical flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">error</span>
                            Seleccione al menos un área.
                        </span>
                    </div>
                    <div class="flex items-center gap-3">
                        <button type="button" @click="showAssignModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="selectedAreas.length === 0 || isSubmitting" class="px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                            <span x-text="isSubmitting ? 'Asignando...' : 'Confirmar Asignación'"></span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>`;
}

export default {
    name: 'incidents.show',
    title: 'Expediente',
    async render({ params }) {
        const inc = await incidents.detail(params.folio);
        const ab = inc.abilities;
        const flashes = takeFlash();
        const code = inc.status.code;
        const urls = await incidents.signedUrls(inc.attachments.map((a) => a.stored_path));

        // Datos iniciales del modal de asignación
        const creatorSlug = (inc.reported_by?.role?.slug ?? '').toLowerCase();
        let initialAreas = inc.assigned_areas
            .map((a) => String(a.area_code).toLowerCase())
            .filter((c) => c !== 'tics' && c !== 'admin' && (creatorSlug === '' || c !== creatorSlug));
        if (!initialAreas.length && inc.assigned_to?.role && inc.assigned_to.role.slug !== 'admin' && inc.assigned_to.role_id !== inc.reported_by?.role_id) {
            initialAreas = [inc.assigned_to.role.slug];
        }
        const initialUserId =
            inc.assigned_to && inc.assigned_to.role?.slug !== 'admin' && inc.assigned_to.role_id !== inc.reported_by?.role_id ? String(inc.assigned_to.id) : '';

        page = {
            id: inc.id,
            assign: { areas: inc.available_areas, technicians: inc.available_technicians, initialAreas, initialUserId },
        };

        const badge = originBadge(inc);
        const responsibleName = inc.is_assigned_to_tics ? 'TICS' : inc.assigned_to?.name ?? 'Sin asignar';

        return html`<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6" x-data="incidentShowPage">
            ${flashes.success
                ? html`<div class="p-4 rounded-xl bg-status-resolved/10 border border-status-resolved/30 text-status-resolved flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-2 font-medium text-xs sm:text-sm">
                        <span class="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>${flashes.success}</span>
                    </div>
                </div>`
                : ''}
            ${flashes.error
                ? html`<div class="p-4 rounded-xl bg-status-critical/10 border border-status-critical/30 text-status-critical flex items-center gap-2 shadow-sm font-medium text-xs sm:text-sm">
                    <span class="material-symbols-outlined text-[20px]">error</span><span>${flashes.error}</span>
                </div>`
                : ''}
            <div x-show="pageError && !showAssignModal && !showResolveModal && !showRejectModal && !showCloseModal && !showUploadModal" x-cloak class="p-4 rounded-xl bg-status-critical/10 border border-status-critical/30 text-status-critical flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2 font-medium text-xs sm:text-sm">
                    <span class="material-symbols-outlined text-[20px]">error</span>
                    <span x-text="pageError"></span>
                </div>
            </div>

            <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div class="flex flex-col gap-1.5">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span class="font-mono text-xl sm:text-2xl font-bold text-primary tracking-wide">${inc.folio}</span>
                        <span class="${cls('inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider', statusPillClasses(code))}">
                            ${code === 'EN_ATENCION' ? html`<span class="w-2 h-2 rounded-full bg-[#E0A21A] animate-pulse"></span>` : ''}
                            ${inc.status.name}
                        </span>
                        ${badgePriority(inc.priority)}
                        ${isFromCco(inc)
                            ? html`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30" title="Procedencia de la incidencia">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>APOC-CCO</span>`
                            : isFromCsa(inc)
                              ? html`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30" title="Procedencia de la incidencia">
                                <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>APOC-CSA</span>`
                              : badge
                                ? html`<span class="${cls('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider border', badge.bg, badge.text, badge.border)}" title="${badge.title}">${badge.label}</span>`
                                : ''}
                        <span class="text-xs text-outline font-mono hidden sm:inline">| ${inc.category.name}</span>
                    </div>
                    <h1 class="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">${inc.title}</h1>
                </div>

                <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                    ${ab.take && !inc.assigned_to
                        ? html`<button type="button" @click="take()" :disabled="busy" class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">engineering</span>
                            <span>Tomar Incidencia</span>
                        </button>`
                        : ''}
                    ${ab.assign
                        ? html`<button type="button" @click="showAssignModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container text-primary border border-border-subtle font-semibold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                            <span>${inc.assigned_to || inc.is_assigned_to_tics ? 'Reasignar Especialista' : 'Asignar Especialista'}</span>
                        </button>`
                        : ''}
                    ${ab.startAttention
                        ? html`<button type="button" @click="startAttention()" :disabled="busy" class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">play_arrow</span>
                            <span>Iniciar Atención</span>
                        </button>`
                        : ''}
                    ${ab.resolve
                        ? html`<button type="button" @click="showResolveModal = true; pageError = ''" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">task_alt</span>
                            <span>Marcar como Resuelta</span>
                        </button>`
                        : ''}
                    ${ab.rejectResolution
                        ? html`<button type="button" @click="showRejectModal = true; pageError = ''" class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">replay</span>
                            <span>Rechazar Solución</span>
                        </button>`
                        : ''}
                    ${ab.close
                        ? html`<button type="button" @click="showCloseModal = true; pageError = ''" class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">verified</span>
                            <span>Dar VoBo y Cerrar</span>
                        </button>`
                        : ''}
                    ${gates.incidentCreate()
                        ? html`<a href="#/incidencias/nueva" class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-subtle font-semibold text-xs rounded-xl transition-all">
                            <span class="material-symbols-outlined text-[18px]">add</span>
                            <span>Nueva</span>
                        </a>`
                        : ''}
                </div>
            </div>

            ${code === 'CERRADA'
                ? html`<div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div class="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                        <span class="material-symbols-outlined text-slate-400 text-[22px]">lock</span>
                        <span>Expediente Cerrado y Archivado — Modo de Solo Lectura Inmutable</span>
                        <span class="text-outline font-normal hidden md:inline">• Visto Bueno otorgado por ${inc.closer?.tagged_name ?? 'Operador'}</span>
                    </div>
                    <div class="font-mono text-xs text-outline flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px]">task_alt</span>
                        <span>Cierre: ${formatDate(inc.closed_at, 'd/m/Y H:i')} hrs</span>
                    </div>
                </div>`
                : ''}

            ${inc.rejection_reason && code === 'EN_ATENCION'
                ? html`<div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-sm">
                    <div class="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span class="material-symbols-outlined text-rose-400 text-[22px] shrink-0 mt-0.5">warning</span>
                        <div class="flex flex-col gap-1">
                            <span class="font-bold text-rose-400">Solución Técnica Previa Rechazada por APOC</span>
                            <p class="text-xs text-rose-200/90 leading-relaxed font-sans">${inc.rejection_reason}</p>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-[11px] font-mono shrink-0 self-start">Reingreso a Diagnóstico</span>
                </div>`
                : ''}

            ${code === 'EN_ATENCION'
                ? html`<div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div class="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                        <span>Incidencia en Atención Técnica y Diagnóstico de Campo</span>
                        <span class="text-outline font-normal hidden md:inline">• Responsable: ${responsibleName}</span>
                    </div>
                    <div class="font-mono text-xs text-amber-400/80 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px]">schedule</span>
                        <span>Inicio: ${formatDate(inc.attended_at, 'H:i')} hrs</span>
                    </div>
                </div>`
                : ''}

            ${stepper(inc)}

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div class="lg:col-span-8 flex flex-col gap-6">
                    ${inc.solution_description
                        ? html`<div class="bg-surface-subtle border border-emerald-500/40 p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-subtle">
                                <h2 class="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-emerald-400 text-[20px]">task_alt</span>
                                    <span>Solución Técnica Certificada (GTS)</span>
                                </h2>
                                ${inc.resolved_at ? html`<span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-500/30">Resuelta: ${formatDate(inc.resolved_at, 'd/m/Y H:i')} hrs</span>` : ''}
                            </div>
                            <div class="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line bg-surface-container-low p-4 rounded-xl border border-border-subtle font-sans">${inc.solution_description}</div>
                            ${code === 'RESUELTA'
                                ? html`<div class="p-3 bg-[#123A70]/25 rounded-lg border border-[#164A8A]/40 text-xs text-[#A8C4E6] flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">pending_actions</span>
                                    <span>En espera de validación de servicio y visto bueno para proceder con el cierre formal del ticket.</span>
                                </div>`
                                : ''}
                        </div>`
                        : ''}

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary text-[18px]">description</span>
                            Descripción del Problema
                        </h2>
                        <div class="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line bg-surface-container-low p-4 rounded-xl border border-border-subtle font-sans">${inc.description}</div>
                    </div>

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <div class="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-border-subtle">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-[20px]">attach_file</span>
                                <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface">Evidencias y Archivos Adjuntos</h2>
                                <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-xs font-bold border border-border-subtle">${inc.attachments.length}</span>
                            </div>
                            ${ab.uploadAttachment
                                ? html`<button type="button" @click="showUploadModal = true; pageError = ''" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold rounded-xl border border-border-subtle transition-colors cursor-pointer">
                                    <span class="material-symbols-outlined text-[16px]">cloud_upload</span>
                                    <span>Adjuntar Evidencia</span>
                                </button>`
                                : ''}
                        </div>

                        ${inc.attachments.length
                            ? html`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                ${inc.attachments.map((att) => {
                                    const url = urls[att.stored_path];
                                    return html`<div class="p-3.5 rounded-xl bg-surface-container-low border border-border-subtle hover:border-border-active transition-all flex flex-col justify-between gap-3 shadow-sm">
                                        <div class="flex items-start gap-3">
                                            <div class="${cls('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border', fileBadgeColor(att))}">
                                                <span class="material-symbols-outlined text-[20px]">${fileIcon(att)}</span>
                                            </div>
                                            <div class="flex flex-col min-w-0 flex-1">
                                                <span class="font-mono text-xs font-semibold text-on-surface truncate" title="${att.original_filename}">${att.original_filename}</span>
                                                <div class="flex items-center gap-2 text-[11px] text-outline mt-0.5">
                                                    <span class="font-mono">${formattedSize(att)}</span>
                                                    <span>•</span>
                                                    <span>${formatDate(att.created_at, 'd/m/Y H:i')}</span>
                                                </div>
                                                <span class="text-[10px] text-on-surface-variant truncate mt-0.5">Por: ${att.uploaded_by?.name ?? 'Usuario'}</span>
                                            </div>
                                        </div>
                                        ${isImage(att) && url
                                            ? html`<div class="rounded-lg overflow-hidden border border-border-subtle bg-surface-base max-h-36 flex items-center justify-center">
                                                <a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="${att.original_filename}" class="w-full h-auto object-cover max-h-36 hover:scale-105 transition-transform duration-200 cursor-pointer" /></a>
                                            </div>`
                                            : ''}
                                        <div class="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle/50">
                                            ${url
                                                ? html`<a href="${url}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant hover:text-primary bg-surface-container-high hover:bg-surface-container rounded-lg border border-border-subtle transition-colors" title="Visualizar en pestaña nueva">
                                                    <span class="material-symbols-outlined text-[14px]">visibility</span>
                                                    <span>Ver</span>
                                                </a>`
                                                : ''}
                                            <button type="button" @click="download(${js(att.stored_path)}, ${js(att.original_filename)})" class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-on-primary bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all" title="Descargar archivo físico">
                                                <span class="material-symbols-outlined text-[14px]">download</span>
                                                <span>Descargar</span>
                                            </button>
                                        </div>
                                    </div>`;
                                })}
                            </div>`
                            : html`<div class="p-6 rounded-xl bg-surface-container-low border border-border-subtle/70 flex flex-col items-center justify-center text-center gap-2">
                                <div class="w-10 h-10 rounded-full bg-surface-container-high text-outline flex items-center justify-center">
                                    <span class="material-symbols-outlined text-[22px]">folder_open</span>
                                </div>
                                <span class="text-xs font-semibold text-on-surface">No hay evidencias adjuntas</span>
                                <p class="text-[11px] text-outline max-w-sm">Este expediente no cuenta con capturas de error, bitácoras o archivos de respaldo.</p>
                            </div>`}

                        ${code === 'CERRADA'
                            ? html`<div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 text-[11px] flex items-center gap-2">
                                <span class="material-symbols-outlined text-[16px] text-slate-400">lock</span>
                                <span>Expediente archivado en modo inmutable. No se permite la carga de nuevas evidencias.</span>
                            </div>`
                            : ''}
                    </div>

                    ${ab.addNote
                        ? html`<div class="bg-surface-subtle border border-amber-500/30 p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <h2 class="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-amber-400 text-[18px]">engineering</span>
                                    Registrar Avance Técnico de Campo
                                </h2>
                                <span class="text-[11px] text-outline font-mono">GTS Operaciones</span>
                            </div>
                            <form @submit.prevent="addNote()" class="flex flex-col gap-3">
                                <textarea x-model="note" rows="3" required minlength="5" maxlength="1000"
                                    placeholder="Describir pruebas en sitio, diagnóstico con multímetro/OTDR, sustitución de hardware (switch, PoE, cámara, cableado)..."
                                    class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-amber-400/50 transition-colors shadow-inner resize-none"></textarea>
                                <div class="flex items-center justify-between flex-wrap gap-2">
                                    <span class="text-[11px] text-outline">Mínimo 5 caracteres • Registro inmutable en bitácora</span>
                                    <button type="submit" :disabled="busy" class="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-60">
                                        <span class="material-symbols-outlined text-[16px]">post_add</span>
                                        <span>Registrar Avance</span>
                                    </button>
                                </div>
                            </form>
                        </div>`
                        : ''}

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-[18px]">history</span>
                                <span>Bitácora de Trazabilidad y Auditoría (Append-Only)</span>
                            </div>
                            <span class="px-2 py-0.5 rounded bg-surface-container-low text-outline font-mono text-xs">${inc.histories.length} evento(s)</span>
                        </h2>
                        <div class="relative pl-6 border-l-2 border-border-subtle flex flex-col gap-5 my-2">
                            ${inc.histories.map((h) => html`<div class="relative flex flex-col gap-1">
                                <div class="${cls('absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-surface-base border-2', HISTORY_DOT[h.action] ?? 'border-primary')}"></div>
                                <div class="flex items-center gap-2 flex-wrap text-xs">
                                    <span class="${cls('font-mono font-bold text-[11px] px-2 py-0.5 rounded uppercase', HISTORY_TAG[h.action] ?? 'bg-surface-container-high text-primary border border-border-subtle')}">${h.action}</span>
                                    <span class="text-outline">•</span>
                                    <span class="font-medium text-on-surface">${h.user ? h.user.tagged_name : 'Sistema'}</span>
                                    <span class="text-outline">•</span>
                                    <span class="font-mono text-[11px] text-outline">${formatDate(h.created_at, 'd M Y H:i:s')}</span>
                                </div>
                                ${historyBody(h)}
                                ${h.field_name
                                    ? html`<div class="text-[11px] text-outline font-mono flex items-center gap-1.5 mt-0.5 flex-wrap">
                                        <span>${h.field_name}:</span>
                                        <span class="line-through text-[#E66A7A]/70">${h.old_value ?? 'ninguno'}</span>
                                        <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                                        <span class="text-status-resolved font-medium">${h.new_value ?? 'ninguno'}</span>
                                    </div>`
                                    : ''}
                            </div>`)}
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4 flex flex-col gap-6">
                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 pb-2 border-b border-border-subtle">
                            <span class="material-symbols-outlined text-primary text-[18px]">badge</span>
                            Responsable Técnico
                        </h2>
                        ${inc.assigned_areas.length
                            ? html`<div class="flex flex-col gap-1.5 pb-2 border-b border-border-subtle/60">
                                <span class="text-[10px] uppercase font-bold text-outline tracking-wider">Área(s) Responsable(s)</span>
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    ${inc.assigned_areas.map((a) => html`<span class="${cls('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border', areaBadgeClasses(a))}">
                                        <span class="material-symbols-outlined text-[13px]">domain</span>
                                        <span>${areaLabel(a)}</span>
                                    </span>`)}
                                </div>
                            </div>`
                            : ''}
                        ${inc.assigned_to
                            ? html`<div class="flex items-center gap-3 bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                                <div class="w-10 h-10 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center font-mono font-bold text-primary text-sm">${inc.assigned_to.name.slice(0, 2)}</div>
                                <div class="flex flex-col min-w-0">
                                    <span class="font-semibold text-xs text-on-surface truncate">${inc.assigned_to.name}</span>
                                    <span class="text-[11px] text-outline font-mono">${inc.assigned_to.email ?? ''}</span>
                                    <div class="flex items-center gap-2 mt-1 flex-wrap"><span class="text-[10px] text-outline font-mono">${inc.assigned_to.role?.name ?? 'GTS'}</span></div>
                                </div>
                            </div>`
                            : inc.is_assigned_to_tics
                              ? html`<div class="flex items-center gap-3 bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                                <div class="w-10 h-10 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center font-mono font-bold text-primary text-sm">TI</div>
                                <div class="flex flex-col min-w-0">
                                    <span class="font-semibold text-xs text-on-surface truncate">TICS</span>
                                    <span class="text-[11px] text-outline font-mono">Especialista de Atención</span>
                                    <div class="flex items-center gap-2 mt-1 flex-wrap"><span class="text-[10px] text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">Área TICS</span></div>
                                </div>
                            </div>`
                              : inc.assigned_areas.length
                                ? html`<div class="flex items-center gap-3 bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                                    <div class="w-10 h-10 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center font-mono font-bold text-outline text-sm">
                                        <span class="material-symbols-outlined text-[20px]">groups</span>
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-semibold text-xs text-on-surface">Asignación a Nivel de Área</span>
                                        <span class="text-[11px] text-outline">Sin especialista individual asignado</span>
                                        <span class="text-[10px] text-primary mt-0.5">Atención abierta para personal autorizado</span>
                                    </div>
                                </div>`
                                : html`<div class="flex flex-col items-center justify-center gap-2 p-5 bg-surface-container-low rounded-xl border border-border-subtle text-center">
                                    <span class="material-symbols-outlined text-outline text-[28px]">person_off</span>
                                    <span class="text-xs font-semibold text-outline">Sin Especialista Asignado</span>
                                    <p class="text-[11px] text-outline max-w-[200px]">La incidencia se encuentra en espera de toma técnica por GTS.</p>
                                </div>`}
                    </div>

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 pb-2 border-b border-border-subtle">
                            <span class="material-symbols-outlined text-primary text-[18px]">info</span>
                            Ficha Técnica Operativa
                        </h2>
                        <dl class="flex flex-col gap-3 text-xs">
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Subsistema:</dt><dd class="text-on-surface font-semibold">${inc.category.name}</dd></div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Ubicación:</dt><dd class="text-on-surface font-semibold text-right max-w-[180px]">${inc.location}</dd></div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50">
                                <dt class="text-outline">Reportado Por:</dt>
                                <dd class="text-on-surface font-semibold flex items-center gap-1.5">
                                    <span>${inc.reported_by?.name ?? 'Sistema'}</span>
                                    ${isFromCco(inc)
                                        ? html`<span class="px-1.5 py-0.2 rounded font-mono text-[9.5px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">CCO</span>`
                                        : isFromCsa(inc)
                                          ? html`<span class="px-1.5 py-0.2 rounded font-mono text-[9.5px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">CSA</span>`
                                          : inc.origin_group
                                            ? html`<span class="px-1.5 py-0.2 rounded font-mono text-[9.5px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">${inc.origin_group}</span>`
                                            : ''}
                                </dd>
                            </div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50">
                                <dt class="text-outline">Procedencia:</dt>
                                <dd class="text-on-surface font-semibold font-mono text-xs">
                                    ${isFromCco(inc)
                                        ? html`<span class="text-amber-400 font-bold">APOC-CCO</span>`
                                        : isFromCsa(inc)
                                          ? html`<span class="text-orange-400 font-bold">APOC-CSA</span>`
                                          : html`<span>${inc.origin_group ?? 'GTS'}</span>`}
                                </dd>
                            </div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Reporte:</dt><dd class="text-on-surface font-mono">${formatDate(inc.created_at, 'Y-m-d H:i:s')}</dd></div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Asignación:</dt><dd class="text-on-surface font-mono">${formatDate(inc.assigned_at, 'Y-m-d H:i:s', 'Pendiente')}</dd></div>
                            ${inc.resolved_at ? html`<div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Resolución:</dt><dd class="text-emerald-400 font-mono">${formatDate(inc.resolved_at, 'Y-m-d H:i:s')}</dd></div>` : ''}
                            ${inc.closed_at ? html`<div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Cierre:</dt><dd class="text-primary font-mono font-semibold">${formatDate(inc.closed_at, 'Y-m-d H:i:s')}</dd></div>` : ''}
                            <div class="flex items-center justify-between gap-2 py-1.5"><dt class="text-outline">Tiempo de respuesta estimado:</dt><dd class="text-primary font-mono font-semibold shrink-0">${inc.priority.sla_minutes} minutos</dd></div>
                        </dl>
                    </div>
                </div>
            </div>

            ${ab.assign ? assignModal(inc) : ''}

            ${ab.resolve
                ? modalShell('showResolveModal', 'task_alt', 'text-emerald-400', 'Resolución Técnica de Incidencia', html`<form @submit.prevent="resolve()" class="flex flex-col gap-4">
                    <div class="p-3 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between text-xs">
                        <span class="text-outline">Folio:</span>
                        <span class="font-mono font-bold text-primary">${inc.folio}</span>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="modal_solution_description" class="text-xs font-semibold text-on-surface">Descripción Técnica de la Solución Aplicada <span class="text-status-critical">*</span></label>
                        <textarea id="modal_solution_description" x-model="solution" rows="5" required minlength="15" maxlength="3000"
                            placeholder="Detallar las acciones técnicas ejecutadas: componentes sustituidos (marca, modelo, serial), reconfiguración de puertos/VLANs, pruebas de calibración o telemetría en consola, y confirmación de estabilidad..."
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-emerald-400/50 transition-colors shadow-inner resize-none"></textarea>
                        <span class="text-[11px] text-outline">Mínimo 15 caracteres obligatorios. La solución quedará registrada de forma inmutable en el expediente de auditoría.</span>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showResolveModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">check_circle</span>
                            <span>Confirmar y Marcar como Resuelta</span>
                        </button>
                    </div>
                </form>`)
                : ''}

            ${ab.rejectResolution
                ? modalShell('showRejectModal', 'replay', 'text-rose-400', 'Rechazo de Solución Técnica (APOC)', html`<form @submit.prevent="reject()" class="flex flex-col gap-4">
                    <div class="p-3 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between text-xs">
                        <span class="text-outline">Folio de Expediente:</span>
                        <span class="font-mono font-bold text-primary">${inc.folio}</span>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="modal_rejection_reason" class="text-xs font-semibold text-on-surface">Motivo / Hallazgos de Rechazo <span class="text-status-critical">*</span></label>
                        <textarea id="modal_rejection_reason" x-model="rejection" rows="4" required minlength="10" maxlength="1000"
                            placeholder="Explicar detalladamente por qué no se acepta la solución: pruebas en sitio fallidas, persistencia de intermitencia, cámaras aún sin telemetría, errores en e-Gates..."
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-rose-400/50 transition-colors shadow-inner resize-none"></textarea>
                        <span class="text-[11px] text-outline">Mínimo 10 caracteres obligatorios. Este reporte devolverá el ticket inmediatamente al estado EN ATENCIÓN para nuevo diagnóstico técnico por GTS.</span>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showRejectModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">replay</span>
                            <span>Confirmar Rechazo y Reabrir Atención</span>
                        </button>
                    </div>
                </form>`)
                : ''}

            ${ab.close
                ? modalShell('showCloseModal', 'verified', 'text-primary', 'Conformidad y Cierre de Incidencia', html`<form @submit.prevent="closeIncident()" class="flex flex-col gap-4">
                    <div class="p-3.5 rounded-xl bg-surface-container-low border border-border-subtle flex flex-col gap-2 text-xs">
                        <div class="flex items-center justify-between"><span class="text-outline">Folio de Expediente:</span><span class="font-mono font-bold text-primary text-sm">${inc.folio}</span></div>
                        <div class="flex items-center justify-between"><span class="text-outline">Especialista:</span><span class="font-semibold text-on-surface">${inc.is_assigned_to_tics ? 'TICS' : inc.assigned_to?.name ?? 'GTS de Guardia'}</span></div>
                        <div class="flex items-center justify-between"><span class="text-outline">Subsistema:</span><span class="text-on-surface">${inc.category.name}</span></div>
                    </div>
                    <div class="p-3 bg-primary/10 rounded-xl border border-primary/20 text-xs flex items-start gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">info</span>
                        <p class="leading-relaxed text-[11px] text-on-surface-variant">Al confirmar, el expediente pasará al estado final inmutable <strong class="text-on-surface">CERRADA</strong>. Se archivará la solución técnica documentada y ningún usuario podrá reactivar ni alterar este registro.</p>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="modal_close_comment" class="text-xs font-semibold text-on-surface">Observaciones de Conformidad y Servicio <span class="text-outline font-normal">(Opcional)</span></label>
                        <textarea id="modal_close_comment" x-model="closeComment" rows="3" maxlength="1000"
                            placeholder="Detalles de la validación: servicio verificado en sala/pista, pruebas de pasajeros exitosas, visto bueno otorgado..."
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 transition-colors shadow-inner resize-none"></textarea>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showCloseModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">verified</span>
                            <span>Confirmar Cierre y Conformidad</span>
                        </button>
                    </div>
                </form>`)
                : ''}

            ${ab.uploadAttachment
                ? modalShell('showUploadModal', 'cloud_upload', 'text-primary', `Adjuntar Nuevas Evidencias — ${inc.folio}`, html`<form @submit.prevent="upload()" class="flex flex-col gap-4">
                    <div class="p-3 bg-surface-container-low rounded-xl border border-border-subtle text-xs text-on-surface-variant flex items-start gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">info</span>
                        <p class="leading-relaxed text-[11px]">Los archivos se resguardarán en almacenamiento privado no accesible públicamente. Formatos permitidos: <strong class="text-on-surface">JPG, PNG, PDF, TXT</strong> (máx. 10 MB por archivo, hasta 5 archivos).</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="modal_attachments" class="text-xs font-semibold text-on-surface">Seleccionar Archivos de Respaldo <span class="text-status-critical">*</span></label>
                        <input type="file" id="modal_attachments" x-ref="uploadInput" multiple required accept=".jpg,.jpeg,.png,.pdf,.txt"
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-container-high file:text-primary hover:file:bg-surface-container cursor-pointer shadow-inner" />
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showUploadModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]" :class="busy ? 'animate-spin' : ''" x-text="busy ? 'progress_activity' : 'cloud_upload'">cloud_upload</span>
                            <span x-text="busy ? 'Resguardando...' : 'Subir y Resguardar'">Subir y Resguardar</span>
                        </button>
                    </div>
                </form>`, 'max-w-lg', 'bg-black/70')
                : ''}
        </div>`;
    },
};
