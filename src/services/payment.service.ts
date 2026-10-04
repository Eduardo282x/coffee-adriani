import { IPaymentForm, IPayInvoiceForm, PayDisassociateBody, PaymentMutationResponse } from "@/interfaces/payment.interface";
import { deleteDataApi, getDataApi, postDataApi, postDataApiStrict, putDataApi, putDataApiStrict } from "./base.service";
import { DateRangeFilter, ExportDashboard } from "@/interfaces/invoice.interface";
import { AccountForm } from "@/pages/accounts/accounts.data";

const routePayment = '/payments';

export interface FilterPaymentsPaginated extends FilterPayments {
    limit: number,
    page: number
}
export interface FilterPayments {
    startDate?: Date | string;
    endDate?: Date | string;
    search?: string;
    accountId?: number;
    methodId?: number;
    status?: string;
    associated?: boolean;
    accountType?: string;
    paymentType?: string;
}

export const getPayment = async () => {
    return await getDataApi(routePayment);
}

export const getPaymentsPaginated = async (filters: FilterPaymentsPaginated) => {
    // Filtrar valores undefined/null antes de crear query params
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');
    return await getDataApi(`${routePayment}/paginated?${query}`);
}
export const getPaymentStatistics = async (dateRange: FilterPayments) => {
    // Filtrar valores undefined/null antes de crear query params
    const cleanFilters = Object.fromEntries(
        Object.entries(dateRange).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    const queryString = query ? `?${query}` : '';
    return await getDataApi(`${routePayment}/statistics${queryString}`);
}

export const getPaymentDetails = async (paymentId: number) => {
    return await getDataApi(`${routePayment}/details/${paymentId}`);
};

export const getPaymentDescriptions = async () => {
    return await getDataApi(`${routePayment}/descriptions`);
}
export const getPaymentAccounts = async () => {
    return await getDataApi(`${routePayment}/accounts`);
}

export const getPaymentFilter = async (data: DateRangeFilter) => {
    return await postDataApi(`${routePayment}/filter`, data);
}

export const getPaymentMethod = async () => {
    return await getDataApi(`${routePayment}/methods`);
}
export const getBanks = async () => {
    return await getDataApi(`${routePayment}/banks`);
}

export const postPaymentAccounts = async (data: AccountForm) => {
    return await postDataApi(`${routePayment}/accounts`, data);
}

export const putPaymentAccounts = async (id: number, data: AccountForm) => {
    return await putDataApi(`${routePayment}/accounts/${id}`, data);
}

export const deletePaymentAccounts = async (id: number) => {
    return await deleteDataApi(`${routePayment}/accounts/${id}`);
}


export const registerPayment = async (data: IPaymentForm) => {
    return await postDataApi(routePayment, data);
}

export const postAssociatePayment = async (data: IPayInvoiceForm): Promise<PaymentMutationResponse> => {
    // Estricto: si el backend rechaza la asociaciÃ³n, el error se propaga para que el
    // diÃ¡logo NO se cierre y el usuario no pierda lo que ya seleccionÃ³.
    return await postDataApiStrict<PaymentMutationResponse>(`${routePayment}/associate`, data);
}

export const putDisassociatePayment = async (data: PayDisassociateBody): Promise<PaymentMutationResponse> => {
    return await putDataApiStrict<PaymentMutationResponse>(`${routePayment}/disassociate`, data);
}

export const updatePayment = async (id: number, data: IPaymentForm) => {
    return await putDataApi(`${routePayment}/${id}`, data);
}

export const putConfirmPayment = async (id: number) => {
    return await putDataApi(`${routePayment}/zelle/${id}`, {});
}

export const deletePayment = async (id: number) => {
    return await deleteDataApi(`${routePayment}/${id}`);
}

export const getPaymentItemsAnalytics = async (data: ExportDashboard) => {
    return await postDataApi(`${routePayment}/analysis`, data);
}
