import { CollectionBody, CollectionMessageBody, MarkBody } from "@/interfaces/collection.interface";
import { deleteDataApi, getDataApi, getDataFileApi, postDataApi, putDataApi } from "./base.service";

const routeCollection = '/collection';

export const getCollection = async () => {
    return await getDataApi(routeCollection);
}
export const getCollectionHistory = async () => {
    return await getDataApi(`${routeCollection}/history`);
}

export const getCollectionExcel = async () => {
    return await getDataFileApi(`${routeCollection}/export`);
}
export const putCollection = async (id: number, data: CollectionBody) => {
    return await putDataApi(`${routeCollection}/${id}`, data);
}
export const putMarkCollection = async (data: MarkBody) => {
    return await putDataApi(`${routeCollection}/mark-message`, data);
}

export const getMessageCollection = async () => {
    return await getDataApi(`${routeCollection}/messages`);
}
export const postMessageCollection = async (data: CollectionMessageBody) => {
    return await postDataApi(`${routeCollection}/messages`, data);
}
export const putAllMessageCollection = async (messageId: number) => {
    return await putDataApi(`${routeCollection}/message-clients/${messageId}`, {});
}
export const deleteMessageCollection = async (messageId: number) => {
    return await deleteDataApi(`${routeCollection}/messages/${messageId}`);
}
export const postSendMessageCollection = async () => {
    return await postDataApi(`${routeCollection}/send-messages`, {});
}
export const putMessageCollection = async (id: number, data: CollectionMessageBody) => {
    return await putDataApi(`${routeCollection}/messages/${id}`, data);
}
