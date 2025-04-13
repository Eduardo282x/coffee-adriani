export interface BaseResponse {
    message: string;
    success: boolean;
}

export interface BaseResponseLogin extends BaseResponse {
    token: string;
}