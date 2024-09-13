import { Article } from "~/utils/article";

export const useShelfStore = defineStore("shelf", () => {
    const novel = ref("bikari");
    const currentVolumeIdx = ref(0);
    const infoType = ref(1);

    const currentNovelIdx = computed(() => {
        return Object.keys(Article.meta).indexOf(novel.value);
    });

    const jNovel = computed(() => {
        return Article.meta[novel.value];
    });

    const jVolume = computed(() => {
        return jNovel.value.volumes[currentVolumeIdx.value];
    });

    const jChapters = computed(() => {
        return jNovel.value.chapters.filter((c) => {
            return currentVolumeIdx.value === c.volume;
        });
    });

    function selectNovel(key: string) {
        novel.value = key;
        currentVolumeIdx.value = 0;
    }

    function selectVolume(i: number) {
        currentVolumeIdx.value = i;
    }

    return {
        novel,
        currentNovelIdx,
        currentVolumeIdx,
        infoType,
        jNovel,
        jVolume,
        jChapters,
        selectNovel,
        selectVolume
    };
});