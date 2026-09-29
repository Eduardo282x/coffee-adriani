import { SessionTokens } from './base.interface';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_EXPIRES_AT_KEY = 'accessTokenExpiresAt';
const LEGACY_TOKEN_KEY = 'token';

const readStorage = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const writeStorage = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Almacenamiento no disponible (modo privado / cuota llena): la sesión vive solo en memoria.
    }
};

const removeStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch {
        // Ignorado a propósito.
    }
};

export const getAccessToken = (): string | null => readStorage(ACCESS_TOKEN_KEY) ?? readStorage(LEGACY_TOKEN_KEY);

export const getRefreshToken = (): string | null => readStorage(REFRESH_TOKEN_KEY);

export const getAccessTokenExpiresAt = (): number => Number(readStorage(ACCESS_EXPIRES_AT_KEY)) || 0;

export const saveSession = ({ accessToken, refreshToken, expiresIn }: SessionTokens): void => {
    writeStorage(ACCESS_TOKEN_KEY, accessToken);
    writeStorage(REFRESH_TOKEN_KEY, refreshToken);
    writeStorage(LEGACY_TOKEN_KEY, accessToken);

    const expiresInSeconds = Number(expiresIn);
    writeStorage(
        ACCESS_EXPIRES_AT_KEY,
        expiresInSeconds > 0 ? String(Date.now() + expiresInSeconds * 1000) : '0'
    );
};

export const clearSession = (): void => {
    removeStorage(ACCESS_TOKEN_KEY);
    removeStorage(REFRESH_TOKEN_KEY);
    removeStorage(ACCESS_EXPIRES_AT_KEY);
    removeStorage(LEGACY_TOKEN_KEY);
};

const EXPIRY_SKEW_MS = 60 * 1000;

export const isAccessTokenExpiring = (skewMs: number = EXPIRY_SKEW_MS): boolean => {
    const expiresAt = getAccessTokenExpiresAt();

    if (!expiresAt) {
        return false;
    }

    return expiresAt - skewMs <= Date.now();
};

export const hasSession = (): boolean => Boolean(getAccessToken());
