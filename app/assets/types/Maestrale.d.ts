declare module "~/assets/json/Maestrale.json" {
    export interface JMaestrale {
        baseUrl: string;
        skins: string[];
        audios: MaestraleAudio[];
    }

    export type MaestraleAudio = {
        name: string;
        title: string;
        serif: MaestraleSerif;
    } & {
        [K in `serif_${number | "ex"}`]?: MaestraleSerif;
    };

    export interface MaestraleSerif {
        url: string;
        content: string;
    }

    const data: JMaestrale;
    export default data;
}
