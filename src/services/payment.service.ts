import { IPaymentForm } from "@/interfaces/payment.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";
import { DateRangeFilter } from "@/interfaces/invoice.interface";

const routePayment = '/payments';

export const getPayment = async () => {
    try {
        return await getDataApi(routePayment);
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

export const postPayment = async (data: IPaymentForm) => {
    try {
        return await postDataApi(routePayment, data);
    } catch (err) {
        return err
    }
}

export const putPayment = async (id: number, data: IPaymentForm) => {
    try {
        return await putDataApi(`${routePayment}/${id}`, data);
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