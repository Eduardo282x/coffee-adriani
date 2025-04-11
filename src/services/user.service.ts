import { BodyUsers } from "@/interfaces/user.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeUsers = '/users';

export const getUsers = async () => {
    try {
        return await getDataApi(routeUsers);
    } catch (err) {
        return err
    }
}

export const postUsers = async (data: BodyUsers) => {
    try {
        return await postDataApi(routeUsers, data);
    } catch (err) {
        return err
    }
}

export const putUsers = async (id: number, data: BodyUsers) => {
    try {
        return await putDataApi(`${routeUsers}/${id}`, data);
    } catch (err) {
        return err
    }
}

export const deleteUsers = async (id: number,) => {
    try {
        return await deleteDataApi(`${routeUsers}/${id}`);
    } catch (err) {
        return err
    }
}

export const getRoles = async () => {
    try {
        return await getDataApi(`${routeUsers}/roles`);
    } catch (err) {
        return err
    }
}