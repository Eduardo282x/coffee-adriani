import { BodyInventory, BodyInventorySimple, BodyUpdateHistoryInventory, CreateInventoryEntryForm, EntryPaymentForm, PaginatedEntryResponse, EntryPaymentsResponse } from "@/interfaces/inventory.interface";
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

// Inventory Entries
export const getInventoryEntries = async (filter: InventoryHistoryFilter) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filter).filter(([, value]) =>
                value !== undefined && value !== null && value !== ''
            )
        );

        const query = Object.keys(cleanFilters)
            .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
            .join('&');

        return await getDataApi(`${routeInventory}/entries?${query}`) as Promise<PaginatedEntryResponse>;
    } catch (err) {
        return err
    }
}

export const getInventoryEntryById = async (id: number) => {
    try {
        return await getDataApi(`${routeInventory}/entries/${id}`);
    } catch (err) {
        return err
    }
}

export const createInventoryEntry = async (data: CreateInventoryEntryForm) => {
    try {
        return await postDataApi(`${routeInventory}/entries`, data);
    } catch (err) {
        return err
    }
}

export const updateInventoryEntry = async (id: number, data: CreateInventoryEntryForm) => {
    try {
        return await putDataApi(`${routeInventory}/entries/${id}`, data);
    } catch (err) {
        return err
    }
}

export const deleteInventoryEntry = async (id: number) => {
    try {
        return await deleteDataApi(`${routeInventory}/entries/${id}`);
    } catch (err) {
        return err
    }
}

// Enterprise Entries (solo movementType=IN)
export const getEnterpriseEntries = async (filter: InventoryHistoryFilter) => {
    try {
        const cleanFilters = Object.fromEntries(
            Object.entries(filter).filter(([, value]) =>
                value !== undefined && value !== null && value !== ''
            )
        );

        const query = Object.keys(cleanFilters)
            .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
            .join('&');

        return await getDataApi(`${routeInventory}/enterprise?${query}`) as Promise<PaginatedEntryResponse>;
    } catch (err) {
        return err
    }
}

export const getEnterpriseEntryById = async (id: number) => {
    try {
        return await getDataApi(`${routeInventory}/enterprise/${id}`);
    } catch (err) {
        return err
    }
}

// Entry Payments
const routeEntryPayments = '/entry-payments';

export const getEntryPayments = async (entryId: number): Promise<EntryPaymentsResponse | null> => {
    try {
        return await getDataApi(`${routeEntryPayments}/entry/${entryId}`) as Promise<EntryPaymentsResponse>;
    } catch (err) {
        console.log(err);
        return null
    }
}

export const createEntryPayment = async (data: EntryPaymentForm) => {
    try {
        return await postDataApi(routeEntryPayments, data);
    } catch (err) {
        return err
    }
}

export const associateEntryPayment = async (data: { inventoryEntryId: number; paymentId: number; amount: number }) => {
    try {
        return await postDataApi(`${routeEntryPayments}/associate`, data);
    } catch (err) {
        return err
    }
}

export const disassociateEntryPayment = async (data: { inventoryEntryId: number; paymentId: number }) => {
    try {
        return await putDataApi(`${routeEntryPayments}/disassociate`, data);
    } catch (err) {
        return err
    }
}