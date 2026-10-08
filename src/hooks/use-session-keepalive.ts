import { useEffect } from 'react';
import { refreshSession } from '@/services/base.service';
import { getAccessToken, isAccessTokenExpiring } from '@/services/token.store';

/**
 * Renueva el access token al recuperar el foco/visibilidad.
 *
 * Mientras la pestaña está en segundo plano o el equipo suspendido no hay actividad:
 * el access token (15 min) vence y el socket no lo renueva. Al volver, la primera
 * petición pagaba el refresh (latencia percibida) y el socket podía reconectar con
 * un token vencido. Este refresco best-effort adelanta el trabajo; si falla, el
 * interceptor y useSession siguen siendo la red de seguridad y la sesión no se pierde.
 */
export const useSessionKeepAlive = (): void => {
    useEffect(() => {
        const refreshIfNeeded = () => {
            if (document.visibilityState !== 'visible') return;
            if (!getAccessToken() || !isAccessTokenExpiring()) return;

            // Single-flight: si useSession o el interceptor ya están refrescando,
            // esta llamada se une a la misma promesa.
            refreshSession().catch(() => {
                // Best-effort: no se notifica aquí para no taparlo con el flujo normal.
            });
        };

        document.addEventListener('visibilitychange', refreshIfNeeded);
        window.addEventListener('focus', refreshIfNeeded);

        return () => {
            document.removeEventListener('visibilitychange', refreshIfNeeded);
            window.removeEventListener('focus', refreshIfNeeded);
        };
    }, []);
};
