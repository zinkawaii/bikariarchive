import jArticle, { type JChapter, type JVolume } from "~/dist/json/Article.json";

export const useCatalogueStore = defineStore("catalogue", {
    state: () => ({
        novel: "bikari",
        curOrder: {
            novel: 0,
            volume: 0
        },
        infoType: 1
    }),
    getters: {
        jNovel() {
            return jArticle[this.novel];
        },
        jVolume(): JVolume {
            return this.jNovel.volumes[this.curOrder.volume];
        },
        jChapters(): JChapter[] {
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