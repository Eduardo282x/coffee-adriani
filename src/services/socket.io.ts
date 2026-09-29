/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from "./token.store";

export const socket = io(import.meta.env.VITE_BASE_URL_API, {
    path: '/ws',
    transports: ['websocket', 'polling'],
    withCredentials: true,
    autoConnect: false,
    auth: (cb) => cb({ token: getAccessToken() ?? '' }),
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
