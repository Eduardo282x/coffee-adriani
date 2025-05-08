import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatDateTime, formatNumberWithDots } from "@/hooks/formaters";
import { IInventory } from "@/interfaces/inventory.interface";
import { MdEdit } from "react-icons/md";

export const inventoryColumns: IColumns<IInventory>[] = [
    {
        label: 'Nombre',
        column: 'product.name',
        element: (data: IInventory) => data.product.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Presentación',
        column: 'product.presentation',
        element: (data: IInventory) => data.product.presentation,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'product.priceUSD',
        label: 'Precio ($)',
        element: (data: IInventory) => formatNumberWithDots(data.product.priceUSD, '', ' $'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'product.price',
        label: 'Precio',
        element: (data: IInventory) => formatNumberWithDots(data.product.price, '', ' $'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'product.priceBs',
        label: 'Precio (Bs)',
        element: (data: IInventory) => formatNumberWithDots(data.product.priceBs, '', ' Bs'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: IInventory) => data.quantity.toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Acciones',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: MdEdit, className: 'text-[$#6f4e37]' },
        ]
    },
]

export const extraColumn: IColumns<IInventory>[] = [
    {
        label: 'Movimiento',
        column: 'movementType',
        element: (data: IInventory) => setTranslateColumn(data),
        orderBy: '',
        type: 'string',
        className: (data: IInventory) => setClassNameHistoryColumn(data),
        icon: false,
    },
    {
        label: 'Descripcion',
        column: 'description',
        element: (data: IInventory) => data.description,
        orderBy: '',
        type: 'string',
        className: (data: IInventory) => setClassNameHistoryColumn(data),
        icon: false,
    },
    {
        label: 'Hora',
        column: 'movementDate',
        element: (data: IInventory) => data.movementDate ? formatDateTime(data.movementDate) : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Fecha',
        column: 'movementDate',
        element: (data: IInventory) => data.movementDate ? formatDate(data.movementDate) : '',
        orderBy: '',
        type: 'string',
        icon: false,
    }
]

const setTranslateColumn = (data: IInventory): string => {
    if (data.movementType === 'IN') {
        return 'Entrada'
    }
    if (data.movementType === 'OUT') {
        return 'Salida'
    }
    if (data.movementType === 'EDIT') {
        return 'Edición'
    }
    return ''
}

const setClassNameHistoryColumn = (data: IInventory): string => {
    if (data.movementType === 'IN') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800'
    }
    if (data.movementType === 'OUT') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800'
    }
    if (data.movementType === 'EDIT') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800'
    }
    return ''
}