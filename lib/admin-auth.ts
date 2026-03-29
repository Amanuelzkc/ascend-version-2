// This is a simple in-memory store for reset codes.
// In a production app, use a database or Redis.

interface ResetState {
    email: string;
    code: string;
    expires: number;
}

// Global variable to persist across hot reloads in dev
const globalWithReset = global as typeof globalThis & {
    adminResetState?: ResetState;
};

export function saveResetCode(email: string, code: string) {
    globalWithReset.adminResetState = {
        email,
        code,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
}

export function verifyResetCode(email: string, code: string): boolean {
    const state = globalWithReset.adminResetState;
    if (!state) return false;
    if (state.email.toLowerCase() !== email.toLowerCase()) return false;
    if (state.code !== code) return false;
    if (Date.now() > state.expires) return false;
    return true;
}

export function clearResetCode() {
    delete globalWithReset.adminResetState;
}
