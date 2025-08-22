import { BarChart3, Users, FileText, Package, User } from "lucide-react"
import { BsCash } from "react-icons/bs";
import { MdAccountBalance, MdOutlineInventory2, MdOutlineMessage } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";

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
        title: "Inventario",
        icon: MdOutlineInventory2 ,
        href: "/inventario",
    },
    // {
    //     title: "Ventas",
    //     icon: ShoppingCart,
    //     href: "/ventas",
    // },
    {
        title: "Administración",
        icon: RiAdminLine ,
        href: "/administracion",
    },
    {
        title: "Cobranza",
        icon: MdOutlineMessage  ,
        href: "/cobranza",
    },
    {
        title: "Usuarios",
        icon: User,
        href: "/usuarios",
    },
]