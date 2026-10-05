/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, forceLogout, isAuthEndpoint, isRefreshAuthRejection, isSessionRevoked, refreshSession, RetriableRequestConfig, shouldSkipRefresh } from './base.service';
import { getRefreshToken } from './token.store';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { notifyError } from '@/lib/error-feedback';

const MUTATING_METHODS = ['post', 'put', 'delete'];

const IDEMPOTENT_METHODS = ['get', 'head', 'options'];

/**
 * La sesión sigue viva: no se pudo renovar ahora mismo. El mensaje por defecto de un 401
 * ("vuelve a iniciar sesión") sería engañoso aquí, porque el usuario no tiene que hacer
 * nada salvo reintentar.
 */
const RENEW_FAILED_MESSAGE = 'No pudimos renovar tu sesión. Revisá tu conexión e intentá de nuevo.';

const isValidMessage = (msg: any) => {
    return typeof msg === 'string' && msg.trim().length > 2;
};

const showMessage = (payload: any) => {
    if (isValidMessage(payload?.message)) {
        toast.custom(<Snackbar success={payload.success} message={payload.message} />, {
            duration: 1500,
            position: 'bottom-center'
        });
    }
};

export const useAxiosInterceptor = () => {
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => {
                if (MUTATING_METHODS.includes(response.config.method || '')) {
                    showMessage(response.data);
                }
                return response;
            },
            async (error) => {
                const original = error.config as RetriableRequestConfig | undefined;
                const status = error.response?.status;

                // El refresh token es de un solo uso: un solo intento, centralizado y con single-flight.
                const canRetry =
                    status === 401 &&
                    Boolean(original) &&
                    !original?._retried &&
                    !isAuthEndpoint(original?.url) &&
                    !shouldSkipRefresh();

                if (canRetry && original) {
                    original._retried = true;

                    let accessToken: string;

                    try {
                        accessToken = await refreshSession();
                    } catch (refreshError) {
                        // Solo un 4xx del endpoint de refresh significa token revocado de
                        // verdad. Ante un fallo transitorio (red caída, 502, timeout) la
                        // sesión sigue viva en el servidor: se avisa y el usuario continúa
                        // trabajando, y shouldSkipRefresh() deja reintentar tras el cooldown.
                        if (isRefreshAuthRejection(refreshError)) {
                            forceLogout();
                        } else {
                            notifyError(error, RENEW_FAILED_MESSAGE);
                        }

                        return Promise.reject(error);
                    }

                    // Un 401 en un POST/PUT/DELETE puede venir de una regla de negocio y
                    // no del token. Reejecutarlo duplicaría la operación, así que solo se
                    // renueva el token para el próximo intento y el original se rechaza.
                    if (!IDEMPOTENT_METHODS.includes((original.method || 'get').toLowerCase())) {
                        notifyError(error, RENEW_FAILED_MESSAGE);
                        return Promise.reject(error);
                    }

                    original.headers.Authorization = accessToken;
                    return await api(original);
                }

                // Solo un 401 de una petición autenticada significa sesión revocada. Un 401
                // sin token (respuesta de un proxy o de un forward-auth) se reporta como
                // error normal: cerrar sesión ahí expulsaba al usuario sin motivo.
                if (isSessionRevoked(error) && !isAuthEndpoint(original?.url)) {
                    forceLogout();
                    return Promise.reject(error);
                }

                // A partir de aquí el error es visible. Si hay un refresh token vigente el
                // 401 no fue una revocación, sino un token vencido sin renovar: se avisa
                // sin cerrar sesión. notifyError deduplica el mensaje, así que no se
                // acumulan avisos cuando varios requests fallan a la vez.
                const fallback = getRefreshToken() ? RENEW_FAILED_MESSAGE : undefined;
                notifyError(error, fallback);

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return null;
}
