declare type ErrorResponse = {
    message: string;
    code: number;
}
declare type SuccessResponse<T> = {
    message: string;
} & T;

declare type ApiResponse<T> = ErrorResponse | SuccessResponse<T>;

export interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}
