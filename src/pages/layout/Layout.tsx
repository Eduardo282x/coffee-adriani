import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './Sidebar'
import { Outlet } from 'react-router'

export const Layout = () => {
    return (
        <div className="h-full w-full">
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full h-full ">
                    <Outlet />
                </div>
            </SidebarProvider>
        </div>
    )
}
