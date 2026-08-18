import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots, formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IInventoryEntry, IInventoryEntryDetail, IInventory, InventoryCut, InventoryCutDetail } from "@/interfaces/inventory.interface";
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

export const inventoryColumnsHistory: IColumns<IInventoryEntry>[] = [
    {
        label: 'Numero de Control',
        column: 'controlNumber',
        element: (data: IInventoryEntry) => data.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Movimiento',
        column: 'movementType',
        element: (data: IInventoryEntry) => setTranslateColumn(data),
        orderBy: '',
        type: 'string',
        className: (data: IInventoryEntry) => setClassNameHistoryColumn(data),
        icon: false,
    },
    {
        label: 'Descripción',
        column: 'description',
        element: (data: IInventoryEntry) => data.description || '-',
        orderBy: '',
        type: 'string',
        className: (data: IInventoryEntry) => setClassNameHistoryColumn(data),
        icon: false,
    },
    {
        label: 'Total de Bultos',
        column: 'totalPackages',
        element: (data: IInventoryEntry) => Number(data.totalBultos).toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Fecha',
        column: 'date',
        element: (data: IInventoryEntry) => data.date ? formatDate(data.date) : '',
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

const setTranslateColumn = (data: IInventoryEntry): string => {
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

const setClassNameHistoryColumn = (data: IInventoryEntry): string => {
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

export const inventoryColumnDetailHistory: IColumns<IInventoryEntryDetail>[] = [
    {
        label: 'Producto',
        column: 'product',
        element: (data: IInventoryEntryDetail) => `${data.product?.name || ''} - ${data.product?.presentation || ''}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'unitPriceUSD',
        label: 'Precio ($)',
        element: (data: IInventoryEntryDetail) => `${formatOnlyNumberWithDots(data.unitPriceUSD)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: IInventoryEntryDetail) => data.quantity.toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'subtotal',
        label: 'Subtotal ($)',
        element: (data: IInventoryEntryDetail) => `${formatOnlyNumberWithDots(data.subtotal)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    }
];


export const inventoryCutColumns: IColumns<InventoryCut>[] = [
    {
        label: 'Producto',
        column: 'type',
        element: (data: InventoryCut) => data.type,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Tipo',
        column: 'status',
        element: (data: InventoryCut) => data.status === 'OPEN' ? 'Abierto' : (data.status === 'CLOSE' ? 'Cerrado' : data.status),
        orderBy: '',
        type: 'string',
        className: (data: InventoryCut) => setClassNameCutStatus(data),
        icon: false,
    },
    {
        label: 'Periodo',
        column: 'date',
        element: (data: InventoryCut) => data.period === 'WEEK' ? 'Semanal' : 'Mensual',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Inicio',
        column: 'startDate',
        element: (data: InventoryCut) => data.startDate ? formatDate(data.startDate) : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Fin',
        column: 'endDate',
        element: (data: InventoryCut) => data.endDate ? formatDate(data.endDate) : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Monto Inicial',
        column: 'initialAmount',
        element: (data: InventoryCut) => formatOnlyNumberWithDots(data.initialAmount),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Monto Cierre',
        column: 'closeAmount',
        element: (data: InventoryCut) => formatOnlyNumberWithDots(data.closeAmount),
        orderBy: '',
        type: 'string',
        icon: false,
    },
];

export const inventoryCutDetailColumns: IColumns<InventoryCutDetail>[] = [
    {
        label: 'Producto',
        column: 'name',
        element: (data: InventoryCutDetail) => `${data.name} - ${data.presentation}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Tipo',
        column: 'type',
        element: (data: InventoryCutDetail) => data.type,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cantidad',
        column: 'amount',
        element: (data: InventoryCutDetail) => formatOnlyNumberWithDots(data.amount),
        orderBy: '',
        type: 'string',
        icon: false,
    },
];

const setClassNameCutStatus = (data: InventoryCut): string => {
    if (data.status === 'OPEN') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800'
    }
    if (data.status === 'CLOSE') {
        return 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800'
    }
    return ''
}

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
