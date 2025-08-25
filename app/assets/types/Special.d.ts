declare module "~/assets/json/Special.json" {
    export type JSpecial = Record<string, TimelineEvent>;

    export interface TimelineEvent {
        mono: string;
        heroines: string[];
        hitokoto?: string;
    }

    const data: JSpecial;
    export default data;
}
