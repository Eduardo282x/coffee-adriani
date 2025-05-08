import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { IPayments } from "@/interfaces/payment.interface";
import { FaRegCheckCircle } from "react-icons/fa";

export const paymentsColumns: IColumns<IPayments>[] = [
    {
        label: 'Banco',
        column: 'bank',
        element: (data: IPayments) => data.bank,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'method.name',
        label: 'Tipo de pago',
        element: (data: IPayments) => data.method.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'status',
        label: 'Estado',
        element: (data: IPayments) => data.status === 'CONFIRMED' ? 'Confirmado' : 'Pendiente',
        orderBy: '',
        className: (data: IPayments) => getBadgeVariant(data.status),
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad ($)',
        element: (data: IPayments) => formatNumberWithDots(data.amountUSD, '', ' $'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad (Bs)',
        element: (data: IPayments) => formatNumberWithDots(data.amountBs, '', ' Bs'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'dolar.dolar',
        label: 'Tasa Dolar',
        element: (data: IPayments) => formatNumberWithDots(data.dolar.dolar, '', ' Bs'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'reference',
        label: 'Referencia',
        element: (data: IPayments) => `# ${data.reference}`,
        orderBy: '',
        type: 'string',
        icon: false,
        className: () => 'font-semibold text-blue-600'
    },
    {
        column: 'createdAt',
        label: 'Fecha de pago',
        element: (data: IPayments) => formatDate(data.createdAt),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Confirmar pago',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Confirmar', icon: FaRegCheckCircle , className: 'text-blue-400' },
        ]
    }
];

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