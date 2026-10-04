import { SessionTokens } from './base.interface';

// Variables en memoria (RAM) para mantener la sesión de forma segura
let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;
let inMemoryLegacyToken: string | null = null;
let inMemoryExpiresAt: number = 0;

export const getAccessToken = (): string | null => inMemoryAccessToken ?? inMemoryLegacyToken;

export const getRefreshToken = (): string | null => inMemoryRefreshToken;

export const getAccessTokenExpiresAt = (): number => inMemoryExpiresAt;

export const saveSession = ({ accessToken, refreshToken, expiresIn }: SessionTokens): void => {
    inMemoryAccessToken = accessToken;
    inMemoryRefreshToken = refreshToken;
    inMemoryLegacyToken = accessToken;

    const expiresInSeconds = Number(expiresIn);
    inMemoryExpiresAt = expiresInSeconds > 0 ? Date.now() + expiresInSeconds * 1000 : 0;
};

export const clearSession = (): void => {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
    inMemoryLegacyToken = null;
    inMemoryExpiresAt = 0;
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