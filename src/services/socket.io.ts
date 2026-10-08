/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { io } from "socket.io-client";
import { getAccessToken, isAccessTokenExpiring } from "./token.store";

/**
 * El gateway autentica en el handshake, no en cada mensaje ni en una conexión ya
 * abierta. Si el access token venció mientras el usuario estaba inactivo, un
 * reintento de conexión manda el token viejo, el gateway lo rechaza y desconecta.
 * Como el cierre es del servidor, socket.io no reintenta solo: el socket queda
 * muerto hasta el próximo refresh HTTP. `tokenRefresher` se registra desde
 * base.service (evita el import circular) para renovar antes de reconectar.
 */
type TokenRefresher = () => Promise<string>;

let tokenRefresher: TokenRefresher | null = null;

export const setTokenRefresher = (refresher: TokenRefresher): void => {
    tokenRefresher = refresher;
};

/**
 * El gateway de socket.io del backend vive en el path "/ws" (no en "/socket.io"),
 * y lo sirve nginx a través del bloque `location /ws` de nginx.conf. Si ese bloque
 * falta, el handshake recibe el index.html del SPA y falla el parseo de socket.io,
 * que entra entonces en un ciclo de reconexión infinito.
 */
export const socket = io(import.meta.env.VITE_BASE_URL_API, {
    path: '/ws',
    transports: ['websocket', 'polling'],
    withCredentials: true,
    autoConnect: false,
    auth: (cb) => cb({ token: getAccessToken() ?? '' }),
    // Reintentos indefinidos (la app es de sesión larga) pero con esperas
    // crecientes: ante una caída del backend no se martillea el servidor con
    // peticiones cada segundo.
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 15000,
    randomizationFactor: 0.5,
    timeout: 20000,
});

let recovering = false;

/**
 * Renueva el access token si está vencido y reconecta. Nunca conecta con un token
 * expirado (evita el rechazo del gateway en bucle); si el refresco falla, se deja
 * que socket.io reintente con su backoff.
 */
const recoverWithFreshToken = async (): Promise<void> => {
    if (recovering || !getAccessToken()) {
        return;
    }

    recovering = true;

    try {
        if (isAccessTokenExpiring() && tokenRefresher) {
            await tokenRefresher();
        }

        if (!socket.connected && !isAccessTokenExpiring()) {
            socket.connect();
        }
    } catch {
        // Refresco falló (red/backend): socket.io reintentará con backoff.
    } finally {
        recovering = false;
    }
};

socket.on('connect', () => {
    console.info('[socket] conectado');
});

socket.on('disconnect', (reason: string) => {
    // "io client disconnect" es el cierre intencionado (logout / 401), no una falla.
    // "io server disconnect" suele ser el gateway rechazando un token vencido: hay
    // que renovar y reconectar o el socket queda muerto sin avisar.
    if (reason === 'io server disconnect') {
        void recoverWithFreshToken();
    } else if (reason !== 'io client disconnect') {
        console.warn('[socket] desconectado:', reason);
    }
});

socket.on('connect_error', (error: Error) => {
    console.warn('[socket] error de conexión:', error.message);
    void recoverWithFreshToken();
});

socket.on('unauthorized', () => {
    void recoverWithFreshToken();
});

export const connectSocket = () => {
    // No se conecta antes del login: sin access token el gateway rechazaría el handshake
    // y socket.io entraría en un bucle de reconexión.
    if (!getAccessToken()) return;

    // Con el token vencido se renueva primero: conectar ahora garantizaría el rechazo.
    if (isAccessTokenExpiring()) {
        void recoverWithFreshToken();
        return;
    }

    if (!socket.connected) socket.connect();
};

/**
 * El gateway autentica por el token del handshake, no por un header de la conexión ya
 * abierta. Tras un refresh hay que rehacer el handshake para que el backend no corte la
 * conexión al expirarle el token viejo.
 */
export const reconnectSocket = () => {
    if (!getAccessToken()) return;
    if (socket.connected) socket.disconnect();
    socket.connect();
};

export const disconnectSocket = () => {
    socket.disconnect();
};

export const useSocket = (channel: string, callback: (data: any) => void) => {
    useEffect(() => {
        socket.on(channel, callback);

        return () => {
            socket.off(channel, callback);
        };
    }, [channel, callback]);

    return socket;
};
