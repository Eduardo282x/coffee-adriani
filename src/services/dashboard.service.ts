import { postDataApi, postDataFileApi } from "./base.service";
import { DateRangeFilter } from "@/interfaces/invoice.interface";

const routeDashboard = '/dashboard';

export const getDashboard = async (filter: DateRangeFilter) => {
    try {
        return await postDataApi(`${routeDashboard}`, filter);
    } catch (err) {
        return err
    }
}
export const getDashboardClientDemand = async (filter: DateRangeFilter) => {
    try {
        return await postDataApi(`${routeDashboard}/clients-demand`, filter);
    } catch (err) {
        return err
    }
}
export const getDashboardReport = async (filter: DateRangeFilter) => {
    try {
        return await postDataFileApi(`${routeDashboard}/export`, filter);
    } catch (err) {
        return err
    }
}