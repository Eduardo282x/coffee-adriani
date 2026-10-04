import { useEffect, useState } from 'react';

/**
 * `navigator.onLine` por sí solo no detecta una caída del backend ni un Wi-Fi
 * sin salida a internet, pero sí cubre el caso más frecuente (el equipo pierde
 * conectividad) y evita que el usuario pulse botones que no van a funcionar.
 */
export const useNetworkStatus = (): boolean => {
    const [isOnline, setIsOnline] = useState<boolean>(
        () => (typeof navigator === 'undefined' ? true : navigator.onLine)
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};
