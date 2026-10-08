/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BaseResponseLogin, BaseResponse } from './base.interface';
import { getAccessToken, getRefreshToken, isAccessTokenExpiring, saveSession, clearSession } from './token.store';
import { disconnectSocket, reconnectSocket, setTokenRefresher } from './socket.io';
import { broadcastLogout, broadcastSession, subscribeToSessionChannel } from './session-channel';

const RETRYABLE_REFRESH_STATUS = [408, 429];

const baseURL = `${import.meta.env.VITE_BASE_URL_API}/api`;

/**
 * Sin timeout, una petición que se queda colgada (gateway sin respuesta, socket
 * abierto del otro lado) dejaba el spinner de la vista girando indefinidamente.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * El refresh está en el camino crítico de cada 401 y del guard de ruta: si se cuelga
 * 30s, el usuario ve el spinner del login bloqueado medio minuto.
 */
const AUTH_TIMEOUT_MS = 10_000;

/** Exportaciones Excel/PDF y snapshots: el backend puede tardar bastante. */
export const EXPORT_TIMEOUT_MS = 180_000;

export const api = axios.create({ baseURL, timeout: REQUEST_TIMEOUT_MS });

export const authApi = axios.create({ baseURL, timeout: AUTH_TIMEOUT_MS });

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

/**
 * Distingue "el refresh token está revocado" de "el refresh no se pudo ejecutar".
 *
 * Solo una respuesta 4xx del endpoint de refresh significa que el servidor rechazó el
 * token. Sin respuesta (caída de red, DNS, CORS), timeout, 5xx o throttling, la sesión
 * sigue siendo válida en el servidor: cerrar la sesión ante un 502 tira la sesión y el
 * trabajo del usuario por un problema de infraestructura.
 */
export const isRefreshAuthRejection = (error: unknown): boolean => {
    if (!axios.isAxiosError(error)) return false;
    const status = error.response?.status;

    // Sin respuesta HTTP el refresh ni siquiera llegó a evaluarse en el servidor.
    if (typeof status !== 'number') return false;

    // 408 y 429 son transitorios: /auth también tiene throttling, y un rate limit no
    // invalida el refresh token.
    if (RETRYABLE_REFRESH_STATUS.includes(status)) return false;

    return status >= 400 && status < 500;
};

let refreshPromise: Promise<string> | null = null;
let proactiveRefreshFailedFor: string | null = null;
let proactiveRefreshFailedAt = 0;
let refreshRejectedFor: string | null = null;

/**
 * Ventana de calma tras un refresh proactivo fallido. Bloquear el refresh de forma
 * permanente convertía cualquier fallo de red en un cierre de sesión inevitable: el
 * siguiente 401 ya no tenía refresh disponible y caía directo en forceLogout(). El
 * bloqueo debe ser transitorio, solo para no reenviar un refresh de un solo uso ya
 * consumido en bucle cerrado.
 */
const REFRESH_RETRY_COOLDOWN_MS = 15_000;

const applyLogout = (broadcast: boolean): void => {
    // Sesión inválida (401 sin refresh posible): cerrar también el WebSocket.
    if (broadcast) {
        broadcastLogout();
    }

    disconnectSocket();
    clearSession();
    refreshPromise = null;
    proactiveRefreshFailedFor = null;
    proactiveRefreshFailedAt = 0;
    refreshRejectedFor = null;
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.replace('/login');
    }
};

export const forceLogout = (): void => applyLogout(true);

let sessionChannelReady = false;

/**
 * Escucha los cambios de sesión de otras pestañas: adopta el par de tokens
 * renovado por otra pestaña (evita que esta reintente con uno ya rotado) y
 * propaga el cierre de sesión. Idempotente: se registra una sola vez.
 */
export const initSessionChannel = (): void => {
    if (sessionChannelReady) {
        return;
    }

    sessionChannelReady = true;

    subscribeToSessionChannel({
        onSession: (tokens) => {
            // Solo se adopta si difiere del actual: evita re-renders y no pisa un
            // token más nuevo ya en memoria.
            if (tokens.accessToken && tokens.accessToken !== getAccessToken()) {
                saveSession(tokens);
                reconnectSocket();
            }
        },
        onLogout: () => applyLogout(false),
    });
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

    const expiresIn = Number(data.expiresIn) || 0;

    saveSession({
        accessToken,
        refreshToken: data.refreshToken,
        expiresIn,
    });
    // Otras pestañas pueden compartir el mismo refresh token de un solo uso:
    // se les comunica el par nuevo para que no reintenten con el ya consumido.
    broadcastSession({ accessToken, refreshToken: data.refreshToken, expiresIn });
    // El socket se autentica en el handshake: sin reconectar seguiría con el token viejo.
    reconnectSocket();

    proactiveRefreshFailedFor = null;
    proactiveRefreshFailedAt = 0;
    refreshRejectedFor = null;
    return accessToken;
};

type RefreshLockManager = {
    request: <T>(name: string, callback: () => Promise<T>) => Promise<T>;
};

/**
 * Serializa el refresh entre pestañas con la Web Locks API. Sin esto, dos pestañas
 * que comparten el mismo refresh token pueden llamar a /auth/refresh a la vez.
 * Al obtener el lock se revalida: si otra pestaña ya renovó, no hace falta repetir.
 */
const runRefresh = async (): Promise<string> => {
    const locks = typeof navigator !== 'undefined'
        ? (navigator as Navigator & { locks?: RefreshLockManager }).locks
        : undefined;

    if (!locks?.request) {
        return performRefresh();
    }

    return locks.request('cafe-adriani-refresh', async () => {
        const current = getAccessToken();
        if (current && !isAccessTokenExpiring()) {
            return current;
        }
        return performRefresh();
    });
};

// Single-flight: si llegan varios 401 a la vez, una sola llamada al refresh y el resto espera esta promesa.
export const refreshSession = (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = runRefresh().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
};

// El socket renueva el access token antes de reconectar tras un rechazo del gateway
// (import perezoso vía hook para no crear un ciclo socket.io <-> base.service).
setTokenRefresher(refreshSession);

// Si un refresh proactivo acaba de fallar para este token, se espera la ventana de calma
// antes de volver a intentarlo: reenviar de inmediato un refresh de un solo uso ya
// consumido podría provocar la revocación de toda la familia de sesiones.
export const shouldSkipRefresh = (): boolean => {
    const currentToken = getAccessToken();
    if (!currentToken || proactiveRefreshFailedFor !== currentToken) return false;

    return Date.now() - proactiveRefreshFailedAt < REFRESH_RETRY_COOLDOWN_MS;
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
    } catch (error) {
        // Solo un rechazo de autenticación bloquea los reintentos. Un fallo transitorio
        // devuelve el token viejo sin armar la trampa, así el 401 posterior puede
        // reintentar el refresh una vez pasado el cooldown.
        if (isRefreshAuthRejection(error)) {
            proactiveRefreshFailedFor = token;
            proactiveRefreshFailedAt = Date.now();
            refreshRejectedFor = token;
        }

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
 *
 * Tampoco es revocación cuando queda un refresh token válido y el último refresh
 * falló por causas transitorias: ese 401 se explica por el access token vencido,
 * no por una sesión invalidada. Cerrarla ahí era lo que sacaba a los usuarios al
 * login cada vez que el backend devolvía un 502 o tardaba en responder.
 */
export const isSessionRevoked = (error: AxiosError<unknown>): boolean => {
    if (error.response?.status !== 401) return false;
    const config = error.config as RetriableRequestConfig | undefined;
    if (!config?.headers?.Authorization) return false;

    if (getRefreshToken() && refreshRejectedFor !== getAccessToken()) return false;

    return true;
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
