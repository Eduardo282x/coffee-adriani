import { CollectionBody, CollectionMessageBody } from "@/interfaces/collection.interface";
import { getDataApi, postDataApi, putDataApi } from "./base.service";

const routeCollection = '/collection';

export const getCollection = async () => {
    try {
        return await getDataApi(routeCollection);
    } catch (err) {
        return err
    }
}
export const putCollection = async (id: number, data: CollectionBody) => {
    try {
        return await putDataApi(`${routeCollection}/${id}`, data);
    } catch (err) {
        return err
    }
}

export const getMessageCollection = async () => {
    try {
        return await getDataApi(`${routeCollection}/messages`);
    } catch (err) {
        return err
    }
}
export const postMessageCollection = async (data: CollectionMessageBody) => {
    try {
        return await postDataApi(`${routeCollection}/messages`, data);
    } catch (err) {
        return err
    }
}
export const putMessageCollection = async (id: number, data: CollectionMessageBody) => {
    try {
        return await putDataApi(`${routeCollection}/messages/${id}`, data);
    } catch (err) {
        return err
    }
}
