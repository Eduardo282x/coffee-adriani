import { DateRangeFilter, IInvoiceForm } from "@/interfaces/invoice.interface";
import { deleteDataApi, getDataApi, postDataApi, postDataFileApi, putDataApi } from "./base.service";
import { BaseResponse } from "./base.interface";

const routeInvoice = '/invoices';

export const getInvoice = async () => {
    try {
        return await getDataApi(routeInvoice);
    } catch (err) {
        return err
    }
}

export const getInvoiceUnordered = async () => {
    try {
        return await getDataApi(`${routeInvoice}/unordered`);
    } catch (err) {
        return err
    }
}

export const getInvoiceExpired = async () => {
    try {
        return await getDataApi(`${routeInvoice}/expired`);
    } catch (err) {
        return err
    }
}

export const checkInvoices = async () => {
    try {
        return await postDataApi(`${routeInvoice}/check`, {});
    } catch (err) {
        return err
    }
}

export const getInvoiceFilter = async (filter: DateRangeFilter) => {
    try {
        return await postDataApi(`${routeInvoice}/filter`, filter);
    } catch (err) {
        return err
    }
}

export const getInvoiceExcelFilter = async (filter?: DateRangeFilter) => {
    try {
        return await postDataFileApi(`${routeInvoice}/export`, filter);
    } catch (err) {
        return err
    }
}

export const getInvoiceHistory = async () => {
    try {
        return await getDataApi(`${routeInvoice}/history`);
    } catch (err) {
        return err
    }
}

export const postInvoice = async (data: IInvoiceForm) => {
    try {
        return await postDataApi(routeInvoice, data);
    } catch (err) {
        return err
    }
}

export const putInvoice = async (id: number, data: IInvoiceForm) => {
    try {
        return await putDataApi(`${routeInvoice}/${id}`, data);
    } catch (err) {
        return err
    }
}
export const putPayInvoice = async (id: number) => {
    try {
        return await putDataApi(`${routeInvoice}/pay/${id}`, {});
    } catch (err) {
        return err
    }
}
export const putPendingInvoice = async (id: number) => {
    try {
        return await putDataApi(`${routeInvoice}/pending/${id}`, {});
    } catch (err) {
        return err
    }
}
export const putCleanInvoice = async (id: number) => {
    try {
        return await putDataApi(`${routeInvoice}/clean/${id}`, {});
    } catch (err) {
        return err
    }
}

export const deleteInvoice = async (id: number): Promise<BaseResponse> => {
    try {
        return await deleteDataApi(`${routeInvoice}/${id}`) as BaseResponse;
    } catch (err: unknown) {
        return {
            message: String(err),
            success: false
        }
    }
}