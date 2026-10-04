import { BodyClients, BodyBlock, BodyReport } from "@/interfaces/clients.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi, postDataFileApi, getDataFileApi } from "./base.service";

const routeClients = '/clients';
const routeBlocks = `${routeClients}/blocks`;

export const getClients = async () => {
    return await getDataApi(routeClients);
}
export const getClientsExcel = async () => {
    return await getDataFileApi(`${routeClients}/excel`);
}

export const postClients = async (data: BodyClients) => {
    return await postDataApi(routeClients, data);
}

export const putClients = async (id: number, data: BodyClients) => {
    return await putDataApi(`${routeClients}/${id}`, data);
}

export const deleteClients = async (id: number,) => {
    return await deleteDataApi(`${routeClients}/${id}`);
}

export const getBlocks = async () => {
    return await getDataApi(routeBlocks);
}

export const postBlocks = async (data: BodyBlock) => {
    return await postDataApi(routeBlocks, data);
}

export const putBlocks = async (id: number, data: BodyBlock) => {
    return await putDataApi(`${routeBlocks}/${id}`, data);
}

export const deleteBlocks = async (id: number,) => {
    return await deleteDataApi(`${routeBlocks}/${id}`);
}

export const generateReportPDF = async (data: BodyReport) => {
    return await postDataFileApi(`${routeClients}/report`, data);
}
