declare module "~/assets/json/special.json" {
    export type JSpecial = Record<string, TimelineEvent>;

    export interface TimelineEvent {
        mono: string;
        heroines: string[];
        hitokoto?: string;
    }

    const data: JSpecial;
    export default data;
}
