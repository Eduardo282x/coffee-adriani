import { BodyClients, BodyBlock } from "@/interfaces/clients.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeClients = '/clients';
const routeBlocks = `${routeClients}/blocks`;

export const getClients = async () => {
    try {
        return await getDataApi(routeClients);
    } catch (err) {
        return err
    }
}

export const postClients = async (data: BodyClients) => {
    try {
        return await postDataApi(routeClients, data);
    } catch (err) {
        return err
    }
}

export const putClients = async (id: number, data: BodyClients) => {
    try {
        return await putDataApi(`${routeClients}/${id}`, data);
    } catch (err) {
        return err
    }
}

export const deleteClients = async (id: number,) => {
    try {
        return await deleteDataApi(`${routeClients}/${id}`);
    } catch (err) {
        return err
    }
}

export const getBlocks = async () => {
    try {
        return await getDataApi(routeBlocks);
    } catch (err) {
        return err
    }
}

export const postBlocks = async (data: BodyBlock) => {
    try {
        return await postDataApi(routeBlocks, data);
    } catch (err) {
        return err
    }
}

export const putBlocks = async (id: number, data: BodyBlock) => {
    try {
        return await putDataApi(`${routeBlocks}/${id}`, data);
    } catch (err) {
        return err
    }
}

export const deleteBlocks = async (id: number,) => {
    try {
        return await deleteDataApi(`${routeBlocks}/${id}`);
    } catch (err) {
        return err
    }
}