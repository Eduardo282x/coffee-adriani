/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, forceLogout, isAuthEndpoint, isSessionRevoked, refreshSession, RetriableRequestConfig, shouldSkipRefresh } from './base.service';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { notifyError } from '@/lib/error-feedback';

const MUTATING_METHODS = ['post', 'put', 'delete'];

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

                    try {
                        const accessToken = await refreshSession();
                        original.headers.Authorization = accessToken;
                        return await api(original);
                    } catch {
                        // El refresh es de un solo uso: si falla, la sesión queda revocada.
                        // Se cierra sesión y se redirige, sin reintentar.
                        forceLogout();
                        return Promise.reject(error);
                    }
                }

                // Solo un 401 de una petición autenticada significa sesión revocada. Un 401
                // sin token (respuesta de un proxy o de un forward-auth) se reporta como
                // error normal: cerrar sesión ahí expulsaba al usuario sin motivo.
                if (isSessionRevoked(error) && !isAuthEndpoint(original?.url)) {
                    forceLogout();
                    return Promise.reject(error);
                }

                // A partir de aquí el error es visible. notifyError deduplica el mensaje,
                // así que no se acumulan avisos cuando varios requests fallan a la vez.
                notifyError(error);

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return null;
}
