// Cliente de la API (funciones RPC de PostgreSQL expuestas por Supabase)
import { supabase } from './supabase.js';

export class ApiError extends Error {
    constructor(message, status = 422, code = null) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export function toApiError(error) {
    if (!error) {
        return new ApiError('Ocurrió un error inesperado.', 500);
    }
    if (error instanceof ApiError) {
        return error;
    }
    const message = error.message || 'Ocurrió un error inesperado.';
    if (/Failed to fetch|NetworkError|Load failed/i.test(message)) {
        return new ApiError('Error de conectividad al enviar la solicitud. Por favor intente nuevamente.', 0);
    }
    if (/JWT expired|invalid JWT|permission denied for function/i.test(message)) {
        return new ApiError('Su sesión ha expirado. Inicie sesión nuevamente.', 401, error.code);
    }
    const status = error.code === '42501' ? 403 : error.code === 'P0002' ? 404 : 422;
    return new ApiError(message, status, error.code);
}

export async function rpc(name, args = {}) {
    const { data, error } = await supabase.rpc(name, args);
    if (error) {
        throw toApiError(error);
    }
    return data;
}
