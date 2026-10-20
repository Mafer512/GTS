// IncidentService / IncidentController / IncidentAttachmentController / FileStorageService
import { rpc, ApiError, toApiError } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';
import { config } from '../config.js';

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'pdf', 'txt'];
const MIME_BY_EXTENSION = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', pdf: 'application/pdf', txt: 'text/plain' };
export const MAX_FILES = 5;
export const MAX_BYTES = 10 * 1024 * 1024;

export const list = (filters = {}, mode = 'all', page = 1) =>
    rpc('incidents_list', { p_filters: filters, p_mode: mode, p_page: Number(page) || 1, p_per_page: 15 });

export const detail = (folio) => rpc('incident_detail', { p_folio: folio });

export const createForm = () => rpc('incident_create_form');

export const assign = (incidentId, areas, technicianId, comment) =>
    rpc('incident_assign', {
        p_incident_id: incidentId,
        p_areas: areas,
        p_technician_id: technicianId ? Number(technicianId) : null,
        p_comment: comment || null,
    });

// Toma técnica directa (formulario oculto con assigned_to_user_id = usuario autenticado)
export const take = (incidentId, userId) =>
    rpc('incident_assign', {
        p_incident_id: incidentId,
        p_areas: null,
        p_technician_id: userId,
        p_comment: 'Toma técnica directa por el especialista de guardia.',
    });

export const startAttention = (incidentId, comment = null) =>
    rpc('incident_start_attention', { p_incident_id: incidentId, p_comment: comment });

export const addNote = (incidentId, note) => rpc('incident_add_note', { p_incident_id: incidentId, p_note: note });

export const resolve = (incidentId, solution) =>
    rpc('incident_resolve', { p_incident_id: incidentId, p_solution_description: solution });

export const rejectResolution = (incidentId, reason) =>
    rpc('incident_reject_resolution', { p_incident_id: incidentId, p_rejection_reason: reason });

export const close = (incidentId, comment) => rpc('incident_close', { p_incident_id: incidentId, p_comment: comment || null });

const extensionOf = (name) => String(name).split('.').pop().toLowerCase();

// StoreAttachmentRequest — validación previa en el navegador
export function validateFiles(files) {
    if (!files.length) {
        throw new ApiError('Debe seleccionar al menos un archivo de evidencia.');
    }
    if (files.length > MAX_FILES) {
        throw new ApiError('No puede adjuntar más de 5 archivos simultáneamente.');
    }
    for (const file of files) {
        if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) {
            throw new ApiError('Solo se admiten evidencias con extensión: JPG, PNG, PDF o TXT.');
        }
        if (file.size > MAX_BYTES) {
            throw new ApiError('Cada archivo de evidencia no debe superar los 10 MB.');
        }
    }
}

// Carga física en Storage (incidents/{id}/{uuid}.{ext}) + registro y auditoría en base de datos
export async function uploadAttachments(incidentId, files, context = 'upload') {
    const list = Array.from(files);
    validateFiles(list);

    const stored = [];
    for (const file of list) {
        const ext = extensionOf(file.name);
        const path = `incidents/${incidentId}/${crypto.randomUUID()}.${ext}`;
        const contentType = MIME_BY_EXTENSION[ext] ?? file.type ?? 'application/octet-stream';
        const { error } = await supabase.storage.from(config.evidenceBucket).upload(path, file, { contentType, upsert: false });
        if (error) {
            throw new ApiError(`No fue posible resguardar "${file.name}": ${error.message}`);
        }
        stored.push({ original_filename: file.name, stored_path: path, mime_type: contentType, file_size_bytes: file.size });
    }

    return rpc('incident_attachments_register', { p_incident_id: incidentId, p_files: stored, p_context: context });
}

// Alta de incidencia con evidencias opcionales
export async function create(data, files = []) {
    const result = await rpc('incident_create', {
        p_title: data.title,
        p_description: data.description,
        p_location: data.location,
        p_category_id: data.category_id ? Number(data.category_id) : null,
        p_priority_id: data.priority_id ? Number(data.priority_id) : null,
    });

    let warning = null;
    if (files.length) {
        try {
            await uploadAttachments(result.id, files, 'create');
        } catch (e) {
            warning = `La incidencia se registró, pero las evidencias no pudieron adjuntarse: ${toApiError(e).message}`;
        }
    }
    return { ...result, warning };
}

// Enlaces temporales firmados (equivalente a las rutas /adjuntos/{id}/ver y /descargar)
export async function signedUrls(paths, expiresIn = 600) {
    if (!paths.length) return {};
    const { data, error } = await supabase.storage.from(config.evidenceBucket).createSignedUrls(paths, expiresIn);
    if (error) return {};
    const map = {};
    (data || []).forEach((item) => {
        if (item.signedUrl) map[item.path] = item.signedUrl;
    });
    return map;
}

export async function downloadUrl(path, filename) {
    const { data, error } = await supabase.storage
        .from(config.evidenceBucket)
        .createSignedUrl(path, 120, { download: filename || true });
    if (error) {
        throw new ApiError('El archivo físico no se encuentra disponible.', 404);
    }
    return data.signedUrl;
}

// Eliminación definitiva: primero evidencias físicas, después el expediente
export async function destroy(incidentId) {
    const paths = await rpc('incident_attachment_paths', { p_incident_id: incidentId });
    if (paths?.length) {
        const { error } = await supabase.storage.from(config.evidenceBucket).remove([...new Set(paths)]);
        if (error) {
            throw new ApiError(`No fue posible purgar las evidencias del almacenamiento: ${error.message}`);
        }
    }
    return rpc('incident_destroy', { p_incident_id: incidentId });
}
