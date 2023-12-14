<script>
    import VRuntimeTemplate from "vue3-runtime-template";
    import { NuxtImg, MbCode, MbGallery, MbImage } from "#components";

    //需要导入文章的组件
    export default {
        components: {
            "mb-code": MbCode,
            "mb-gallery": MbGallery,
            "mb-image": MbImage,
            "nuxt-img": NuxtImg
        }
    };
</script>

<script setup>
    const config = useRuntimeConfig();
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
        title: `${art.title} - ${art.volName}`,
        ogTitle: art.title,
        ogType: "article",
        ogNovelAuthor: art.novelInfo.author,
        ogNovelBook_name: art.novelInfo.title,
        ogNovelCategory: art.novelInfo.tag.join(",")
    });

    const state = ref({
        author: art.novelInfo.author,
        title: art.title,
        readCount: 0,
        wordCount: 0,
        date: {
            type: "",
            value: "",
            tip: ""
        },
        content: "",
        currentVolume: art.volOrder
    });

    //日期
    const { date } = state.value;
    if (art.date.publish) {
        date.type = "发布";
        date.value = art.date.publish;
    }
    else if (art.date.reco) {
        date.type = "重构";
        date.value = art.date.reco;
        date.tip = "该章节源自旧稿，是在本卷大改时调整章节顺序与修改细节后的产物\n在剧情安排与走向上没有大幅度的变化，但发布时间因结构的切分而难以标明";
    }
    else {
        date.type = "发布";
        date.value = "很久以前";
        date.tip = "该章节的发布时间已经无法追溯";
    }

    //上一章
    const toLastClass = { invisible: art.isFirst };
    const toLastChapter = art.isFirst ? {} : {
        params: {
            index: art.getLastIndex()
        }
    };

    //下一章
    const toNextClass = { invisible: art.isLast };
    const toNextChapter = art.isLast ? {} : {
        params: {
            index: art.getNextIndex()
        }
    };

    if (process.browser) {
        //键盘松开时
        const onKeyup = (event) => {
            if (!art.isFirst && event.key === settingStore.get("shortcut-last")) {
                router.push(toLastChapter);
            }
            else if (!art.isLast && event.key === settingStore.get("shortcut-next")) {
                router.push(toNextChapter);
            }
        };

        //上下章快捷键
        useEventListener("keyup", onKeyup);
    }

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

        //字数统计
        onMounted(() => {
            state.value.wordCount = [...document.querySelectorAll(".novel-text > p")].reduce((count, p) => {
                return count + p.textContent.length;
            }, 0);
        });
    }
</script>

<template>
    <client-only>
        <teleport to=".z-sidebar">
            <reader-catalog :art="art"/>
        </teleport>
    </client-only>
    <div class="content-page">
        <div class="content-group">
            <header class="novel-header">
                <nuxt-link class="novel-wrap-top" :class="toLastClass" :to="toLastChapter">
                    <i class="fas fa-chevron-left"></i>
                    <span>上一章</span>
                </nuxt-link>
                <div class="novel-title">
                    <h2>{{ state.title }}</h2>
                    <div class="novel-information">
                        <span>{{ state.readCount }} 阅读 ／ {{ state.wordCount }} 字</span>
                        <span :title="state.date.tip">{{ state.date.type }}时间：<time>{{ state.date.value }}</time></span>
                    </div>
                </div>
                <nuxt-link class="novel-wrap-top" :class="toNextClass" :to="toNextChapter">
                    <span>下一章</span>
                    <i class="fas fa-chevron-right"></i>
                </nuxt-link>
            </header>
            <article v-if="art.runtime" class="novel-text">
                <v-runtime-template :template="state.content"/>
            </article>
            <article v-else class="novel-text" v-html="state.content"></article>
            <footer class="novel-footer">
                <p v-if="art.novelInfo.type === `novel` && art.isLastInVol" class="novel-endding">THE END</p>
                <div class="novel-copyright">
                    <p><span class="meta">本章作者</span><nuxt-link :to="{ name: `home` }">{{ state.author }}</nuxt-link></p>
                    <p><span class="meta">本章链接</span><nuxt-link :to="route.path">https://{{ config.public.domain + route.path }}</nuxt-link></p>
                    <p><span class="meta">版权声明</span><span>本网站的所有文章除特别声明外，转载均需经过作者本人同意；文章内容仅供个人交流用，禁作商业用途。</span></p>
                </div>
            </footer>
        </div>
        <div class="novel-wrap-bottom">
            <nuxt-link :class="toLastClass" :to="toLastChapter">上一章</nuxt-link>
            <nuxt-link :class="toNextClass" :to="toNextChapter">下一章</nuxt-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .novel-header {
        display: flex;
        margin-bottom: 8px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--color-border);
    }

    .novel-title {
        flex: 1;
        text-align: center;

        > h2 {
            padding-block: 8px;
            font-weight: bold;
            line-height: 36px;
        }
    }

    .novel-information {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        column-gap: 20px;
        font-size: 12px;
        line-height: 20px;
        color: var(--color-gray);

        span {
            display: inline-block;
        }
    }

    .novel-text {
        padding: 0 32px;
        font-family: v-bind("fontFamily");
        font-size: v-bind("fontSize");

        :deep(.mb-gallery) {
            margin-block: 16px;
        }
    }

    .novel-endding {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        padding-block: 3px;
        font-size: 13px;
        color: var(--color-border);

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
        line-height: 2;
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
        font-weight: bolder;
        color: var(--color-theme-text);
        cursor: pointer;

        > i {
            width: 1em;
            font-size: 42px;
            translate: 0 2px;
        }
    }

    .novel-wrap-bottom {
        display: flex;
        justify-content: space-between;

        > a {
            width: 40%;
            padding: 16px 0;
            border-radius: 16px;
            box-shadow: var(--box-shadow);
            background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
            font-weight: bold;
            text-align: center;
            text-shadow: var(--text-shadow);
            color: white;
            cursor: pointer;
        }
    }

    @media (width >= 1024px) {
        .novel-header {
            margin-top: -16px;
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