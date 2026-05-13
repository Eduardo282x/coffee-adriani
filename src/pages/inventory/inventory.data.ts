import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatDateTime, formatNumberWithDots, formatOnlyNumberWithDots } from "@/hooks/formaters";
import { DetailHistory, History, IInventory } from "@/interfaces/inventory.interface";
import { Trash2 } from "lucide-react";
import { MdEdit } from "react-icons/md";
import { ProductTable } from "./InventoryForm";

export const inventoryColumns: IColumns<IInventory>[] = [
    {
        label: 'Producto',
        column: 'product.name',
        element: (data: IInventory) => `${data.product.name} - ${data.product.presentation}`,
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
    // {
    //     column: 'product.priceBs',
    //     label: 'Precio (Bs)',
    //     element: (data: IInventory) => formatNumberWithDots(data.product.priceBs, '', ' Bs'),
    //     orderBy: '',
    //     type: 'string',
    //     icon: false,
    // },
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
        label: 'Editar',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: MdEdit, className: 'text-[#6f4e37]' },
        ]
    },
]

export const inventoryColumnsHistory: IColumns<History>[] = [
    {
        label: 'Numero de Control',
        column: 'controlNumber',
        element: (data: History) => data.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Movimiento',
        column: 'movementType',
        element: (data: History) => setTranslateColumn(data),
        orderBy: '',
        type: 'string',
        className: (data: History) => setClassNameHistoryColumn(data),
        icon: false,
    },
    {
        label: 'Descripción',
        column: 'description',
        element: (data: History) => data.description,
        orderBy: '',
        type: 'string',
        className: (data: History) => setClassNameHistoryColumn(data),
        icon: false,
    },
    {
        label: 'Fecha',
        column: 'movementDate',
        element: (data: History) => data.movementDate ? formatDate(data.movementDate) : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Editar',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: MdEdit, className: 'text-[#6f4e37]' },
        ]
    },
]

const setTranslateColumn = (data: History): string => {
    if (data.movementType === 'IN') {
        return 'Entrada'
    }
    if (data.movementType === 'ADJUSTMENT') {
        return 'Ajuste'
    }
    if (data.movementType === 'OUT') {
        return 'Salida'
    }
    if (data.movementType === 'EDIT') {
        return 'Edición'
    }
    return ''
}

const setClassNameHistoryColumn = (data: History): string => {
    if (data.movementType === 'IN') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800'
    }
    if (data.movementType === 'ADJUSTMENT') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800'
    }
    if (data.movementType === 'OUT') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800'
    }
    if (data.movementType === 'EDIT') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800'
    }
    return ''
}

export const inventoryColumnDetailHistory: IColumns<DetailHistory>[] = [
    {
        label: 'Producto',
        column: 'name',
        element: (data: DetailHistory) => `${data.name} - ${data.presentation}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'priceUSD',
        label: 'Precio ($)',
        element: (data: DetailHistory) => `${formatOnlyNumberWithDots(data.priceUSD)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: DetailHistory) => data.quantity.toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'date',
        label: 'Hora',
        element: (data: DetailHistory) => data.date ? formatDateTime(data.date) : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'date',
        label: 'Fecha',
        element: (data: DetailHistory) => data.date ? formatDate(data.date) : '',
        orderBy: '',
        type: 'string',
        icon: false,
    }
];


export const inventoryProductFormColumns: IColumns<ProductTable>[] = [
    {
        column: 'name',
        label: 'Producto',
        element: (data: ProductTable) => `${data.name} - ${data.presentation}`,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: () => `0`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: '',
        label: 'Eliminar',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
]