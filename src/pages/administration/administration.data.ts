import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots, formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IExpenseInvoice } from "@/interfaces/adminitration.interface";
import { InvoiceItems } from "@/interfaces/invoice.interface";
import { IPayments } from "@/interfaces/payment.interface";

export interface ITotals {
    totalInvoice: string;
    totalInvoiceRemaining: string;
    totalInvoiceDetails: string;
    totalInvoiceEarns: string;
    totalPayments: string,
    total: string
}

export const baseTotals: ITotals = {
    totalInvoice: '0',
    totalInvoiceRemaining: '0',
    totalInvoiceDetails: '0',
    totalInvoiceEarns: '0',
    totalPayments: '0',
    total: '0'
};

export const expendePaymentsColumns: IColumns<IPayments>[] = [
    {
        label: 'Cuenta',
        column: 'account.name',
        element: (data: IPayments) => `${data.account.name} ${data.account.bank}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'account.method.name',
        label: 'Tipo de pago',
        element: (data: IPayments) => data.account.method.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad ($)',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.amountUSD)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'reference',
        label: 'Descripción',
        element: (data: IPayments) => data.reference,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha de pago',
        element: (data: IPayments) => formatDate(data.paymentDate),
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export const expenseInvoiceColumns: IColumns<IExpenseInvoice>[] = [
    {
        label: 'Factura',
        column: 'controlNumber',
        element: (data: IExpenseInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cliente',
        column: 'client.name',
        element: (data: IExpenseInvoice) => data.client?.name ?? '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Restante',
        column: 'remaining',
        element: (data: IExpenseInvoice) => formatNumberWithDots(Number(data.remaining).toFixed(2), '', '$'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Regalos',
        column: 'hasGiftItems',
        element: (data: IExpenseInvoice) => data.hasGiftItems ? 'Sí' : 'No',
        orderBy: '',
        type: 'string',
        icon: false,
    },
];

export const expenseInvoiceColumnsDetail: IColumns<IExpenseInvoice>[] = [
    {
        label: 'Factura',
        column: 'controlNumber',
        element: (data: IExpenseInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cliente',
        column: 'client.name',
        element: (data: IExpenseInvoice) => data.client?.name ?? '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Restante',
        column: 'remaining',
        element: (data: IExpenseInvoice) => formatNumberWithDots(Number(data.remaining).toFixed(2), '', '$'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Regalos',
        column: 'hasGiftItems',
        element: (data: IExpenseInvoice) => data.hasGiftItems ? 'Sí' : 'No',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Bultos',
        column: 'totalItems',
        element: (data: IExpenseInvoice) => data.totalItems,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Total',
        column: 'totalAmount',
        element: (data: IExpenseInvoice) => formatNumberWithDots(Number(data.totalAmount).toFixed(2), '', '$'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Ganancia',
        column: 'earn',
        element: (data: IExpenseInvoice) => formatNumberWithDots(Number(data.earn).toFixed(2), '', '$'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
];

export const expenseInvoiceDetailsColumns: IColumns<InvoiceItems>[] = [
    {
        label: 'Producto',
        column: 'product.name',
        element: (data: InvoiceItems) => `${data.product.name} ${data.product.presentation}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Precio',
        column: 'unitPrice',
        element: (data: InvoiceItems) => `${formatOnlyNumberWithDots(data.unitPrice)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cantidad',
        column: 'quantity',
        element: (data: InvoiceItems) => data.quantity,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Subtotal',
        column: 'subtotal',
        element: (data: InvoiceItems) => `${formatOnlyNumberWithDots(data.subtotal)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export const expendePaymentsNoAssociatedColumns: IColumns<IPayments>[] = [
    {
        label: 'Cuenta',
        column: 'account.name',
        element: (data: IPayments) => `${data.account.name} ${data.account.bank}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'account.method.name',
        label: 'Tipo de pago',
        element: (data: IPayments) => data.account.method.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad (Bs)',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.amount)} Bs`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad ($)',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.amountUSD)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'dolar.dolar',
        label: 'Tasa Dolar',
        element: (data: IPayments) => `${formatOnlyNumberWithDots(data.dolar.dolar)} Bs`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'reference',
        label: 'Referencia',
        element: (data: IPayments) => data.reference,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha de pago',
        element: (data: IPayments) => formatDate(data.paymentDate),
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export const expenseInvoiceEarnColumns: IColumns<IExpenseInvoice>[] = [
    {
        label: 'Factura',
        column: 'controlNumber',
        element: (data: IExpenseInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cliente',
        column: 'client.name',
        element: (data: IExpenseInvoice) => data.client?.name ?? '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Ganancia',
        column: 'earn',
        element: (data: IExpenseInvoice) => formatNumberWithDots(Number(data.earn).toFixed(2), '', '$'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
];
