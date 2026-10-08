import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { isRefreshAuthRejection, refreshSession, shouldSkipRefresh } from '@/services/base.service';
import {
    clearSession,
    getSessionSnapshot,
    isAccessTokenExpiring,
    subscribeToSession,
} from '@/services/token.store';
import { notifyError } from '@/lib/error-feedback';

export type SessionStatus = 'verifying' | 'authenticated' | 'anonymous' | 'error';

export interface SessionState {
    status: SessionStatus;
    /** Reintenta la renovación tras un estado de error. */
    retry: () => void;
}

/** Escalera de reintentos del refresh antes de dejar de insistir. */
const RETRY_DELAYS_MS = [0, 3000, 8000, 15000];

/** Reintento del guard mientras el refresh está en su ventana de calma. */
const SKIP_COOLDOWN_RECHECK_MS = 5_000;

/**
 * Estado de sesión para el guard de rutas.
 *
 * Antes el guard leía el claim exp del JWT en cada render y, al verlo vencido, llamaba
 * clearSession() y redirigía a /login sin intentar nunca el refresh. Eso expulsaba al
 * usuario cada TTL del access token, aunque el refresh token siguiera siendo válido y
 * el interceptor de axios tuviera un flujo de renovación completo.
 *
 * Ahora el store es reactivo y el guard intenta renovar antes de renderizar el Outlet:
 * 'verifying'     → hay token y se está renovando;
 * 'authenticated' → listo para renderizar;
 * 'anonymous'     → no hay token, o el servidor rechazó el refresh token;
 * 'error'         → se agotó la escalera de reintentos; la sesión NO se destruye,
 *                   pero se deja de insistir y se le ofrece al usuario reintentar.
 *
 * Un fallo transitorio (sin red, 5xx, throttling) nunca destruye la sesión: se reintenta
 * con backoff. Destruirla ahí volvía a expulsar al usuario por causas de infraestructura.
 * Cuando la escalera se agota no se mantiene el loader indefinidamente: antes eso dejaba
 * la app "colgada" en un spinner sin salida si el backend no respondía.
 */
export const useSession = (): SessionState => {
    const token = useSyncExternalStore(subscribeToSession, getSessionSnapshot, getSessionSnapshot);
    const [status, setStatus] = useState<SessionStatus>(token ? 'verifying' : 'anonymous');
    const [retryNonce, setRetryNonce] = useState(0);

    const retry = useCallback(() => setRetryNonce((nonce) => nonce + 1), []);

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
        let attempt = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        setStatus('verifying');

        const renew = () => {
            // Si el último refresh falló por autenticación, se respeta la ventana
            // de calma antes de volver a presentar el token: reenviarlo de
            // inmediato sería lo que dispara la detección de reuso.
            if (shouldSkipRefresh()) {
                timer = setTimeout(renew, SKIP_COOLDOWN_RECHECK_MS);
                return;
            }

            refreshSession().then(
                () => {
                    // saveSession emite el token nuevo, lo que dispara este efecto otra
                    // vez: para entonces isAccessTokenExpiring() es false y se estabiliza.
                    if (!cancelled) setStatus('authenticated');
                },
                (error) => {
                    if (cancelled) return;

                    // El servidor rechazó el refresh token: la sesión está revocada de
                    // verdad y no hay nada que reintentar.
                    if (isRefreshAuthRejection(error)) {
                        clearSession();
                        setStatus('anonymous');
                        return;
                    }

                    // Caída de red o backend lento. Se conserva la sesión y se reintenta:
                    // al reconectar, el usuario sigue dentro en lugar de volver al login.
                    if (attempt === 0) {
                        notifyError(error, 'No pudimos renovar tu sesión. Reintentando…');
                    }

                    // Escalera agotada: se detiene el bucle y se expone un estado de error
                    // con acciones, en lugar de dejar el loader girando para siempre.
                    if (attempt >= RETRY_DELAYS_MS.length) {
                        setStatus('error');
                        return;
                    }

                    const delay = RETRY_DELAYS_MS[attempt];
                    attempt += 1;
                    timer = setTimeout(renew, delay);
                }
            );
        };

        renew();

        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
        };
    }, [token, retryNonce]);

    return { status, retry };
};
