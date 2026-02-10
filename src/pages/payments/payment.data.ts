import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IInvoice, IInvoiceForPay } from "@/interfaces/invoice.interface";
import { IPayments } from "@/interfaces/payment.interface";
import { Trash2 } from "lucide-react";
import { FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineCash } from "react-icons/hi";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { FiFileText } from "react-icons/fi";

export const paymentsColumns: IColumns<IPayments>[] = [
    {
        label: 'Cuenta',
        column: 'account.name',
        element: (data: IPayments) => `${data.account.name} ${data.account.bank}`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'account.method.name',
        label: 'Tipo pago',
        element: (data: IPayments) => data.account.method.name,
        orderBy: '',
        visible: false,
        type: 'string',
        icon: false,
    },
    {
        column: 'associated',
        label: 'Asociado',
        element: (data: IPayments) => data.associated ? 'Asociado' : 'Sin asociar',
        orderBy: '',
        visible: true,
        className: (data: IPayments) => getBadgeVariantAssociated(data.associated),
        type: 'string',
        icon: false,
    },
    {
        column: 'remainingUSD',
        label: 'Sobrante',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.remainingUSD)} $`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'status',
        label: 'Estado',
        element: (data: IPayments) => data.status === 'CONFIRMED' ? 'Confirmado' : 'Pendiente',
        orderBy: '',
        visible: false,
        className: (data: IPayments) => getBadgeVariant(data.status),
        type: 'string',
        icon: false,
    },
    // {
    //     column: 'remaining',
    //     label: 'Restante',
    //     element: (data: IPayments) => `${formatOnlyNumberWithDots(data.remaining)} $`,
    //     orderBy: '',
    // visible: true,
    //     type: 'string',
    //     icon: false,
    // },
    {
        column: 'amountUSD',
        label: 'Cantidad ($)',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.amountUSD)} $`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'amountBs',
        label: 'Cantidad (Bs)',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.amountBs)} Bs`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'dolar.dolar',
        label: 'Tasa Dolar',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.dolar.dolar)} Bs`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'reference',
        label: 'Referencia',
        element: (data: IPayments) => `# ${data.reference}`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
        className: () => 'font-semibold text-blue-600'
    },
    {
        column: 'description',
        label: 'Tipo de gasto',
        element: (data: IPayments) => data.description ? data.description : '-',
        orderBy: '',
        visible: false,
        type: 'string',
        icon: false,
    },
    {
        column: 'paymentDate',
        label: 'Fecha pago',
        element: (data: IPayments) => formatDate(data.paymentDate),
        orderBy: '',
        visible: false,
        type: 'string',
        icon: false,
    },
    {
        column: 'paymentDate',
        label: 'Hora pago',
        element: (data: IPayments) => formatTimeRange(data.paymentDate.toString()),
        orderBy: '',
        visible: false,
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Acción',
        element: () => '',
        orderBy: '',
        visible: true,
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: HiOutlineCash, className: 'text-blue-800' },
            { label: 'Confirmar', icon: FaRegCheckCircle, className: 'text-blue-400' },
            { label: 'Pagar', icon: HiOutlineCash, className: 'text-green-400' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-400' },
        ]
    }
];

const getBadgeVariantAssociated = (status: boolean) => {
    if (status) {
        return "rounded-lg px-2 bg-blue-100 text-blue-800"
    } else {
        return "rounded-lg px-2 bg-gray-200 text-gray-800"
    }
}
const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case "CONFIRMED":
            return "rounded-lg px-2 bg-green-100 text-green-800"
        case "PENDING":
            return "rounded-lg px-2 bg-yellow-100 text-yellow-800"
        default:
            return "rounded-lg px-2 bg-gray-100 text-gray-800"
    }
}

export const paymentsFilterColumns: IColumns<IInvoiceForPay>[] = [
    {
        label: 'Factura',
        column: 'controlNumber',
        element: (element: IInvoiceForPay) => element.controlNumber.toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cliente',
        column: 'client.name',
        element: (element: IInvoiceForPay) => element.client ? element.client.name.toString() : '',
        orderBy: '',
        className: (element: IInvoiceForPay) => element.client ? 'w-[8rem] block text-ellipsis overflow-hidden' : 'w-[8rem] block text-ellipsis overflow-hidden',
        type: 'string',
        icon: false,
    },
    {
        label: 'Total',
        column: 'totalAmount',
        element: (element: IInvoiceForPay) => `${formatOnlyNumberWithDots(element.totalAmount)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Debe',
        column: 'remaining',
        element: (element: IInvoiceForPay) => `${formatOnlyNumberWithDots(element.remaining)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'A pagar',
        column: 'totalPaid',
        element: (element: IInvoiceForPay) => element.totalPaid.toString(),
        orderBy: '',
        type: 'editable',
        icon: false,
    },
    {
        column: '',
        label: 'Eliminar',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Eliminar', icon: Trash2, className: 'text-red-400' },
        ]
    },
]

export const paymentsInvoiceAssociatedColumns: IColumns<IInvoice>[] = [
    {
        label: 'Factura',
        column: 'controlNumber',
        element: (data: IInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cliente',
        column: 'client.name',
        element: (data: IInvoice) => data.client ? data.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Pago',
        column: 'amountPayed',
        element: (data: IInvoice) => `${formatOnlyNumberWithDots(data.amountPayed)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Fecha asociación',
        column: 'createdAtPayed',
        element: (data: IInvoice) => formatDate(data.createdAtPayed),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Ver factura',
        column: '',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Ver', icon: FiFileText, className: 'text-blue-600' },
        ]
    },
    {
        label: 'Desasociar',
        column: '',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Desasociar', icon: MdOutlinePlaylistRemove, className: 'text-red-400' },
        ]
    },
]

export const formatTimeToAMPM = (time: string): string => {
    if (!time) return ""

    const getTime: string = time.split("T")[1];

    const [hours, minutes] = getTime.split(":").map(Number)
    const period = hours >= 12 ? "pm" : "am"
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

    return `${displayHours}:${minutes.toString().padStart(2, "0")}${period}`
}

export const formatTimeRange = (startTime: string): string => {
    if (!startTime) return ""

    const formattedStart = formatTimeToAMPM(startTime)
    // const formattedEnd = formatTimeToAMPM(endTime)

    return `${formattedStart}`
}

export interface PaymentFilters {
    account: string;
    associated: string;
    method: string;
    credit: string;
    type: string;
    typeDescription: string;
}

export type PaymentFilterType = 'account' | 'associated' | 'method' | 'credit' | 'type' | 'typeDescription';

export const initialPaymentFilters: PaymentFilters = {
    account: 'all',
    associated: 'all',
    method: 'all',
    credit: 'all',
    type: 'all',
    typeDescription: 'all',
}