import { BodySupplier, SupplierResponse } from "@/interfaces/supplier.interface";
import { BaseResponse } from "./base.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeSupplier = '/suppliers';

export interface SupplierFilterPaginate {
    page: number;
    limit: number;
    search?: string;
    active: boolean;
}

export const getSuppliers = async (): Promise<SupplierResponse> => {
    try {
        return await getDataApi(routeSupplier);
    } catch (err) {
        console.error('Error fetching suppliers:', err);
        throw err;
    }
}

export const getSuppliersPaginated = async (filters: SupplierFilterPaginate): Promise<SupplierResponse> => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== undefined && value !== null && value !== ''
            )
        );

        const query = Object.keys(cleanFilters)
            .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
            .join('&');

        return await getDataApi(`${routeSupplier}?${query}`);
    } catch (err) {
        console.error('Error fetching paginated suppliers:', err);
        throw err;
    }
}

export const postSupplier = async (data: BodySupplier) => {
    return await postDataApi(routeSupplier, data);
}

export const putSupplier = async (id: number, data: BodySupplier) => {
    return await putDataApi(`${routeSupplier}/${id}`, data);
}

export const deleteSupplier = async (id: number): Promise<BaseResponse> => {
    return await deleteDataApi(`${routeSupplier}/${id}`) as BaseResponse;
}
