export interface PostLoginBody {
    account: string;
    password: string;
}

export interface PostLoginResponse extends BaseResponse {
    uid: number;
    nickname: string;
    avatar: string;
    identity: number;
    sign: string;
}