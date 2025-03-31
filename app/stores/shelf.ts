import { Article } from "~/utils/article";

export const useShelfStore = defineStore("shelf", () => {
    const route = useRoute();
    const router = useRouter();

    let novelRaw: string;
    const novel = computed({
        get() {
            if (route.name === "shelf") {
                novelRaw = route.params.novel as string;
            }
            return novelRaw ?? "bikari";
        },
        set(val) {
            novelRaw = val;
            if (route.name === "shelf") {
                router.replace({
                    params: {
                        novel: val
                    }
                });
            }
        }
    });

    const currentVolumeIdx = ref(0);

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

    const currentRoute = computed(() => {
        return {
            name: "shelf",
            params: {
                novel: novel.value
            }
        };
    });

    function goto(novel: string, volume: number) {
        selectNovel(novel);
        selectVolume(volume);
        router.push(currentRoute.value);
    }

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
        jNovel,
        jVolume,
        jChapters,
        route: currentRoute,
        goto,
        selectNovel,
        selectVolume
    };
});