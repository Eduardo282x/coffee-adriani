import type { LucideIcon } from "lucide-react"
import { BarChart3, Users, FileText, Package, User, Truck } from "lucide-react"
import type { IconType } from "react-icons"
import { BsCash } from "react-icons/bs"
import { FaBuilding } from "react-icons/fa6"
import { MdAccountBalance, MdOutlineInventory2, MdOutlineMessage } from "react-icons/md"
import { RiAdminLine } from "react-icons/ri"

export interface MenuItem {
    title: string
    icon: LucideIcon | IconType
    href: string
}

export interface MenuSection {
    label: string
    items: MenuItem[]
}

export const menuSections: MenuSection[] = [
    {
        label: "Principal",
        items: [
            { title: "Dashboard", icon: BarChart3, href: "/" },
            { title: "Facturas", icon: FileText, href: "/facturas" },
        ],
    },
    {
        label: "General",
        items: [
            { title: "Clientes", icon: Users, href: "/clientes" },
            { title: "Cobranza", icon: MdOutlineMessage, href: "/cobranza" },
        ],
    },
    {
        label: "Administración",
        items: [
            { title: "Pagos", icon: BsCash, href: "/pagos" },
            { title: "Empresa", icon: FaBuilding, href: "/empresa" },
            { title: "Proveedores", icon: Truck, href: "/proveedores" },
        ],
    },
    {
        label: "Inventario",
        items: [
            { title: "Inventario", icon: MdOutlineInventory2, href: "/inventario" },
            { title: "Productos", icon: Package, href: "/productos" },
        ],
    },
    {
        label: "Finanzas",
        items: [
            { title: "Administración", icon: RiAdminLine, href: "/administracion" },
        ],
    },
    {
        label: "Configuración",
        items: [
            { title: "Cuentas de pago", icon: MdAccountBalance, href: "/cuentas-pago" },
            { title: "Usuarios", icon: User, href: "/usuarios" },
        ],
    },
]