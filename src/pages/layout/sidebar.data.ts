import { BarChart3, Users, FileText, Package, ShoppingCart, User } from "lucide-react"

// Definición de los elementos del menú
export const menuItems = [
    {
        title: "Dashboard",
        icon: BarChart3,
        href: "/",
    },
    {
        title: "Clientes",
        icon: Users,
        href: "/clientes",
    },
    {
        title: "Facturas",
        icon: FileText,
        href: "/facturas",
    },
    {
        title: "Productos",
        icon: Package,
        href: "/productos",
    },
    {
        title: "Inventario",
        icon: Package,
        href: "/inventario",
    },
    {
        title: "Ventas",
        icon: ShoppingCart,
        href: "/ventas",
    },
    {
        title: "Usuarios",
        icon: User,
        href: "/usuarios",
    },
]