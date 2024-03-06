<script setup>
    const readRecordStore = useReadRecordStore();
    const settingStore = useSettingStore();
    const route = useRoute();
    const router = useRouter();

    //获取参数
    const { novel, index } = route.params;

    //初始化
    const art = new Article(novel, index);

    //错误跳转
    if (art.error) {
        router.replace({ name: "catalogue" });
        throw "Article Not Found (404)";
    }

    //设置元信息
    useSeoMeta({
        title: `${art.title} - ${art.volumeInfo.title}`,
        ogTitle: art.title,
        ogType: "article",
        ogNovelAuthor: art.novelInfo.author,
        ogNovelBook_name: art.novelInfo.title,
        ogNovelCategory: art.novelInfo.tag.join(",")
    });

    const state = ref({
        readCount: 0,
        content: ""
    });

    //上一章
    const toLast = art.isFirstInVol ? "上一卷" : "上一章";
    const toLastClass = { invisible: art.isFirst };
    const toLastChapter = art.isFirst ? {} : {
        params: {
            index: art.lastIndex
        }
    };

    //下一章
    const toNext = art.isLastInVol ? "下一卷" : "下一章";
    const toNextClass = { invisible: art.isLast };
    const toNextChapter = art.isLast ? {} : {
        params: {
            index: art.nextIndex
        }
    };

    //上下章快捷键
    useEventListener("keyup", (event) => {
        if (!art.isFirst && event.key === settingStore.get("shortcut-last")) {
            router.push(toLastChapter);
        }
        else if (!art.isLast && event.key === settingStore.get("shortcut-next")) {
            router.push(toNextChapter);
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

    //获取正文
    const { data } = await useFetch("/api/article", {
        query: {
            novel,
            index
        }
    });

    const { error, content, readCount } = data.value;
    if (error === 0) {
        state.value.content = content;
        state.value.readCount = readCount;
    }
</script>

<template>
    <coco-widget>
        <header class="novel-header">
            <nuxt-link class="novel-wrap-top" :class="toLastClass" :to="toLastChapter">
                <fa-icon icon="chevron-left"/>
                <span>{{ toLast }}</span>
            </nuxt-link>
            <div>
                <h1 class="novel-title">{{ art.title }}</h1>
                <ul class="novel-information">
                    <li>
                        <fa-icon icon="eye"/>
                        <span>{{ state.readCount }} 阅读</span>
                    </li>
                    <li>
                        <fa-icon icon="pen-to-square"/>
                        <span>{{ art.wordCount }} 字</span>
                    </li>
                    <li>
                        <fa-icon icon="pen"/>
                        <time>{{ art.publishDate }}</time>
                    </li>
                    <li>
                        <fa-icon :icon="[`far`, `clock`]"/>
                        <time>{{ art.updateDate }}</time>
                    </li>
                </ul>
            </div>
            <nuxt-link class="novel-wrap-top" :class="toNextClass" :to="toNextChapter">
                <span>{{ toNext }}</span>
                <fa-icon icon="chevron-right"/>
            </nuxt-link>
        </header>
        <novel-article class="novel-text" :content="state.content" :enabled="art.runtime"/>
        <footer class="novel-footer">
            <p v-if="art.ending" class="novel-endding">THE END</p>
            <div class="novel-copyright">
                <p><span class="meta">本章作者</span><coco-link :to="{ name: `home` }">{{ art.novelInfo.author }}</coco-link></p>
                <p><span class="meta">本章链接</span><coco-link :to="route.path">https://{{ $config.public.domain + route.path }}</coco-link></p>
                <p><span class="meta">版权声明</span><span>本网站的所有文章除特别声明外，转载均需经过作者本人同意；文章内容仅供个人交流用，禁作商业用途。</span></p>
            </div>
        </footer>
    </coco-widget>
    <div class="novel-wrap-bottom">
        <nuxt-link :class="toLastClass" :to="toLastChapter">{{ toLast }}</nuxt-link>
        <nuxt-link :class="toNextClass" :to="toNextChapter">{{ toNext }}</nuxt-link>
    </div>
</template>

<style lang="scss" scoped>
    .novel-header {
        display: grid;
        grid-template-columns: auto 1fr auto;
        margin-bottom: 16px;
    }

    .novel-title {
        padding-bottom: 8px;
        font-size: 24px;
        line-height: 36px;
        text-align: center;
    }

    .novel-information {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        column-gap: 18px;
        font-size: 12px;
        line-height: 20px;
        color: var(--color-text-info);

        > li {
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    .novel-text {
        padding-inline: var(--cw-large);
        font-family: v-bind("fontFamily");
        font-size: v-bind("fontSize");
    }

    .novel-endding {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        font-size: 13px;
        line-height: 32px;
        color: var(--color-info-light-3);

        &::before, &::after {
            content: "";
            width: 20%;
            height: 1px;
            background-color: var(--color-border-light);
        }
    }

    .novel-copyright {
        margin-top: 16px;
        padding: 8px 16px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        font-size: 14px;
        line-height: 2em;
        word-break: break-word;

        .meta {
            font-weight: bold;
            color: var(--color-theme-text);

            &::after {
                content: "：";
            }
        }
    }

    .novel-wrap-top {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: var(--color-theme-text);

        > svg {
            width: 1em;
            font-size: 42px;
        }
    }

    .novel-wrap-bottom {
        display: flex;
        justify-content: space-between;

        > a {
            width: 40%;
            padding-block: 16px;
            border-radius: 16px;
            box-shadow: var(--box-shadow);
            background: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
            font-weight: bold;
            text-align: center;
            text-shadow: var(--text-shadow);
            color: white;
            cursor: pointer;
        }
    }

    @container main (width < 768px) {
        .novel-wrap-top > span {
            display: none;
        }

        .novel-text {
            padding: 0;
        }
    }
</style>