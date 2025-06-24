import { postDataApi } from "./base.service";
import { DateRangeFilter } from "@/interfaces/invoice.interface";

const routeExpenses = '/expenses';

export const getExpenses = async (filter: DateRangeFilter) => {
    try {
        return await postDataApi(routeExpenses, filter);
    } catch (err) {
        return err;
    }
}