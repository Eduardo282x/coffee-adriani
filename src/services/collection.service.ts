import { CollectionBody, CollectionMessageBody, MarkBody } from "@/interfaces/collection.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

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
export const putMarkCollection = async (data: MarkBody) => {
    try {
        return await putDataApi(`${routeCollection}/mark-message`, data);
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
export const putAllMessageCollection = async (messageId: number) => {
    try {
        return await putDataApi(`${routeCollection}/message-clients/${messageId}`, {});
    } catch (err) {
        return err
    }
}
export const deleteMessageCollection = async (messageId: number) => {
    try {
        return await deleteDataApi(`${routeCollection}/messages/${messageId}`);
    } catch (err) {
        return err
    }
}
export const postSendMessageCollection = async () => {
    try {
        return await postDataApi(`${routeCollection}/send-messages`, {});
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
