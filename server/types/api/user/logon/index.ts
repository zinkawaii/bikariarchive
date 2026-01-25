export interface GetLoginBody {
    nickname: string;
    email: string;
    captcha: string;
    password: string;
}

export interface GetLogonResponse {
    uid: number;
    nickname: string;
    identity: number;
}
