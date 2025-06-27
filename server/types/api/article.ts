import type { Root } from "@bikari/article";
import type { BaseResponse } from "../index";

export interface GetArticleResponse extends BaseResponse {
    body: Root;
    readCount: number;
    token: string;
}

export interface PatchArticleBody {
    token: string;
}
