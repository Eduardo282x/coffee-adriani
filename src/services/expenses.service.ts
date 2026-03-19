import { postDataApi } from "./base.service";
import { DateRangeFilter } from "@/interfaces/invoice.interface";

const routeExpenses = '/expenses';

export const getExpenses = async (filter: DateRangeFilter) => {
    // eslint-disable-next-line no-useless-catch
    try {
        return await postDataApi(routeExpenses, filter);
    } catch (err) {
        throw err;
    }
}