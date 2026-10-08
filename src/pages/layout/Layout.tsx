import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './Sidebar'
import { Navigate, Outlet } from 'react-router'
import { ScreenLoader } from '@/components/loaders/ScreenLoader'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-session'
import { forceLogout } from '@/services/base.service'

export const Layout = () => {
    const { status, retry } = useSession();

    // Guard declarativo: antes el <Outlet /> se renderizaba igual y las páginas protegidas
    // lanzaban sus peticiones sin token, porque el redirect ocurría en un useEffect post-pintado.
    // El orden importa: primero se resuelve la sesión (incluido el refresh), después se decide
    // si hay algo que renderizar. Sin ese paso intermedio, un token vencido expulsaba al
    // usuario antes de que el interceptor tuviera oportunidad de renovarlo.
    if (status === 'verifying') {
        return <ScreenLoader />;
    }

    if (status === 'anonymous') {
        return <Navigate to="/login" replace />;
    }

    // Se agotaron los reintentos de renovación (backend caído o red intermitente). La
    // sesión NO se destruye, pero no se deja la app colgada en un spinner infinito: se
    // le ofrecen al usuario acciones explícitas.
    if (status === 'error') {
        return (
            <div className="h-full w-full bg-[#d2b082] flex items-center justify-center">
                <div className="bg-white border rounded-lg p-6 w-[90%] max-w-md text-center">
                    <p className="text-lg font-semibold text-[#6f4e37]">No pudimos renovar tu sesión</p>
                    <p className="text-sm text-gray-500 mt-2">
                        El servidor no respondió. Revisa tu conexión e inténtalo de nuevo; tu sesión
                        sigue activa.
                    </p>
                    <div className="flex flex-col gap-2 mt-4">
                        <Button variant="primary" className="w-full bg-[#6f4e37] hover:bg-[#6f4e37]/80 text-white" onClick={retry}>
                            Reintentar
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => forceLogout()}>
                            Cerrar sesión
                        </Button>
                    </div>
                </div>
            </div>
        );
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
