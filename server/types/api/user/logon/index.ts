export interface GetLoginBody {
    nickname: string;
    email: string;
    verify: string;
    password: string;
}

export interface GetLogonResponse extends BaseResponse {
    uid: number;
    nickname: string;
    identity: number;
}
