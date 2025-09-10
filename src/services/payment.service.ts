import { IPaymentForm, IPayInvoiceForm, PayDisassociateBody } from "@/interfaces/payment.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";
import { DateRangeFilter } from "@/interfaces/invoice.interface";
import { AccountForm } from "@/pages/accounts/accounts.data";

const routePayment = '/payments';

export interface FilterPaymentsPaginated extends FilterPayments {
    limit: number,
    page: number
}
export interface FilterPayments {
    startDate?: Date;
    endDate?: Date;
    search?: string;
    accountId?: number;
    methodId?: number;
    status?: string;
    associated?: string;
}

export const getPayment = async () => {
    try {
        return await getDataApi(routePayment);
    } catch (err) {
        return err
    }
}

export const getPaymentsPaginated = async (filters: FilterPaymentsPaginated) => {
    try {
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
    } catch (err) {
        return err
    }
}
export const getPaymentStatistics = async (dateRange: FilterPayments) => {
    try {
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
    } catch (err) {
        return err
    }
}

export const getPaymentDetails = async (paymentId: number) => {
    try {
        return await getDataApi(`${routePayment}/details/${paymentId}`);
    } catch (err) {
        return err;
    }
};

export const getPaymentAccounts = async () => {
    try {
        return await getDataApi(`${routePayment}/accounts`);
    } catch (err) {
        return err
    }
}

export const getPaymentFilter = async (data: DateRangeFilter) => {
    try {
        return await postDataApi(`${routePayment}/filter`, data);
    } catch (err) {
        return err
    }
}

export const getPaymentMethod = async () => {
    try {
        return await getDataApi(`${routePayment}/methods`);
    } catch (err) {
        return err
    }
}
export const getBanks = async () => {
    try {
        return await getDataApi(`${routePayment}/banks`);
    } catch (err) {
        return err
    }
}

export const postPaymentAccounts = async (data: AccountForm) => {
    try {
        return await postDataApi(`${routePayment}/accounts`, data);
    } catch (err) {
        return err
    }
}

export const putPaymentAccounts = async (id: number, data: AccountForm) => {
    try {
        return await putDataApi(`${routePayment}/accounts/${id}`, data);
    } catch (err) {
        return err
    }
}

export const deletePaymentAccounts = async (id: number) => {
    try {
        return await deleteDataApi(`${routePayment}/accounts/${id}`);
    } catch (err) {
        return err
    }
}


export const registerPayment = async (data: IPaymentForm) => {
    try {
        return await postDataApi(routePayment, data);
    } catch (err) {
        return err
    }
}

export const postAssociatePayment = async (data: IPayInvoiceForm) => {
    try {
        return await postDataApi(`${routePayment}/associate`, data);
    } catch (err) {
        return err
    }
}

export const putDisassociatePayment = async (data: PayDisassociateBody) => {
    try {
        return await putDataApi(`${routePayment}/disassociate`, data);
    } catch (err) {
        return err
    }
}

export const updatePayment = async (id: number, data: IPaymentForm) => {
    try {
        return await putDataApi(`${routePayment}/${id}`, data);
    } catch (err) {
        return err
    }
}

export const putConfirmPayment = async (id: number) => {
    try {
        return await putDataApi(`${routePayment}/zelle/${id}`, {});
    } catch (err) {
        return err
    }
}

export const deletePayment = async (id: number) => {
    try {
        return await deleteDataApi(`${routePayment}/${id}`);
    } catch (err) {
        return err
    }
}