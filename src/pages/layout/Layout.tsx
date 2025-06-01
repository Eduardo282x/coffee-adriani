import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './Sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { validateToken } from '@/hooks/authtenticate';
import { useEffect } from 'react';

export const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const getTokenDecode = validateToken();
        if (!getTokenDecode || getTokenDecode.expired) {
            navigate('/login')
        }
    }, [location])


    return (
        <div className="h-full w-full">
            <SidebarProvider>
                <AppSidebar />
                {/* <div className="w-full h-full bg-[#6f4e37]"> */}
                {/* <div className="w-full h-full bg-[#ebe0d2]"> */}
                <div className="w-full h-full bg-[#ebe0d2] overflow-hidden">
                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    )
}
