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
                        novel: val,
                    },
                });
            }
        },
    });

    const novels = computed(() => {
        return Object.keys(Article.meta);
    });

    const currentVolumeIdx = ref(0);

    const currentNovelIdx = computed(() => {
        return novels.value.indexOf(novel.value);
    });

    const novelInfo = computed(() => {
        return Article.meta[novel.value];
    });

    const volumeInfo = computed(() => {
        return novelInfo.value.volumes[currentVolumeIdx.value];
    });

    const articles = computed(() => {
        return novelInfo.value.chapters.filter((c) => {
            return currentVolumeIdx.value === c.volume;
        });
    });

    const currentRoute = computed(() => {
        return {
            name: "shelf",
            params: {
                novel: novel.value,
            },
        };
    });

    function goto(novel: string, volume: number) {
        selectNovel(novel);
        selectVolume(volume);
        router.push(currentRoute.value);
    }

    function selectNovel(key: string | number) {
        if (typeof key === "number") {
            const raw = currentNovelIdx.value + Math.sign(key);
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
        novelInfo,
        volumeInfo,
        articles,
        route: currentRoute,
        goto,
        selectNovel,
        selectVolume,
    };
});
