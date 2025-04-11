import { BodyInventory } from "@/interfaces/inventory.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeInventory = '/inventory';

export const getInventory = async () => {
    try {
        return await getDataApi(routeInventory);
    } catch (err) {
        return err
    }
}

export const getInventoryHistory = async () => {
    try {
        return await getDataApi(`${routeInventory}/history`);
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

export const putInventory = async (id: number, data: BodyInventory) => {
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