export interface PostLoginBody {
    account: string;
    password: string;
}

export interface PostLoginResponse {
    uid: number;
    nickname: string;
    avatar: string;
    identity: number;
    sign: string;
}
