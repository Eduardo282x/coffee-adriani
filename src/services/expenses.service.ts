import { getDataApi } from "./base.service";

const routeExpenses = '/expenses';

export const getExpenses = async () => {
    try {
        return await getDataApi(routeExpenses);
    } catch (err) {
        return err;
    }
}