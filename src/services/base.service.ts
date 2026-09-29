/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BaseResponseLogin, BaseResponse } from './base.interface';
import { getAccessToken, getRefreshToken, isAccessTokenExpiring, saveSession, clearSession } from './token.store';
import { disconnectSocket } from './socket.io';

const baseURL = `${import.meta.env.VITE_BASE_URL_API}/api`;

export const api = axios.create({ baseURL });

export const authApi = axios.create({ baseURL });

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

export const getDataApi = (endpoint: string) => {
    return api.get(endpoint).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data;
    })
}

export const getDataFileApi = (endpoint: string) => {
    return api.get(endpoint, {
        responseType: 'blob',
    },).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data;
    })
}

export const postDataFileGetApi = async (endpoint: string, data: any) => {
    return await api.post(endpoint, data, {
        responseType: 'blob'
    })
        .catch((err) => {
            return err.response?.data;
        })
}

export const postDataApi = async (endpoint: string, data: any): Promise<BaseResponseLogin | BaseResponse | any> => {
    return await api.post(endpoint, data).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data;
    })
}

export const postFilesDataApi = async (endpoint: string, formData: FormData): Promise<BaseResponseLogin | BaseResponse> => {
    return await api.put(endpoint, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data;
    })
}
export const postDataFileApi = async (endpoint: string, data: any): Promise<BaseResponseLogin | BaseResponse> => {
    return await api.post(endpoint, data, { responseType: 'blob' }).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data;
    })
}

export const putDataApi = async (endpoint: string, data: any): Promise<BaseResponse> => {
    return await api.put(endpoint, data).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data;
    })
}

export const deleteDataApi = async (endpoint: string): Promise<BaseResponse> => {
    return await api.delete(endpoint).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data;
    })
}

// Helpers estrictos: a diferencia de los anteriores, rechazan la promesa en lugar de devolver el cuerpo
// del error. Se usan en los flujos que necesitan ramificar según el resultado (inventario, asociación de
// pagos, autenticación) porque los diálogos no deben cerrarse como si la operación hubiera sido exitosa.

const rejectWith = async <T>(promise: Promise<T>): Promise<T> => {
    return promise.catch((error) => {
        return Promise.reject(error);
    });
}

export const getDataApiStrict = async <T>(endpoint: string): Promise<T> => {
    const response = await rejectWith(api.get<T>(endpoint));
    return response.data;
}

export const postDataApiStrict = async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await rejectWith(api.post<T>(endpoint, data));
    return response.data;
}

export const putDataApiStrict = async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await rejectWith(api.put<T>(endpoint, data));
    return response.data;
}

export const deleteDataApiStrict = async <T>(endpoint: string): Promise<T> => {
    const response = await rejectWith(api.delete<T>(endpoint));
    return response.data;
}

export type RetriableRequestConfig = InternalAxiosRequestConfig & { _retried?: boolean };
