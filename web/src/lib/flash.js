// Mensajes flash entre navegaciones (equivalente a ->with('success', ...))
let pending = {};

export function flash(key, message) {
    pending[key] = message;
}

export function takeFlash() {
    const current = pending;
    pending = {};
    return current;
}
