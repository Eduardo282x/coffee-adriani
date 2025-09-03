import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { ICollection, ICollectionHistory, IMessages } from "@/interfaces/collection.interface";
import { IoDocumentTextOutline } from "react-icons/io5";
import { getBadgeVariant } from "../invoices/invoices.data";
import { IInvoice } from "@/interfaces/invoice.interface";
import { Edit, Trash2 } from "lucide-react";

export const messageCollectionColumns: IColumns<IMessages>[] = [
    {
        column: 'title',
        label: 'Titulo',
        element: (data: IMessages) => data.title,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'content',
        label: 'Mensaje',
        element: (data: IMessages) => data.content,
        className: () => 'max-w-[32rem] text-ellipsis overflow-hidden block',
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
            { label: 'Editar', icon: Edit, className: 'text-blue-600' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
];

export const clientCollectionColumns: IColumns<ICollection>[] = [
    {
        column: 'client.name',
        label: 'Cliente',
        element: (data: ICollection) => data.client ? data.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.phone',
        label: 'Teléfono',
        element: (data: ICollection) => data.client ? data.client.phone : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.zone',
        label: 'Zona',
        element: (data: ICollection) => data.client ? data.client.zone : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.blockId',
        label: 'Bloque',
        element: (data: ICollection) => data.client ? data.client.block.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export const normalColumns: IColumns<ICollection>[] = [
    {
        column: 'client.name',
        label: 'Cliente',
        element: (data: ICollection) => data.client ? data.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.phone',
        label: 'Teléfono',
        element: (data: ICollection) => data.client ? data.client.phone : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'message.title',
        label: 'Mensaje',
        element: (data: ICollection) => data.message.title,
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    },
    {
        column: 'sentAt',
        label: 'Enviado',
        element: (data: ICollection) => sendedAt(data.sentAt),
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    }
]

export const collectionHistoryColumns: IColumns<ICollectionHistory>[] = [
    {
        column: 'client.name',
        label: 'Cliente',
        element: (data) => data.client ? data.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.phone',
        label: 'Teléfono',
        element: (data) => data.client ? data.client.phone : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'message.title',
        label: 'Mensaje',
        element: (data) => data.message.title,
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    },
    {
        column: 'sended',
        label: 'Enviado',
        element: (data) => <span className={`${sendedBageVariant(data.sended)}`}>{data.sended ? 'Enviado' : 'No enviado'}</span>,
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    },
    {
        column: 'sentAt',
        label: 'Enviado',
        element: (data) => sendedAt(data.sentAt),
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    }
]

export const collectionErrorsColumns: IColumns<ICollectionHistory>[] = [
    {
        column: 'client.name',
        label: 'Cliente',
        element: (data) => data.client ? data.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'description',
        label: 'Descripción',
        element: (data) => data.description,
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    },
    {
        column: 'sended',
        label: 'Enviado',
        element: (data) => <span className={`${sendedBageVariant(data.sended)}`}>{data.sended ? 'Enviado' : 'No enviado'}</span>,
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    },
    {
        column: 'sentAt',
        label: 'Enviado',
        element: (data) => sendedAt(data.sentAt),
        // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
        orderBy: '',
        type: 'custom',
        icon: false,
    }
]

const sendedBageVariant = (sended: boolean): string => {
    return sended ? "rounded-lg px-2 bg-blue-100 text-blue-800" : "rounded-lg px-2 bg-red-100 text-red-800";
}

function sendedAt(sentAt?: string | Date | null): string {
    if (!sentAt) return "No enviado.";

    const sentDate = new Date(sentAt);
    const now = new Date();

    const diffMs = now.getTime() - sentDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Enviado hoy"
    if (diffDays === 1) return "Enviado ayer";
    if (diffDays < 7) return `Enviado hace ${diffDays} días.`;

    return `Enviado el ${sentDate.toLocaleDateString()}`;
}



export const isToday = (dateString: string | Date | null) => {
    if (!dateString) return false; // si sentAt es null
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}
export const getSendVariant = (send: boolean): string => {
    switch (send) {
        case true:
            return "rounded-lg px-2 bg-blue-100 text-blue-800"
        case false:
            return "rounded-lg px-2 bg-red-100 text-red-800"
        default:
            return "rounded-lg px-2 bg-gray-100 text-gray-800"
    }
}

export const invoiceCollectionColumns: IColumns<IInvoice>[] = [
    {
        column: 'controlNumber',
        label: 'Numero factura',
        element: (data: IInvoice) => data.controlNumber.toString(),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'consignment',
        label: 'Consignación',
        element: (data: IInvoice) => data.consignment ? 'Si' : 'No',
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalAmount',
        label: 'Estado',
        element: (data: IInvoice) => data.status,
        orderBy: '',
        type: 'string',
        className: (data: IInvoice) => getBadgeVariant(data.status)
    },
    {
        column: 'totalAmount',
        label: 'Fecha pago',
        element: (data: IInvoice) => data.InvoicePayment.length > 0 ? formatDate(data.InvoicePayment[data.InvoicePayment.length - 1].createdAt) : '-',
        orderBy: '',
        type: 'string',
        // className: (data: IInvoice) => getBadgeVariant(data.status)
    },
    {
        column: 'totalAmount',
        label: 'Total',
        element: (data: IInvoice) => formatNumberWithDots(data.totalAmount, '', ' $'),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'dispatchDate',
        label: 'Despacho',
        element: (data: IInvoice) => formatDate(data.dispatchDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'dueDate',
        label: 'Vencimiento',
        element: (data: IInvoice) => formatDate(data.dueDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: '',
        label: 'Detalles',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Detalles', icon: IoDocumentTextOutline, className: 'text-blue-600' },
        ]
    }
]