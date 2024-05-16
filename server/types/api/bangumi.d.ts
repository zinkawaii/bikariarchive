export interface GetBangumiResponse extends BaseResponse {
    list: BangumiData[];
}

export interface BangumiData {
    id: number;
    title: {
        jp: string;
        zh: string;
    };
    cover: string;
    date: string;
}