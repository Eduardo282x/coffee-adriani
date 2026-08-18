import {  getDataApi, getDataFileApi, postDataApi, postDataFileApi } from "./base.service";
import { ExportDashboard } from "@/interfaces/invoice.interface";

const routeDashboard = '/dashboard';

export const getDashboard = async (filter: ExportDashboard) => {
    try {
        return await postDataApi(`${routeDashboard}`, filter);
    } catch (err) {
        return err
    }
}
export const getDashboardClientDemand = async (filter: ExportDashboard) => {
    try {
        const query = `?type=${filter.type}&startDate=${filter.startDate}&endDate=${filter.endDate}`;
        return await getDataApi(`${routeDashboard}/clients-demand${query}`);
    } catch (err) {
        return err
    }
}
export const getDashboardReport = async (filter: ExportDashboard) => {
    try {
        return await postDataFileApi(`${routeDashboard}/export/v2`, filter);
    } catch (err) {
        return err
    }
}
export const getDashboardSnapshots = async (filter: ExportDashboard) => {
    try {
        const query = `?type=${filter.type}&startDate=${filter.startDate}&endDate=${filter.endDate}`;
        return await getDataApi(`${routeDashboard}/snapshots${query}`);
    } catch (err) {
        return err
    }
}
export const downloadDashboardSnapshot = async (id: number) => {
    try {
        return await getDataFileApi(`${routeDashboard}/snapshots/${id}/download`);
    } catch (err) {
        return err
    }
}