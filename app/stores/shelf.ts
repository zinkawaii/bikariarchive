import { Article } from "~/utils/Article";

export const useShelfStore = defineStore("shelf", () => {
    const novel = ref("bikari");
    const currentNovelIdx = ref(0);
    const currentVolumeIdx = ref(0);
    const infoType = ref(1);

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

    function selectNovel(key: string, i: number) {
        novel.value = key;
        currentNovelIdx.value = i;
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