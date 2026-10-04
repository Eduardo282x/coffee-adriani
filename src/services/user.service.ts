import { BodyUsers } from "@/interfaces/user.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeUsers = '/users';

export const getUsers = async () => {
    return await getDataApi(routeUsers);
}

export const postUsers = async (data: BodyUsers) => {
    return await postDataApi(routeUsers, data);
}

export const putUsers = async (id: number, data: BodyUsers) => {
    return await putDataApi(`${routeUsers}/${id}`, data);
}

export const deleteUsers = async (id: number,) => {
    return await deleteDataApi(`${routeUsers}/${id}`);
}

export const getRoles = async () => {
    return await getDataApi(`${routeUsers}/roles`);
}
