import type { SessionTokens } from './base.interface';

/**
 * Coordinación de sesión entre pestañas del mismo origen.
 *
 * `sessionStorage` es por pestaña: al duplicar una pestaña el navegador copia sus
 * tokens, de modo que dos pestañas pueden compartir el MISMO refresh token de un
 * solo uso. Si una rota y la otra reintenta con el viejo, el backend lo interpreta
 * como reuso. El canal notifica a las demás pestañas el par nuevo (para que
 * converjan) y el cierre de sesión (para que ninguna quede con credenciales muertas).
 */
const CHANNEL_NAME = 'cafe-adriani-session';

type SessionMessage =
    | { type: 'session'; tokens: SessionTokens }
    | { type: 'logout' };

let channel: BroadcastChannel | null = null;

const getChannel = (): BroadcastChannel | null => {
    if (typeof BroadcastChannel === 'undefined') {
        return null;
    }

    if (!channel) {
        channel = new BroadcastChannel(CHANNEL_NAME);
    }

    return channel;
};

export const broadcastSession = (tokens: SessionTokens): void => {
    getChannel()?.postMessage({ type: 'session', tokens } satisfies SessionMessage);
};

export const broadcastLogout = (): void => {
    getChannel()?.postMessage({ type: 'logout' } satisfies SessionMessage);
};

export const subscribeToSessionChannel = (handlers: {
    onSession: (tokens: SessionTokens) => void;
    onLogout: () => void;
}): (() => void) => {
    const current = getChannel();

    if (!current) {
        return () => {};
    }

    const listener = (event: MessageEvent<SessionMessage>) => {
        const data = event.data;

        if (!data) return;

        if (data.type === 'session') {
            handlers.onSession(data.tokens);
        } else if (data.type === 'logout') {
            handlers.onLogout();
        }
    };

    current.addEventListener('message', listener);

    return () => current.removeEventListener('message', listener);
};
