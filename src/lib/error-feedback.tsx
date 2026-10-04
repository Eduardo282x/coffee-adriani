/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import toast from 'react-hot-toast';
import { Snackbar } from '@/components/snackbar/Snackbar';

const DEFAULT_MESSAGE = 'No se pudo completar la operación. Inténtalo de nuevo.';

/**
 * Un error "de red" es aquel en el que axios no recibió una respuesta HTTP usable:
 * servidor caído, error de gateway (502/503/504), DNS, CORS, timeout o aborted.
 *
 * Antes de este módulo, estos casos resolvían con `undefined` en los helpers
 * "lenient" de base.service.ts, así que la UI los pintaba como una operación
 * vacía pero exitosa. Ahora son fallos explícitos.
 */
export const isNetworkError = (error: unknown): boolean => {
    if (!axios.isAxiosError(error)) return false;
    if (!error.response) return true;

    const { status } = error.response;
    return status >= 500 || status === 408 || status === 429;
};

const payloadOf = (error: unknown): any => {
    if (axios.isAxiosError(error)) {
        return error.response?.data;
    }

    const candidate = error as any;
    return candidate?.response?.data;
};

/**
 * Traduce un error a un mensaje en español que el usuario pueda actuar.
 * Prioriza el mensaje del backend (validaciones de dominio) y cae a un texto
 * legible por categoría en lugar de exponer códigos HTTP o mensajes técnicos
 * de librerías.
 */
export const getErrorMessage = (error: unknown, fallback: string = DEFAULT_MESSAGE): string => {
    const payload = payloadOf(error);

    if (typeof payload?.message === 'string' && payload.message.trim().length > 2) {
        return payload.message;
    }

    if (Array.isArray(payload?.message) && payload.message.length > 0) {
        return payload.message.filter((item: unknown) => typeof item === 'string').join('. ');
    }

    if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
            return 'La operación tardó demasiado. Revisa tu conexión e inténtalo de nuevo.';
        }

        if (!error.response) {
            return 'No hay conexión con el servidor. Revisa tu conexión a internet.';
        }

        switch (error.response.status) {
            case 401:
                return 'Tu sesión expiró. Vuelve a iniciar sesión.';
            case 403:
                return 'No tienes permisos para realizar esta acción.';
            case 404:
                return 'No se encontró la información solicitada.';
            case 413:
                return 'La información es demasiado grande para procesarse.';
            case 429:
                return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
            default:
                break;
        }

        if (error.response.status >= 500) {
            return 'El servidor no pudo procesar la solicitud. Inténtalo en unos segundos.';
        }
    }

    // Errores lanzados deliberadamente por el código de la app (Error propio con
    // texto en español). También se deja pasar un TypeError inesperado: es preferible
    // mostrar un mensaje técnico a tragárselo y dejar la UI en un estado falso.
    if (error instanceof Error && error.message.trim().length > 2) {
        return error.message;
    }

    return fallback;
};

/**
 * Ventana de deduplicación. React Query reintenta un GET hasta dos veces y varios
 * requests suelen fallar juntos (mismo derrubón de backend), así que sin esto el
 * usuario veía tres o cuatro snackbars idénticos apilados.
 */
const DEDUPE_WINDOW_MS = 4000;

const lastNotified = new Map<string, number>();

const shouldNotify = (message: string): boolean => {
    const now = Date.now();
    const previous = lastNotified.get(message);

    if (previous !== undefined && now - previous < DEDUPE_WINDOW_MS) {
        return false;
    }

    lastNotified.set(message, now);
    return true;
};

/** Muestra un snackbar de error sin duplicar la lógica de mensaje en cada vista. */
export const notifyError = (error: unknown, fallback?: string): void => {
    const message = getErrorMessage(error, fallback);

    if (!shouldNotify(message)) return;

    toast.custom(<Snackbar success={false} message={message} />, {
        duration: 4000,
        position: 'bottom-center'
    });
};
