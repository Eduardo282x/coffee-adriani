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
import { menuItems } from "./sidebar.data"
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

    useEffect(() => { 
        if (validateToken()) {
            setUserData(validateToken() as ITokenExp)
        }
    }, [])

    return (
        <Sidebar>
            <SidebarHeader className="bg-[#6f4e37] text-white">
                <div className="flex items-center gap-3 px-2 py-6 text-xl">
                    <div className="p-1 rounded-md bg-[#ebe0d2] text-[#6f4e37]">
                        <FaCoffee />
                    </div>
                    <div className="font-semibold">Sistema de Gestión</div>
                </div>
            </SidebarHeader>
            <div className="bg-[#ebe0d2] h-1">a</div>
            <SidebarContent className="bg-[#6f4e37] text-gray-300 p-2 ">
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild className="" isActive={location.pathname === item.href} tooltip={item.title}>
                                <Link to={item.href}>
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
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
                                <DropdownMenuItem>
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