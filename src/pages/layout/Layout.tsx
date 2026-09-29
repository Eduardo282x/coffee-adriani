import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './Sidebar'
import { Navigate, Outlet } from 'react-router'
import { decodeToken } from '@/hooks/authtenticate';
import { clearSession } from '@/services/token.store';
import { useEffect } from 'react';

export const Layout = () => {
    const tokenData = decodeToken();
    const isAuthenticated = Boolean(tokenData && !tokenData.expired);

    useEffect(() => {
        if (!isAuthenticated) {
            clearSession();
        }
    }, [isAuthenticated]);

    // Guard declarativo: antes el <Outlet /> se renderizaba igual y las páginas protegidas
    // lanzaban sus peticiones sin token, porque el redirect ocurría en un useEffect post-pintado.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="h-full w-full">
            <SidebarProvider className="h-full">
                <AppSidebar />
                <div className="w-full h-full bg-[#ebe0d2] overflow-hidden">
                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    )
}
