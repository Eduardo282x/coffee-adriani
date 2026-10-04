/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from "./token.store";

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

socket.on('connect', () => {
    console.info('[socket] conectado');
});

socket.on('disconnect', (reason: string) => {
    // "io client disconnect" es el cierre intencionado (logout / 401), no una falla.
    if (reason !== 'io client disconnect') {
        console.warn('[socket] desconectado:', reason);
    }
});

socket.on('connect_error', (error: Error) => {
    console.warn('[socket] error de conexión:', error.message);
});

export const connectSocket = () => {
    // No se conecta antes del login: sin access token el gateway rechazaría el handshake
    // y socket.io entraría en un bucle de reconexión.
    if (!getAccessToken()) return;
    if (!socket.connected) socket.connect();
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
