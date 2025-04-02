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

    const novels = computed(() => {
        return Object.keys(Article.meta);
    });

    const currentVolumeIdx = ref(0);

    const currentNovelIdx = computed(() => {
        return novels.value.indexOf(novel.value);
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

    function selectNovel(key: string): void;
    function selectNovel(delta: number): void;
    function selectNovel(key: string | number) {
        if (typeof key === "number") {
            const raw = currentNovelIdx.value + signof(key);
            const idx = clamp(0, raw, novels.value.length - 1);
            key = novels.value[idx];
        }
        novel.value = key;
        currentVolumeIdx.value = 0;
    }

    function selectVolume(i: number) {
        currentVolumeIdx.value = i;
    }

    return {
        novel,
        novels,
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