/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { BaseResponseLogin, BaseResponse } from './base.interface';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export const getDataApi = (endpoint: string) => {
    return api.get(endpoint).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response.data;
    })
}

export const getDataFileApi = (endpoint: string) => {
    return api.get(endpoint, {
        responseType: 'blob'
    }).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response.data;
    })
}

export const getParamsDataApi = (endpoint: string, params: string) => {
    return api.get(endpoint, { params }).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response.data;
    })
}

export const postDataFileGetApi = async (endpoint: string, data: any) => {
    return await api.post(endpoint, data, {
        responseType: 'blob'
    })
        .catch((err) => {
            return err.response.data;
        })
}

export const postDataApi = async (endpoint: string, data: any): Promise<BaseResponseLogin | BaseResponse | any> => {
    return await api.post(endpoint, data).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}

export const postFilesDataApi = async (endpoint: string, formData: FormData): Promise<BaseResponseLogin | BaseResponse> => {
    return await api.put(endpoint, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}
export const postDataFileApi = async (endpoint: string, data: any): Promise<BaseResponseLogin | BaseResponse> => {
    return await api.post(endpoint, data, { responseType: 'blob' }).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}

export const putDataApi = async (endpoint: string, data: any): Promise<BaseResponse> => {
    return await api.put(endpoint, data).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}

export const deleteDataApi = async (endpoint: string): Promise<BaseResponse> => {
    return await api.delete(endpoint).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.data;
    })
}