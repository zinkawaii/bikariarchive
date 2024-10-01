export interface GetBangumiResponse extends BaseResponse {
    total: number;
    sizes: number;
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