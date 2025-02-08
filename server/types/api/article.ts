import type { Root } from "@bikari/article";

export interface GetArticleResponse extends BaseResponse {
    body: Root;
    readCount: number;
    token: string;
}

export interface PatchArticleBody {
    token: string;
}