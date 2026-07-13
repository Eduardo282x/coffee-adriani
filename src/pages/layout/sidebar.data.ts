import type { LucideIcon } from "lucide-react"
import { BarChart3, Users, FileText, User, Truck } from "lucide-react"
import type { IconType } from "react-icons"
import { BsCash } from "react-icons/bs"
import { FaBuilding } from "react-icons/fa6"
import { MdAccountBalance, MdOutlineMessage } from "react-icons/md"
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
            { title: "Proveedores", icon: Truck, href: "/proveedores" },
            { title: "Empresa", icon: FaBuilding, href: "/empresa" },
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