/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL_API, {
    path: '/ws',
    transports: ['websocket', 'polling'],
    // El gateway valida el origen y acepta credenciales; sin esto las peticiones
    // cross-origin pierden la cookie/sesión.
    withCredentials: true,
});

export const useSocket = (channel: string, callback: (data: any) => void) => {
    useEffect(() => {
        socket.on(channel, callback);

        return () => {
            socket.off(channel, callback);
        };
    }, [channel, callback]);

    return socket;
};
