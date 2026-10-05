import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useTokenData } from '@/hooks/authtenticate';

interface RoleGuardProps {
    roles: string[]
    children: ReactNode
}

// Comodidad de UI, no seguridad: el backend sigue siendo quien responde con 403.
export const RoleGuard = ({ roles, children }: RoleGuardProps) => {
    // useTokenData en lugar de getCurrentRole(): leer el rol sin suscribirse al store lo
    // dejaba congelado en el token previo al refresh, con lo que un usuario podía ver
    // su menú como Administrador aunque el token renovado ya no lo fuera.
    const role = useTokenData()?.rol ?? '';

    if (!roles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
