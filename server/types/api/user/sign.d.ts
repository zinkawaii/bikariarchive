export interface PutUserSignBody {
    content: string;
}

export interface PutUserSignResponse extends BaseResponse {
    content?: string;
}