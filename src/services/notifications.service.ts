import { getDataApi, putDataApi } from "./base.service";

const routeNotifications = '/notifications';

export const getNotifications = async () => {
    try {
        return await getDataApi(routeNotifications);
    } catch (err) {
        return err;
    }
}

export const markNotificationAsRead = async (id: number) => {
    try {
        return await putDataApi(`${routeNotifications}/mark-read/${id}`, {});
    } catch (err) {
        return err;
    }
}