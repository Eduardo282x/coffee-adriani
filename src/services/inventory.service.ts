import { BodyInventory, BodyInventorySimple, BodyUpdateHistoryInventory } from "@/interfaces/inventory.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeInventory = '/inventory';

export interface InventoryHistoryFilter {
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
    typeMovement?: string;
    typeProduct?: string;
    controlNumber?: string;
}

export const getInventory = async () => {
    try {
        return await getDataApi(routeInventory);
    } catch (err) {
        return err
    }
}

export const getInventoryHistory = async (filter: InventoryHistoryFilter) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filter).filter(([, value]) =>
                value !== undefined && value !== null && value !== ''
            )
        );

        const query = Object.keys(cleanFilters)
            .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
            .join('&');

        return await getDataApi(`${routeInventory}/history?${query}`);
    } catch (err) {
        return err
    }
}

export const postInventory = async (data: BodyInventory) => {
    try {
        return await postDataApi(routeInventory, data);
    } catch (err) {
        return err
    }
}

export const putInventory = async (id: number, data: BodyInventorySimple) => {
    try {
        return await putDataApi(`${routeInventory}/${id}`, data);
    } catch (err) {
        return err
    }
}

export const deleteInventory = async (id: number,) => {
    try {
        return await deleteDataApi(`${routeInventory}/${id}`);
    } catch (err) {
        return err
    }
}

export const putInventoryHistory = async (data: BodyUpdateHistoryInventory) => {
    try {
        return await putDataApi(`${routeInventory}/history`, data);
    } catch (err) {
        return err
    }
}