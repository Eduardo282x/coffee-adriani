import { postDataApi } from "./base.service";
import { ExportDashboard } from "@/interfaces/invoice.interface";

const routeExpenses = '/expenses';

export const getExpenses = async (filter: ExportDashboard) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return await postDataApi(routeExpenses, filter);
    } catch (err) {
        throw err;
    }
}