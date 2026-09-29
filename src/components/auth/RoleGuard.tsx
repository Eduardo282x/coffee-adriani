import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { getCurrentRole } from '@/hooks/authtenticate';

interface RoleGuardProps {
    roles: string[]
    children: ReactNode
}

// Comodidad de UI, no seguridad: el backend sigue siendo quien responde con 403.
export const RoleGuard = ({ roles, children }: RoleGuardProps) => {
    const role = getCurrentRole();

    if (!roles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
