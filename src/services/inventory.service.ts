import { BodyInventory, BodyInventorySimple, BodyUpdateHistoryInventory, CreateInventoryEntryForm, EntryPaymentForm, PaginatedEntryResponse, EntryPaymentsResponse, EntryStatisticsResponse, PaginatedCutResponse, BodyInventoryLoss, PaginatedLossResponse } from "@/interfaces/inventory.interface";
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
    supplierId?: string;
}

export interface InventoryCutFilter {
    type?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    page?: number;
    limit?: number;
}

export interface InventoryLossFilter {
    typeProduct?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    page?: number;
    limit?: number;
}

export const getInventory = async () => {
    return await getDataApi(routeInventory);
}

export const getInventoryHistory = async (filter: InventoryHistoryFilter) => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filter).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    return await getDataApi(`${routeInventory}/history?${query}`);
}

export const postInventory = async (data: BodyInventory) => {
    return await postDataApi(routeInventory, data);
}

export const putInventory = async (id: number, data: BodyInventorySimple) => {
    return await putDataApi(`${routeInventory}/${id}`, data);
}

export const deleteInventory = async (id: number,) => {
    return await deleteDataApi(`${routeInventory}/${id}`);
}

export const putInventoryHistory = async (data: BodyUpdateHistoryInventory) => {
    return await putDataApi(`${routeInventory}/history`, data);
}

// Inventory Entries
export const getInventoryEntries = async (filter: InventoryHistoryFilter) => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filter).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    return await getDataApi(`${routeInventory}/entries?${query}`) as Promise<PaginatedEntryResponse>;
}

export const getInventoryEntryById = async (id: number) => {
    return await getDataApi(`${routeInventory}/entries/${id}`);
}

export const createInventoryEntry = async (data: CreateInventoryEntryForm) => {
    return await postDataApi(`${routeInventory}/entries`, data);
}

export const updateInventoryEntry = async (id: number, data: CreateInventoryEntryForm) => {
    return await putDataApi(`${routeInventory}/entries/${id}`, data);
}

export const deleteInventoryEntry = async (id: number) => {
    return await deleteDataApi(`${routeInventory}/entries/${id}`);
}

// Enterprise Entries (solo movementType=IN)
export const getEnterpriseEntries = async (filter: InventoryHistoryFilter) => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filter).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    return await getDataApi(`${routeInventory}/enterprise?${query}`) as Promise<PaginatedEntryResponse>;
}

export const getEnterpriseEntryById = async (id: number) => {
    return await getDataApi(`${routeInventory}/enterprise/${id}`);
}

export const getEntryStatistics = async (filter: Omit<InventoryHistoryFilter, 'page' | 'limit'>): Promise<EntryStatisticsResponse | null> => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filter).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    const queryString = query ? `?${query}` : '';
    return await getDataApi(`${routeInventory}/entries/statistics${queryString}`) as Promise<EntryStatisticsResponse>;
}

// Entry Payments
const routeEntryPayments = '/entry-payments';

export const getEntryPayments = async (entryId: number): Promise<EntryPaymentsResponse | null> => {
    return await getDataApi(`${routeEntryPayments}/entry/${entryId}`) as Promise<EntryPaymentsResponse>;
}

export const createEntryPayment = async (data: EntryPaymentForm) => {
    return await postDataApi(routeEntryPayments, data);
}

export const associateEntryPayment = async (data: { inventoryEntryId: number; paymentId: number; amount: number }) => {
    return await postDataApi(`${routeEntryPayments}/associate`, data);
}

export const disassociateEntryPayment = async (data: { inventoryEntryId: number; paymentId: number }) => {
    return await putDataApi(`${routeEntryPayments}/disassociate`, data);
}

export const updateEntryPayment = async (paymentId: number, data: EntryPaymentForm) => {
    return await putDataApi(`${routeEntryPayments}/${paymentId}`, data);
}

export const deleteEntryPayment = async (paymentId: number) => {
    return await deleteDataApi(`${routeEntryPayments}/${paymentId}`);
}

//Inventory Cuts

export const getInventoryCut = async (filter: InventoryCutFilter): Promise<PaginatedCutResponse | null> => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filter).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    const queryString = query ? `?${query}` : '';
    return await getDataApi(`${routeInventory}/cuts${queryString}`) as Promise<PaginatedCutResponse>;
}

// Inventory Losses (merma)

export const createInventoryLoss = async (data: BodyInventoryLoss) => {
    return await postDataApi(`${routeInventory}/losses`, data);
}

export const getInventoryLosses = async (filter: InventoryLossFilter): Promise<PaginatedLossResponse | null> => {
    const cleanFilters = Object.fromEntries(
        Object.entries(filter).filter(([, value]) =>
            value !== undefined && value !== null && value !== ''
        )
    );

    const query = Object.keys(cleanFilters)
        .map(key => `${key}=${encodeURIComponent(cleanFilters[key as keyof typeof cleanFilters])}`)
        .join('&');

    const queryString = query ? `?${query}` : '';
    return await getDataApi(`${routeInventory}/losses${queryString}`) as Promise<PaginatedLossResponse>;
}
