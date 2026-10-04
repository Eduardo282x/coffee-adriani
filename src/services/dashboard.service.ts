import {  getDataApi, getDataFileApi, postDataApi, postDataFileApi } from "./base.service";
import { ExportDashboard } from "@/interfaces/invoice.interface";

const routeDashboard = '/dashboard';

export const getDashboard = async (filter: ExportDashboard) => {
    return await postDataApi(`${routeDashboard}`, filter);
}
export const getDashboardClientDemand = async (filter: ExportDashboard) => {
    const query = `?type=${filter.type}&startDate=${filter.startDate}&endDate=${filter.endDate}`;
    return await getDataApi(`${routeDashboard}/clients-demand${query}`);
}
export const getDashboardReport = async (filter: ExportDashboard) => {
    return await postDataFileApi(`${routeDashboard}/export/v2`, filter);
}
export const getDashboardSnapshots = async (filter: ExportDashboard) => {
    const query = `?type=${filter.type}&startDate=${filter.startDate}&endDate=${filter.endDate}`;
    return await getDataApi(`${routeDashboard}/snapshots${query}`);
}
export const downloadDashboardSnapshot = async (id: number) => {
    return await getDataFileApi(`${routeDashboard}/snapshots/${id}/download`);
}
