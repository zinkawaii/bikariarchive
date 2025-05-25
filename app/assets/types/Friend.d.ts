declare module "~/assets/json/Friend.json" {
    export type JFriend = FriendItem[];

    export interface FriendItem {
        title: string;
        link: string;
        icon: string;
        nickname: string;
        description: string;
    }

    const data: JFriend;
    export default data;
}
