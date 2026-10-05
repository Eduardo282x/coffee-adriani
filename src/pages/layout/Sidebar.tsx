import { LogOut, ChevronDown, User2, User } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useLocation, useNavigate } from 'react-router'
import { canAccessMenuItem, menuSections } from "./sidebar.data"
import { useState } from "react"
import { useTokenData } from "@/hooks/authtenticate"
import { FaCoffee } from "react-icons/fa";
import { logout } from "@/services/auth.service";

export const AppSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const userData = useTokenData();

    const goProfile = () => {
        navigate('/perfil')
    }

    const sections = menuSections
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => canAccessMenuItem(item, userData?.rol ?? '')),
        }))
        .filter((section) => section.items.length > 0);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);

        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
            navigate('/login', { replace: true });
        }
    }

    return (
        <Sidebar>
            <SidebarHeader className="bg-[#6f4e37] text-white border-b border-[#ebe0d2]">
                <div className="flex items-center gap-3 px-2 py-3 text-xl">
                    <div className="p-1 rounded-md bg-[#ebe0d2] text-[#6f4e37]">
                        <FaCoffee />
                    </div>
                    <div className="font-semibold">Sistema de Gestión</div>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-[#6f4e37] text-gray-300 p-1">
                {sections.map((section, index) => (
                    <div key={section.label}>
                        {index > 0 && (
                            <div className="border-t border-white/10 my-1" />
                        )}
                        <div className="text-[10px] uppercase tracking-widest text-white/50 font-semibold px-2 mb-1">
                            {section.label}
                        </div>
                        <SidebarMenu>
                            {section.items.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={item.title}>
                                        <Link to={item.href}>
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </div>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    <span>{userData?.name} {userData?.lastName}</span>
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-60">
                                <DropdownMenuItem onClick={goProfile}>
                                    <User2 className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Configuración</span>
                                </DropdownMenuItem> */}
                                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
