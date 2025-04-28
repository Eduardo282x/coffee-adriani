import { IInvoiceFilter, IInvoiceForm } from "@/interfaces/invoice.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeInvoice = '/invoices';

export const getInvoice = async () => {
    try {
        return await getDataApi(routeInvoice);
    } catch (err) {
        return err
    }
}

export const getInvoiceFilter = async (filter: IInvoiceFilter) => {
    try {
        return await postDataApi(`${routeInvoice}/filter`, filter);
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

export const deleteInvoice = async (id: number) => {
    try {
        return await deleteDataApi(`${routeInvoice}/${id}`);
    } catch (err) {
        return err
    }
}