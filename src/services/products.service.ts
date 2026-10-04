import { BodyProduct, DolarBody } from "@/interfaces/product.interface";
import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "./base.service";

const routeProduct = '/products';

export const getProduct = async () => {
    return await getDataApi(routeProduct);
}

export const getProductType = async () => {
    return await getDataApi(`${routeProduct}/type`);
}

export const getProductDolar = async () => {
    return await getDataApi(`${routeProduct}/dolar`);
}

export const getProductDolarFilter = async (date: string) => {
    return await getDataApi(`${routeProduct}/dolar-filter?date=${date}`);
}

export const updateDolarAutomatic = async () => {
    return await postDataApi(`${routeProduct}/dolar/automatic`, {});
}

export const updateDolar = async (data: DolarBody) => {
    return await postDataApi(`${routeProduct}/dolar`, data);
}

export const getProductHistory= async () => {
    return await getDataApi(`${routeProduct}/history`);
}

export const postProduct = async (data: BodyProduct) => {
    return await postDataApi(routeProduct, data);
}

export const putProduct = async (id: number, data: BodyProduct) => {
    return await putDataApi(`${routeProduct}/${id}`, data);
}

export const deleteProduct = async (id: number,) => {
    return await deleteDataApi(`${routeProduct}/${id}`);
}
