export interface GetArticleResponse extends BaseResponse {
    token?: string;
    content?: string;
    readCount?: number;
}

export interface PatchArticleBody {
    token: string;
}