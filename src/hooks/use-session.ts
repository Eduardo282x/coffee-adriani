import { useEffect, useState, useSyncExternalStore } from 'react';
import { refreshSession } from '@/services/base.service';
import {
    clearSession,
    getSessionSnapshot,
    isAccessTokenExpiring,
    subscribeToSession,
} from '@/services/token.store';

export type SessionStatus = 'verifying' | 'authenticated' | 'anonymous';

/**
 * Estado de sesión para el guard de rutas.
 *
 * Antes el guard leía el claim exp del JWT en cada render y, al verlo vencido,
 * llamaba clearSession() y redirigía a /login sin intentar nunca el refresh. Eso
 * expulsaba al usuario cada TTL del access token, aunque el refresh token siguiera
 * siendo válido y el interceptor de axios tuviera un flujo de renovación completo.
 *
 * Ahora el store es reactivo y el guard intenta renovar antes de renderear el Outlet:
 * 'verifying'    → hay token y se está renovando;
 * 'authenticated'→ listo para renderizar;
 * 'anonymous'    → no hay token, o el refresh fue rechazado (token revocado de verdad).
 */
export const useSession = (): SessionStatus => {
    const token = useSyncExternalStore(subscribeToSession, getSessionSnapshot, getSessionSnapshot);
    const [status, setStatus] = useState<SessionStatus>(token ? 'verifying' : 'anonymous');

    useEffect(() => {
        if (!token) {
            setStatus('anonymous');
            return;
        }

        if (!isAccessTokenExpiring()) {
            setStatus('authenticated');
            return;
        }

        let cancelled = false;
        setStatus('verifying');

        refreshSession().then(
            () => {
                // saveSession emite el token nuevo, lo que dispara este efecto otra vez:
                // para entonces isAccessTokenExpiring() es false y el estado se estabiliza.
                if (!cancelled) setStatus('authenticated');
            },
            () => {
                if (cancelled) return;
                clearSession();
                setStatus('anonymous');
            }
        );

        return () => {
            cancelled = true;
        };
    }, [token]);

    return status;
};