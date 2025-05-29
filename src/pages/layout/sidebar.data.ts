import { BarChart3, Users, FileText, Package, ShoppingCart, User } from "lucide-react"
import { BsCash } from "react-icons/bs";
import { MdAccountBalance } from "react-icons/md";

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
        title: "Pagos",
        icon: BsCash ,
        href: "/pagos",
    },
    {
        title: "Cuentas de pago",
        icon: MdAccountBalance,
        href: "/cuentas-pago",
    },
    {
        title: "Productos",
        icon: Package,
        href: "/productos",
    },
    {
        title: "Historia de productos",
        icon: Package,
        href: "/productos/historial",
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