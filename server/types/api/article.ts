import type { Root } from "@bikari/article";
import type { BaseResponse } from "../index";

export interface GetArticleResponse extends BaseResponse {
    body: Root;
    token: string;
}

export interface PatchArticleBody {
    token: string;
}

export interface PatchArticleResponse extends BaseResponse {
    count: number;
}
