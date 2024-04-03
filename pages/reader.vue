<script setup>
    const readRecordStore = useReadRecordStore();
    const settingStore = useSettingStore();
    const route = useRoute();
    const router = useRouter();

    //获取参数
    const { novel, index } = route.params;

    //初始化
    const art = Article.for(novel, index);

    //设置元信息
    useSeoMeta({
        title: `${art.title} - ${art.volumeInfo.title}`,
        ogTitle: art.title,
        ogType: "article",
        ogNovelAuthor: art.novelInfo.author,
        ogNovelBook_name: art.novelInfo.title,
        ogNovelCategory: art.novelInfo.tag.join(",")
    });

    //上一章
    const toPrev = art.isFirstInVol ? "上一卷" : "上一章";
    const toPrevClass = { invisible: art.isFirst };
    const toPrevRoute = art.prev?.route;

    //下一章
    const toNext = art.isLastInVol ? "下一卷" : "下一章";
    const toNextClass = { invisible: art.isLast };
    const toNextRoute = art.next?.route;

    //上下章快捷键
    useEventListener("keyup", (event) => {
        if (!art.isFirst && event.key === settingStore.get("shortcut-last")) {
            router.push(toPrevRoute);
        }
        else if (!art.isLast && event.key === settingStore.get("shortcut-next")) {
            router.push(toNextRoute);
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
    const { pending, data: post } = useLazyFetch("/api/article", {
        query: {
            novel,
            index
        }
    });
</script>

<template>
    <coco-widget>
        <header class="novel-header">
            <nuxt-link class="novel-wrap-top" :class="toPrevClass" :to="toPrevRoute">
                <fa icon="chevron-left"/>
                <span>{{ toPrev }}</span>
            </nuxt-link>
            <div>
                <h1 class="novel-title">{{ art.title }}</h1>
                <ul class="novel-information">
                    <li>
                        <fa icon="eye"/>
                        <span>{{ post?.readCount || 0 }} 阅读</span>
                    </li>
                    <li>
                        <fa icon="pen-to-square"/>
                        <span>{{ art.wordCount }} 字</span>
                    </li>
                    <li>
                        <fa icon="pen"/>
                        <time>{{ art.publishDate }}</time>
                    </li>
                    <li>
                        <fa :icon="[`far`, `clock`]"/>
                        <time>{{ art.updateDate }}</time>
                    </li>
                </ul>
            </div>
            <nuxt-link class="novel-wrap-top" :class="toNextClass" :to="toNextRoute">
                <span>{{ toNext }}</span>
                <fa icon="chevron-right"/>
            </nuxt-link>
        </header>
        <mb-skeleton v-if="pending" animated/>
        <novel-article v-else class="novel-text" :content="post.content" :enabled="art.runtime"/>
        <footer class="novel-footer">
            <p v-if="art.ending" class="novel-endding">THE END</p>
            <div class="novel-copyright">
                <nuxt-img class="copyright-avatar" :src="$config.public.avatar"/>
                <div class="right">
                    <div class="copyright-crumb">
                        <span>{{ art.novelInfo.title }}</span>
                        <fa class="text-gray" icon="chevron-right"/>
                        <span>{{ art.volumeInfo.title }}</span>
                        <fa class="text-gray" icon="chevron-right"/>
                        <span>{{ art.title }}</span>
                    </div>
                    <p class="text-gray">本网站的所有文章除特别声明外，转载均需经过作者本人同意；文章内容仅供个人交流用，禁作商业用途。</p>
                </div>
            </div>
        </footer>
    </coco-widget>
    <div class="novel-wrap-bottom">
        <nuxt-link :class="toPrevClass" :to="toPrevRoute">{{ toPrev }}</nuxt-link>
        <nuxt-link :class="toNextClass" :to="toNextRoute">{{ toNext }}</nuxt-link>
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
        display: flex;
        overflow: auto;
        margin-top: 16px;
        border: 1px solid var(--color-border-lighter);
        border-radius: var(--circle-radius);
        background-color: var(--color-background);
        font-size: 14px;
        line-height: 2em;

        &::-webkit-scrollbar {
            display: none;
        }

        .right {
            padding: 12px 16px;
            text-wrap: nowrap;
        }
    }

    .copyright-avatar {
        width: 80px;
        border-radius: var(--circle-radius);
    }

    .copyright-crumb {
        display: flex;
        align-items: center;
        gap: 6px;
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

    @container main (width >= 768px) {
        .mb-skeleton, .novel-text {
            padding-inline: var(--cw-large);
        }
    }

    @container main (width < 768px) {
        .novel-wrap-top > span {
            display: none;
        }
    }
</style>