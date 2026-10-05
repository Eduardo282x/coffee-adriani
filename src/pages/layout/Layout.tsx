import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './Sidebar'
import { Navigate, Outlet } from 'react-router'
import { ScreenLoader } from '@/components/loaders/ScreenLoader'
import { useSession } from '@/hooks/use-session'

export const Layout = () => {
    const session = useSession();

    // Guard declarativo: antes el <Outlet /> se renderizaba igual y las páginas protegidas
    // lanzaban sus peticiones sin token, porque el redirect ocurría en un useEffect post-pintado.
    // El orden importa: primero se resuelve la sesión (incluido el refresh), después se decide
    // si hay algo que renderizar. Sin ese paso intermedio, un token vencido expulsaba al
    // usuario antes de que el interceptor tuviera oportunidad de renovarlo.
    if (session === 'verifying') {
        return <ScreenLoader />;
    }

    if (session === 'anonymous') {
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