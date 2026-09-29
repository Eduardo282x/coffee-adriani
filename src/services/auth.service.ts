import { authApi, api, getErrorPayload } from './base.service';
import { BaseResponse, BaseResponseLogin } from './base.interface';
import { clearSession, getAccessToken, getRefreshToken, saveSession } from './token.store';
import { connectSocket, disconnectSocket } from './socket.io';

export interface LoginBody {
    username: string;
    password: string;
}

export interface RecoverBody {
    username: string;
    password: string;
    currentPassword: string;
}

const persistSession = (data: BaseResponseLogin): void => {
    const accessToken = data?.accessToken || data?.token;

    if (!accessToken || !data?.refreshToken) {
        throw new Error('La respuesta del servidor no incluye los tokens de sesión');
    }

    saveSession({
        accessToken,
        refreshToken: data.refreshToken,
        expiresIn: Number(data.expiresIn) || 0,
    });
};

export const login = async (credentials: LoginBody): Promise<BaseResponseLogin> => {
    const { data } = await authApi.post<BaseResponseLogin>('/auth', credentials);
    persistSession(data);
    // Recién ahora hay token: el handshake usa el access token vigente vía el callback auth.
    connectSocket();
    return data;
};

export const recoverPassword = async (body: RecoverBody): Promise<BaseResponse> => {
    const { data } = await authApi.post<BaseResponse>('/auth/recover', body);
    return data;
};

export const logout = async (): Promise<BaseResponse | undefined> => {
    const refreshToken = getRefreshToken();
    // Se corta el WebSocket antes de revocar: si no, el servidor sigue viendo conectado
    // a un usuario que ya cerró sesión.
    disconnectSocket();
    clearSession();

    if (!refreshToken) {
        return undefined;
    }

    try {
        const { data } = await authApi.post<BaseResponse>('/auth/logout', { refreshToken });
        return data;
    } catch {
        // El logout local ya se ejecutó: un fallo al revocar en el servidor no debe bloquear la salida.
        return undefined;
    }
};

export const logoutAll = async (): Promise<BaseResponse> => {
    const token = getAccessToken();

    if (!token) {
        disconnectSocket();
        clearSession();
        throw new Error('No hay sesión activa');
    }

    const { data } = await api.post<BaseResponse>('/auth/logout-all', {}, {
        headers: { Authorization: token },
    });
    disconnectSocket();
    clearSession();
    return data;
};

export const extractAuthError = (error: unknown): string => {
    const payload = getErrorPayload(error);
    return typeof payload?.message === 'string' ? payload.message : 'No se pudo completar la operación.';
};
