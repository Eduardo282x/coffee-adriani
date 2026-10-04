import { DateRangeFilter, ExportInvoicesDashboard, IInvoiceForm, InvoiceAPINew, InvoiceStatus } from "@/interfaces/invoice.interface";
import { deleteDataApi, getDataApi, postDataApi, postDataFileApi, putDataApi } from "./base.service";
import { BaseResponse } from "./base.interface";

const routeInvoice = '/invoices';

export const getInvoice = async () => {
    return await getDataApi(routeInvoice);
}

export interface InvoiceFilterPaginate extends InvoiceDateRangeFilter {
    page: number;
    limit: number;
}
interface InvoiceDateRangeFilter {
    type: string;
    startDate?: Date | string,
    endDate?: Date | string,
    search?: string,
    blockId?: string,
    status?: InvoiceStatus
}

export const getInvoicesFilterPaginated = async (filtersInvoice: InvoiceFilterPaginate): Promise<InvoiceAPINew[] | BaseResponse> => {
    // Filtrar valores undefined/null antes de crear query params
    const cleanFilters = Object.fromEntries(
        Object.entries(filtersInvoice).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    return await getDataApi(`${routeInvoice}/paginated?${query}`);
}
export const getInvoiceDetails = async (invoiceId: number) => {
    return await getDataApi(`${routeInvoice}/details/${invoiceId}`);
}
export const getInvoiceStatistics = async (dateRange: InvoiceDateRangeFilter) => {
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
    return await getDataApi(`${routeInvoice}/statistics${queryString}`);
}
export const getInvoiceUnordered = async () => {
    return await getDataApi(`${routeInvoice}/unordered`);
}

export const getInvoiceExpired = async () => {
    return await getDataApi(`${routeInvoice}/expired`);
}

export const checkInvoicesPayment = async (invoiceId: number) => {
    return await postDataApi(`${routeInvoice}/check-invoice/${invoiceId}`, {});
}

export const getInvoiceFilter = async (filter: DateRangeFilter) => {
    return await postDataApi(`${routeInvoice}/filter`, filter);
}

export const getInvoiceExcelFilter = async (filter: ExportInvoicesDashboard) => {
    return await postDataFileApi(`${routeInvoice}/export`, filter);
}

export const getInvoiceHistory = async () => {
    return await getDataApi(`${routeInvoice}/history`);
}

export const postInvoice = async (data: IInvoiceForm) => {
    return await postDataApi(routeInvoice, data);
}

export const putInvoice = async (id: number, data: IInvoiceForm) => {
    return await putDataApi(`${routeInvoice}/${id}`, data);
}
export const putPayInvoice = async (id: number) => {
    return await putDataApi(`${routeInvoice}/pay/${id}`, {});
}
export const putLostInvoices = async (id: number) => {
    return await putDataApi(`${routeInvoice}/lost/${id}`, {});
}
export const putPendingInvoice = async (id: number) => {
    return await putDataApi(`${routeInvoice}/pending/${id}`, {});
}
export const putCleanInvoice = async (id: number) => {
    return await putDataApi(`${routeInvoice}/clean/${id}`, {});
}

export const deleteInvoice = async (id: number): Promise<BaseResponse> => {
    return await deleteDataApi(`${routeInvoice}/${id}`) as BaseResponse;
}
