import { useEffect, useState, useSyncExternalStore } from 'react';
import { isRefreshAuthRejection, refreshSession } from '@/services/base.service';
import {
    clearSession,
    getSessionSnapshot,
    isAccessTokenExpiring,
    subscribeToSession,
} from '@/services/token.store';
import { notifyError } from '@/lib/error-feedback';

export type SessionStatus = 'verifying' | 'authenticated' | 'anonymous';

/** Escalera de reintentos del refresh antes de dejar de insistir. */
const RETRY_DELAYS_MS = [0, 3000, 8000, 15000];

/** Ritmo sostenido una vez agotada la escalera, hasta que el backend responda. */
const RETRY_WHEN_BACK_MS = 15_000;

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
 * 'anonymous'     → no hay token, o el servidor rechazó el refresh token.
 *
 * Un fallo transitorio (sin red, 5xx, throttling) nunca destruye la sesión: se reintenta
 * con backoff. Destruirla ahí volvía a expulsar al usuario por causas de infraestructura.
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
        let attempt = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        setStatus('verifying');

        const renew = () => {
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

                    const delay = attempt < RETRY_DELAYS_MS.length
                        ? RETRY_DELAYS_MS[attempt]
                        : RETRY_WHEN_BACK_MS;

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
    }, [token]);

    return status;
};