import { useMemo, useSyncExternalStore } from 'react';
import { jwtDecode } from 'jwt-decode';
import { IToken, ITokenExp } from '@/interfaces/user.interface';
import { getAccessToken, getSessionSnapshot, subscribeToSession } from '@/services/token.store';

/**
 * Decodifica el access token para leer datos de UI (nombre, rol).
 *
 * Deliberadamente NO se usa para decidir si la sesión está vigente: esa decisión la
 * toma useSession, que intenta un refresh antes de darla por cerrada. Un token
 * levemente vencido no equivale a una sesión muerta.
 */
export const decodeToken = (): ITokenExp | null => {
    const rawToken = getAccessToken();

    if (!rawToken) {
        return null;
    }

    try {
        const decoded = jwtDecode<IToken>(rawToken) as ITokenExp;
        decoded.expired = Boolean(decoded.exp && decoded.exp * 1000 < Date.now());
        return decoded;
    } catch {
        return null;
    }
};

export const getCurrentRole = (): string => decodeToken()?.rol ?? '';

/**
 * Datos del token para la UI (nombre, rol), suscritos al store.
 *
 * Leer decodeToken() durante el render sin suscribirse dejaba el nombre y el rol
 * congelados en el valor previo al refresh: el menú y el footer seguían mostrando
 * los datos del token viejo aunque la sesión ya se hubiera renovado.
 */
export const useTokenData = (): ITokenExp | null => {
    const token = useSyncExternalStore(subscribeToSession, getSessionSnapshot, getSessionSnapshot);

    return useMemo(() => (token ? decodeToken() : null), [token]);
};