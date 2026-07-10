import { BodySupplier, Supplier } from "@/interfaces/supplier.interface";
import { BaseResponse } from "./base.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeSupplier = '/suppliers';

export interface SupplierFilterPaginate {
    page: number;
    limit: number;
    search?: string;
}

export const getSuppliers = async (): Promise<Supplier | null> => {
    try {
        return await getDataApi(routeSupplier);
    } catch (err) {
        console.error('Error fetching suppliers:', err);
        return null;
    }
}

export const getSuppliersPaginated = async (filters: SupplierFilterPaginate): Promise<Supplier | null> => {
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
        return null;
    }
}

export const postSupplier = async (data: BodySupplier) => {
    try {
        return await postDataApi(routeSupplier, data);
    } catch (err) {
        return err;
    }
}

export const putSupplier = async (id: number, data: BodySupplier) => {
    try {
        return await putDataApi(`${routeSupplier}/${id}`, data);
    } catch (err) {
        return err;
    }
}

export const deleteSupplier = async (id: number): Promise<BaseResponse> => {
    try {
        return await deleteDataApi(`${routeSupplier}/${id}`) as BaseResponse;
    } catch (err) {
        return {
            message: String(err),
            success: false
        };
    }
}
