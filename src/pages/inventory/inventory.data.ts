import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatDateTime, formatNumberWithDots } from "@/hooks/formaters";
import { IInventory } from "@/interfaces/inventory.interface";

export const inventoryColumns: IColumns<IInventory>[] = [
    {
        label: 'Nombre',
        column: 'product.name',
        element: (data: IInventory) => data.product.name,
        orderBy: '',
        icon: false,
    },
    {
        column: 'product.presentation',
        label: 'Presentación',
        element: (data: IInventory) => data.product.presentation,
        orderBy: '',
        icon: false,
    },
    {
        column: 'product.price',
        label: 'Precio Referencia',
        element: (data: IInventory) => formatNumberWithDots(data.product.price, '', ' $'),
        orderBy: '',
        icon: false,
    },
    {
        column: 'product.priceBs',
        label: 'Precio (Bs)',
        element: (data: IInventory) => formatNumberWithDots(data.product.priceBs, '', ' Bs'),
        orderBy: '',
        icon: false,
    },
    {
        column: 'product.priceUSD',
        label: 'Precio ($)',
        element: (data: IInventory) => formatNumberWithDots(data.product.priceUSD, '', ' $'),
        orderBy: '',
        icon: false,
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: IInventory) => data.quantity.toString(),
        orderBy: '',
        icon: false,
    }
]

export const extraColumn: IColumns<IInventory>[] = [
    {
        label: 'Movimiento',
        column: 'product.movementType',
        element: (data: IInventory) => data.movementType ? (data.movementType === 'IN' ? 'Entrada' : 'Salida') : '',
        orderBy: '',
        className: (data: IInventory) => data.movementType ? `rounded-full px-2.5 py-0.5 text-xs font-medium ${(data.movementType === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}` : '',

        icon: false,
    },
    {
        label: 'Hora',
        column: 'product.movementDate',
        element: (data: IInventory) => data.movementDate ? formatDateTime(data.movementDate) : '',
        orderBy: '',
        icon: false,
    },
    {
        label: 'Fecha',
        column: 'product.movementDate',
        element: (data: IInventory) => data.movementDate ? formatDate(data.movementDate) : '',
        orderBy: '',
        icon: false,
    }
]