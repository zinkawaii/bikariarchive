import type { RouteLocationRaw } from "vue-router";

export const useShelfStore = defineStore("shelf", () => {
    const route = useRoute();
    const router = useRouter();

    let novelRaw: string;
    let volumeRaw: number;

    const novel = computed({
        get() {
            if (route.name === "shelf") {
                novelRaw = route.params.novel;
            }
            return novelRaw ?? "bikari";
        },
        set(val) {
            novelRaw = val;
            if (route.name === "shelf") {
                router.replace({
                    params: {
                        novel: val,
                        volume: volumeRaw,
                    },
                });
            }
        },
    });

    const volume = computed({
        get() {
            if (route.name === "shelf") {
                volumeRaw = Number(route.params.volume);
            }
            return volumeRaw || 0;
        },
        set(val) {
            volumeRaw = val;
            if (route.name === "shelf") {
                router.replace({
                    params: {
                        novel: novelRaw,
                        volume: val,
                    },
                });
            }
        },
    });

    const novels = computed(() => {
        return Object.keys(Article.meta);
    });

    const novelInfo = computed(() => {
        return Article.meta[novel.value];
    });

    const volumeInfo = computed(() => {
        return novelInfo.value.volumes[volume.value];
    });

    const articles = computed(() => {
        return novelInfo.value.chapters.filter((art) => art.volume === volume.value);
    });

    const currentRoute = computed<RouteLocationRaw>(() => {
        return {
            name: "shelf",
            params: {
                novel: novel.value,
                volume: volume.value,
            },
        };
    });

    function selectNovel(name: string) {
        novel.value = name;
        volume.value = 0;
    }

    function selectVolume(i: number) {
        volume.value = i;
    }

    return {
        novel,
        novels,
        novelInfo,
        volume,
        volumeInfo,
        articles,
        route: currentRoute,
        selectNovel,
        selectVolume,
    };
});
