/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BaseResponseLogin, BaseResponse } from './base.interface';
import { getAccessToken, getRefreshToken, isAccessTokenExpiring, saveSession, clearSession } from './token.store';
import { disconnectSocket } from './socket.io';

const baseURL = `${import.meta.env.VITE_BASE_URL_API}/api`;

/**
 * Sin timeout, una petición que se queda colgada (gateway sin respuesta, socket
 * abierto del otro lado) dejaba el spinner de la vista girando indefinidamente.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/** Exportaciones Excel/PDF y snapshots: el backend puede tardar bastante. */
export const EXPORT_TIMEOUT_MS = 180_000;

export const api = axios.create({ baseURL, timeout: REQUEST_TIMEOUT_MS });

export const authApi = axios.create({ baseURL, timeout: REQUEST_TIMEOUT_MS });

export const AUTH_ENDPOINTS = [
    '/auth',
    '/auth/login',
    '/auth/refresh',
    '/auth/logout',
    '/auth/logout-all',
    '/auth/recover',
];

export const isAuthEndpoint = (url: string | undefined): boolean =>
    AUTH_ENDPOINTS.some((path) => url === path || url === `${path}/`);

export const getErrorPayload = (error: unknown): any => {
    if (axios.isAxiosError(error)) {
        return (error as AxiosError).response?.data;
    }
    return undefined;
};

let refreshPromise: Promise<string> | null = null;
let proactiveRefreshFailedFor: string | null = null;

export const forceLogout = (): void => {
    // Sesión inválida (401 sin refresh posible): cerrar también el WebSocket.
    disconnectSocket();
    clearSession();
    refreshPromise = null;
    proactiveRefreshFailedFor = null;
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.replace('/login');
    }
};

const performRefresh = async (): Promise<string> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
    }

    const { data } = await authApi.post<BaseResponseLogin>('/auth/refresh', { refreshToken });
    const accessToken = data?.accessToken || data?.token;

    if (!accessToken || !data?.refreshToken) {
        throw new Error('La respuesta del refresh no trae un par de tokens válido');
    }

    saveSession({
        accessToken,
        refreshToken: data.refreshToken,
        expiresIn: Number(data.expiresIn) || 0,
    });

    proactiveRefreshFailedFor = null;
    return accessToken;
};

// Single-flight: si llegan varios 401 a la vez, una sola llamada al refresh y el resto espera esta promesa.
export const refreshSession = (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

// Si un refresh proactivo ya falló para este token, reintentarlo podría reenviar un refresh de un solo uso
// ya consumido y provocar la revocación de toda la familia de sesiones. No se reintenta.
export const shouldSkipRefresh = (): boolean => {
    const currentToken = getAccessToken();
    return Boolean(currentToken) && proactiveRefreshFailedFor === currentToken;
};

const resolveAccessToken = async (): Promise<string | null> => {
    const token = getAccessToken();

    if (!token) {
        return null;
    }

    if (!isAccessTokenExpiring() || shouldSkipRefresh()) {
        return token;
    }

    try {
        return await refreshSession();
    } catch {
        proactiveRefreshFailedFor = token;
        return token;
    }
};

api.interceptors.request.use(
    async (config) => {
        const token = await resolveAccessToken();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Un 401 solo significa "sesión revocada" si la petición iba autenticada. Un 401
 * sin token enviado es casi siempre una respuesta de la capa de infraestructura
 * (un forward-auth o un proxy delante de la app). Antes, ese caso cerraba la
 * sesión y expulsaba al usuario a /login, perdiendo todo su trabajo.
 */
export const isSessionRevoked = (error: AxiosError<unknown>): boolean => {
    if (error.response?.status !== 401) return false;
    const config = error.config as RetriableRequestConfig | undefined;
    return Boolean(config?.headers?.Authorization);
};

// -----------------------------------------------------------------------------
// Helpers de API.
//
// Antes estos helpers envolvían la llamada en `.catch(err => err.response?.data)`,
// de modo que un 502, un timeout o una caída de red RESOLVÍAN con `undefined` en
// lugar de rechazar. Las vistas interpretaban ese `undefined` como "no hay datos"
// o como éxito, cerrando diálogos tras operaciones que nunca ocurrieron.
//
// Ahora rechazan como hace axios. Cada vista decide qué mostrar; el toast global
// de error vive en error-feedback.ts (con deduplicación) para que nunca se
// acumulen avisos duplicados.
// -----------------------------------------------------------------------------

export const getDataApi = async (endpoint: string) => {
    const response = await api.get(endpoint);
    return response.data;
}

export const getDataFileApi = async (endpoint: string): Promise<Blob> => {
    const response = await api.get(endpoint, {
        responseType: 'blob',
        timeout: EXPORT_TIMEOUT_MS,
    });
    return response.data;
}

export const postDataFileGetApi = async (endpoint: string, data: any): Promise<Blob> => {
    const response = await api.post(endpoint, data, {
        responseType: 'blob',
        timeout: EXPORT_TIMEOUT_MS,
    });
    return response.data;
}

export const postDataApi = async (endpoint: string, data: any): Promise<BaseResponseLogin | BaseResponse | any> => {
    const response = await api.post(endpoint, data);
    return response.data;
}

export const postFilesDataApi = async (endpoint: string, formData: FormData): Promise<BaseResponseLogin | BaseResponse> => {
    const response = await api.put(endpoint, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const postDataFileApi = async (endpoint: string, data: any): Promise<Blob> => {
    const response = await api.post(endpoint, data, {
        responseType: 'blob',
        timeout: EXPORT_TIMEOUT_MS,
    });
    return response.data;
}

export const putDataApi = async (endpoint: string, data: any): Promise<BaseResponse> => {
    const response = await api.put(endpoint, data);
    return response.data;
}

export const deleteDataApi = async (endpoint: string): Promise<BaseResponse> => {
    const response = await api.delete(endpoint);
    return response.data;
}

// -----------------------------------------------------------------------------
// Helpers genéricos: se conservan para los servicios que ya tipan su respuesta.
// -----------------------------------------------------------------------------

export const getDataApiStrict = async <T>(endpoint: string): Promise<T> => {
    const response = await api.get<T>(endpoint);
    return response.data;
}

export const postDataApiStrict = async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await api.post<T>(endpoint, data);
    return response.data;
}

export const putDataApiStrict = async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await api.put<T>(endpoint, data);
    return response.data;
}

export const deleteDataApiStrict = async <T>(endpoint: string): Promise<T> => {
    const response = await api.delete<T>(endpoint);
    return response.data;
}

export type RetriableRequestConfig = InternalAxiosRequestConfig & { _retried?: boolean };
