import { jwtDecode } from 'jwt-decode';
import { IToken, ITokenExp } from '@/interfaces/user.interface';
import { getAccessToken } from '@/services/token.store';

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

export const validateToken = (): ITokenExp | null => {
    const decoded = decodeToken();

    if (decoded && decoded.expired) {
        console.warn("El token ha expirado.");
    }

    return decoded;
};

export const getCurrentRole = (): string => decodeToken()?.rol ?? '';
