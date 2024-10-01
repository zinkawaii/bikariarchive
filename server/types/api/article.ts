import type { Root } from "@bikari/process";

export interface GetArticleResponse extends BaseResponse {
    body?: Root;
    readCount?: number;
    token?: string;
}

export interface PatchArticleBody {
    token: string;
}