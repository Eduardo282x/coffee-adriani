import { IColumns } from "@/components/table/table.interface"
import { formatNumberWithDots } from "@/hooks/formaters"
import { IInventory } from "@/interfaces/inventory.interface"
import { Trash2 } from "lucide-react"

// Datos de ejemplo para la tabla de facturas
export const facturasData = [
    {
        id: "FAC-001",
        cliente: "Juan Pérez",
        fecha: "10/04/2024",
        vencimiento: "10/05/2024",
        total: "$1,250.00",
        estado: "Pagada",
    },
    {
        id: "FAC-002",
        cliente: "María López",
        fecha: "15/04/2024",
        vencimiento: "15/05/2024",
        total: "$2,340.00",
        estado: "Pendiente",
    },
    {
        id: "FAC-003",
        cliente: "Carlos Rodríguez",
        fecha: "20/04/2024",
        vencimiento: "20/05/2024",
        total: "$3,450.00",
        estado: "Vencida",
    },
    {
        id: "FAC-004",
        cliente: "Ana Martínez",
        fecha: "25/04/2024",
        vencimiento: "25/05/2024",
        total: "$1,870.00",
        estado: "Pagada",
    },
    {
        id: "FAC-005",
        cliente: "Pedro Sánchez",
        fecha: "30/04/2024",
        vencimiento: "30/05/2024",
        total: "$2,560.00",
        estado: "Pendiente",
    },
    {
        id: "FAC-006",
        cliente: "Laura García",
        fecha: "05/05/2024",
        vencimiento: "05/06/2024",
        total: "$3,210.00",
        estado: "Pendiente",
    },
    {
        id: "FAC-007",
        cliente: "Miguel Fernández",
        fecha: "10/05/2024",
        vencimiento: "10/06/2024",
        total: "$1,980.00",
        estado: "Pagada",
    },
    {
        id: "FAC-008",
        cliente: "Sofía Gómez",
        fecha: "15/05/2024",
        vencimiento: "15/06/2024",
        total: "$2,740.00",
        estado: "Pendiente",
    },
]

export const productColumns: IColumns<IInventory>[] = [
    {
        column: 'name',
        label: 'Producto',
        element: (data: IInventory) => `${data.product.name} - ${data.product.presentation}`,
        orderBy: '',
        className: (data: IInventory) => data.id > 1 ? 'w-[20rem]' : 'w-[20rem]'
    },
    {
        column: 'name',
        label: 'Precio',
        element: (data: IInventory) => formatNumberWithDots(data.product.price, '', ',00 $'),
        orderBy: '',
    },
    {
        column: 'name',
        label: 'Cantidad',
        element: () => `0`,
        orderBy: '',
    },
    {
        column: 'name',
        label: 'Subtotal',
        element: () => `0`,
        orderBy: '',
    },
    {
        column: '',
        label: 'Eliminar',
        element: () => '',
        orderBy: '',
        icon: true,
        optionActions: [
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
]