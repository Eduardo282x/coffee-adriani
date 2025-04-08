import { BodyProduct } from "@/interfaces/product.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeProduct = '/products';

export const getProduct = async () => {
    try {
        return await getDataApi(routeProduct);
    } catch (err) {
        return err
    }
}

export const postProduct = async (data: BodyProduct) => {
    try {
        return await postDataApi(routeProduct, data);
    } catch (err) {
        return err
    }
}

export const putProduct = async (id: number, data: BodyProduct) => {
    try {
        return await putDataApi(`${routeProduct}/${id}`, data);
    } catch (err) {
        return err
    }
}

export const deleteProduct = async (id: number,) => {
    try {
        return await deleteDataApi(`${routeProduct}/${id}`);
    } catch (err) {
        return err
    }
}