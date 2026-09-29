export interface BaseResponse {
    message: string;
    success: boolean;
}

export interface BaseResponseLogin extends BaseResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface SessionTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
