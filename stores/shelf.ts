import type { JNovel, JVolume } from "@bikari/process";
import { Article } from "~/utils/Article";

export const useShelfStore = defineStore("shelf", {
    state: () => ({
        novel: "bikari",
        curOrder: {
            novel: 0,
            volume: 0
        },
        infoType: 1
    }),
    getters: {
        jNovel(): JNovel<Article> {
            return Article.meta[this.novel];
        },
        jVolume(): JVolume {
            return this.jNovel.volumes[this.curOrder.volume];
        },
        jChapters(): Article[] {
            return this.jNovel.chapters.filter((c) => {
                return this.curOrder.volume === c.volume;
            });
        }
    },
    actions: {
        selectNovel(key: string, i: number) {
            this.novel = key;
            this.curOrder.novel = i;
            this.curOrder.volume = 0;
        },
        selectVolume(i: number) {
            this.curOrder.volume = i;
        }
    }
});