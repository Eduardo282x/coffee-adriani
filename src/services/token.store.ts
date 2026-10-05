import { jwtDecode } from 'jwt-decode';
import { SessionTokens } from './base.interface';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_EXPIRES_AT_KEY = 'accessTokenExpiresAt';
const ACCESS_ISSUED_AT_KEY = 'accessTokenIssuedAt';
const LEGACY_TOKEN_KEY = 'token';

// sessionStorage y no localStorage: la sesión sobrevive a un F5 o a un deploy (que
// cambian el hash del bundle y obligan a recargar), pero se limpia al cerrar la
// pestaña. Con tokens solo en RAM (commit 261174e) cualquier recarga cerraba la sesión.
const readStorage = (key: string): string | null => {
    try {
        return sessionStorage.getItem(key);
    } catch {
        return null;
    }
};

const writeStorage = (key: string, value: string): void => {
    try {
        sessionStorage.setItem(key, value);
    } catch {
        // Modo privado o cuota llena: la sesión sigue viva solo en memoria.
    }
};

const removeStorage = (key: string): void => {
    try {
        sessionStorage.removeItem(key);
    } catch {
        // Ignorado a propósito.
    }
};

let inMemoryAccessToken: string | null = readStorage(ACCESS_TOKEN_KEY) ?? readStorage(LEGACY_TOKEN_KEY);
let inMemoryRefreshToken: string | null = readStorage(REFRESH_TOKEN_KEY);
let inMemoryExpiresAt: number = Number(readStorage(ACCESS_EXPIRES_AT_KEY)) || 0;
let inMemoryIssuedAt: number = Number(readStorage(ACCESS_ISSUED_AT_KEY)) || 0;

const listeners = new Set<() => void>();

const emit = (): void => {
    listeners.forEach((listener) => listener());
};

export const subscribeToSession = (listener: () => void): (() => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

// Un string es un snapshot estable para useSyncExternalStore: React lo compara por
// valor, así que solo un cambio real de token provoca un re-render.
export const getSessionSnapshot = (): string => inMemoryAccessToken ?? '';

export const getAccessToken = (): string | null => inMemoryAccessToken;

export const getRefreshToken = (): string | null => inMemoryRefreshToken;

export const getAccessTokenExpiresAt = (): number => inMemoryExpiresAt;

const readJwtExpiry = (token: string): number => {
    try {
        const { exp } = jwtDecode<{ exp?: number }>(token);
        return exp ? exp * 1000 : 0;
    } catch {
        return 0;
    }
};

export const saveSession = ({ accessToken, refreshToken, expiresIn }: SessionTokens): void => {
    const jwtExpiry = readJwtExpiry(accessToken);
    const expiresInSeconds = Number(expiresIn);

    inMemoryAccessToken = accessToken;
    inMemoryRefreshToken = refreshToken;
    // El claim exp del JWT es la fuente de verdad. Antes el guard de Layout leía exp y
    // el refresh proactivo leía expiresIn: dos relojes sin reconciliar, y el guard
    // expulsaba al usuario mientras el interceptor aún creía tener un token válido.
    inMemoryExpiresAt = jwtExpiry || (expiresInSeconds > 0 ? Date.now() + expiresInSeconds * 1000 : 0);
    inMemoryIssuedAt = Date.now();

    writeStorage(ACCESS_TOKEN_KEY, accessToken);
    writeStorage(REFRESH_TOKEN_KEY, refreshToken);
    writeStorage(LEGACY_TOKEN_KEY, accessToken);
    writeStorage(ACCESS_EXPIRES_AT_KEY, String(inMemoryExpiresAt));
    writeStorage(ACCESS_ISSUED_AT_KEY, String(inMemoryIssuedAt));

    emit();
};

export const clearSession = (): void => {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
    inMemoryExpiresAt = 0;
    inMemoryIssuedAt = 0;

    removeStorage(ACCESS_TOKEN_KEY);
    removeStorage(REFRESH_TOKEN_KEY);
    removeStorage(ACCESS_EXPIRES_AT_KEY);
    removeStorage(ACCESS_ISSUED_AT_KEY);
    removeStorage(LEGACY_TOKEN_KEY);

    emit();
};

const EXPIRY_SKEW_MS = 90 * 1000;

export const isAccessTokenExpiring = (skewMs: number = EXPIRY_SKEW_MS): boolean => {
    const expiresAt = getAccessTokenExpiresAt();

    if (!expiresAt) {
        // Sin información de expiración no hay margen para anticipar el refresh:
        // decide el backend y se reacciona al 401.
        return false;
    }

    // El margen nunca puede superar la mitad de la vida del token. Si el backend
    // devolviera un TTL menor que el skew, cada evaluación daría "expirando" y se
    // provocaría un bucle de refresh.
    const lifetime = Math.max(0, expiresAt - inMemoryIssuedAt);
    const skew = Math.min(skewMs, lifetime / 2);

    return expiresAt - skew <= Date.now();
};

export const hasSession = (): boolean => Boolean(getAccessToken());