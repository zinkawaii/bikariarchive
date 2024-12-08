import type { PostLoginResponse } from "~~/server/types/api/user/login";

export interface GetUserInfoResponse extends PostLoginResponse {
    isLogin?: boolean;
}