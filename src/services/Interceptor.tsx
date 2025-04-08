/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './base.service';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useAxiosInterceptor = () => {
    const isValidMessage = (msg: any) => {
        return typeof msg === 'string' && msg.trim().length > 2;
    };

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => {
                if (['post', 'put', 'delete'].includes(response.config.method || '')) {
                    const message = response.data;
                    if (isValidMessage(message.message)) {
                        toast.custom(<Snackbar success={message.success} message={message.message} />, {
                            duration: 1500,
                            position: 'bottom-center'
                        });
                    }
                }
                return response;
            },
            (error) => {
                if (['post', 'put', 'delete'].includes(error.config?.method || '')) {
                    const message = error.response?.data;
                    if (isValidMessage(message?.message)) {
                        toast.custom(<Snackbar success={message.success} message={message.message} />, {
                            duration: 1500,
                            position: 'bottom-center'
                        });
                    }
                }
                return Promise.reject(error);
            }
        );

        // Limpia el interceptor al desmontar
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return null;
}
