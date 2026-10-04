import { getDataApi, putDataApi } from "./base.service";

const routeNotifications = '/notifications';

export const getNotifications = async () => {
    return await getDataApi(routeNotifications);
}

export const markNotificationAsRead = async (id: number) => {
    return await putDataApi(`${routeNotifications}/mark-read/${id}`, {});
}
