<script lang="ts" setup>
    import { toString } from "mdast-util-to-string";

    const { novel, index } = defineProps<{
        novel: string;
        index: string;
    }>();

    const { hooks } = useHookStore();
    const readRecordStore = useReadRecordStore();
    const settingStore = useSettingStore();
    const toastStore = useToastStore();
    const router = useRouter();

    //初始化
    const art = Article.for(novel, index);
    if (!art) {
        throw new Error(`Article(${novel}, ${index}) is invalid.`);
    }

    //上下章快捷键
    useEventListener("keyup", (event) => {
        if (isFocusedEditable()) return;

        if (!art.isFirst && event.key === settingStore.get("shortcut-last")) {
            router.push(art.prev?.route);
        }
        else if (!art.isLast && event.key === settingStore.get("shortcut-next")) {
            router.push(art.next?.route);
        }
    });

    //字体系列
    const fontFamily = computed(() => {
        return {
            0: "inherit",
            1: "宋体",
            2: "楷体"
        }[settingStore.get("font-family")];
    });

    //字体大小
    const fontSize = computed(() => {
        return {
            0: 14,
            1: 16,
            2: 18
        }[settingStore.get("font-size")] + "px";
    });

    //写入阅读记录
    readRecordStore.set(art.novel, {
        index: art.index,
        title: art.title
    });

    //密码
    const password = ref("");
    const decrypted = ref(false);

    //获取正文
    const { execute, status, data: post } = useLazyFetch("/api/article", {
        query: {
            novel,
            index,
            password
        },
        immediate: !art.encrypted,
        watch: [art]
    });

    //设置元信息
    useSeoMeta({
        title: `${art.title} - ${art.volumeInfo.title}`,
        ogTitle: art.title,
        ogType: "article",
        // @ts-expect-error 自定义键值
        ogArticleAuthor: art.novelInfo.author,
        ogArticleSection: art.novelInfo.type,
        ogArticleTag: art.novelInfo.tag.join(","),
        ogArticlePublished_time: art.publishDate,
        ogArticleModified_time: art.updateDate,
        description: () => post.value?.body.children
            .filter((node) => node.tag === "p")
            .map((p) => toString(p))
            .join("")
            .slice(0, 128)
    });

    //添加阅读记录
    onMounted(async () => {
        await until(status).toBe("success");

        $fetch("/api/article", {
            method: "patch",
            body: {
                token: post.value.token
            }
        });
    });

    //防抖化请求
    const debouncedExecute = Zin.debounce(async () => {
        await execute();
        switch (post.value.error) {
            case 1:
                toastStore.error("[article]:password", "密码错误");
                break;
            default:
                decrypted.value = true;
        }
    }, {
        title: "请求"
    });
</script>

<template>
    <meow-widget>
        <novel-header :art :post/>
        <novel-decrypt v-if="art.encrypted && !decrypted" v-model="password" @decrypt="debouncedExecute"/>
        <mb-skeleton v-else-if="status !== `success`"/>
        <novel-article
            v-else
            :body="post.body"
            @vue:mounted="hooks.callHook(`reader:rendered`)"
        />
        <novel-footer :art/>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .novel-text {
        font-family: v-bind("fontFamily");
        font-size: v-bind("fontSize");
    }

    @include viewport(">md") {
        :where(.mb-skeleton, .novel-text) {
            padding-inline: var(--meow-large);
        }
    }
</style>