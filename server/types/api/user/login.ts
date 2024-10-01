export interface PostLoginBody {
    account: string;
    password: string;
}

export interface PostLoginResponse extends BaseResponse {
    uid?: number;
    nickname?: string;
    identity?: number;
    sign?: string;
}