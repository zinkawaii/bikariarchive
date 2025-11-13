export interface GetFriendResponse {
    list: FriendData[];
}

export interface FriendData {
    title: string;
    link: string;
    icon: string;
    description: string;
}
