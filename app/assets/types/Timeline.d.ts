declare module "~/assets/json/Timeline.json" {
    export type JTimeline = Record<string, TimelineEvent>;

    export interface TimelineEvent {
        mono: string;
        heroines: string[];
        hitokoto?: string;
    }

    const data: JTimeline;
    export default data;
}
