import { InvoiceItems } from "./invoice.interface";
import { IPayments, PaymentStatisticsResponse } from "./payment.interface";

export interface IExpenses {
    invoices: IExpenseInvoice[];
    summary: ISummary;
    payments: IPayments[];
    paymentsNoAssociated: PaymentsNoAssociated;
    paymentsExpenses: PaymentsNoAssociated;
    statistics: PaymentStatisticsResponse;
    bank: IBankSummary;
}

export interface IExpenseInvoice {
    id: number;
    controlNumber: string;
    dispatchDate: Date | string;
    status: string;
    client: { id: number; name: string };
    totalAmount: number;
    remaining: number;
    earn: number;
    netEarn: number;
    totalItems: number;
    hasGiftItems: boolean;
    hasRateDifference: boolean;
    hasExpenseAssociated: boolean;
    expenseAssociatedAmount: number;
    invoiceItems: InvoiceItems[];
}

export interface IBankSummary {
    entrance: number;
    expenses: number;
    personalExpenses: number;
    supplier: number;
    outflow: number;
    balance: number;
    unassociatedAmount: number;
}

export interface ISummary {
    totalEarnDay: number;
    totalEarnMonth: number;
    totalEarnRange: number;
    productPercentages: ProductPercentage[];
    quantityProducts: QuantityProducts;
}

export interface QuantityProducts {
    totalEarnMonth: number;
    totalEarnRange: number;
}

export interface ProductPercentage {
    productId: number;
    name: string;
    presentation: string;
    quantity: number;
    percentage: string;
}

export interface PaymentsNoAssociated {
    payments: IPayments[];
    total: number;
}
