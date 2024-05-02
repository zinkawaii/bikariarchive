export interface GetUserInfoResponse extends BaseResponse {
    uid?: number;
    nickname?: string;
    identity?: number;
    sign?: string;
    isLogin?: boolean;
}