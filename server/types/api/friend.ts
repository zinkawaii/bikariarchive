import type { BaseResponse } from "../index";

export interface GetFriendResponse extends BaseResponse {
    list: FriendData[];
}

export interface FriendData {
    title: string;
    link: string;
    icon: string;
    description: string;
}
