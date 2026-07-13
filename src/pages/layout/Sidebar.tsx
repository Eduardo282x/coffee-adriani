import { Settings, LogOut, ChevronDown, User2, User } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useLocation, useNavigate } from 'react-router'
import { menuSections } from "./sidebar.data"
import { useEffect, useState } from "react"
import { validateToken } from "@/hooks/authtenticate"
import { ITokenExp } from "@/interfaces/user.interface";
import { FaCoffee } from "react-icons/fa";

export const AppSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<ITokenExp>()

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token');
    }

    const goProfile = () => {
        navigate('/perfil')
    }

    useEffect(() => { 
        if (validateToken()) {
            setUserData(validateToken() as ITokenExp)
        }
    }, [])

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
                {menuSections.map((section, index) => (
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
                                        <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
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
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Configuración</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
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