<script>
    import VRuntimeTemplate from "vue3-runtime-template";
    import { NuxtImg, MbCode } from "#components";

    //需要导入文章的组件
    export default {
        components: {
            "mb-code": MbCode,
            "nuxt-img": NuxtImg
        }
    }
</script>

<script setup>
    import jArticle from "~/dist/json/Article.json";

    const config = useRuntimeConfig();
    const readRecordStore = useReadRecordStore();
    const route = useRoute();
    const router = useRouter();

    //获取参数
    const { novel, index } = route.params;

    //初始化
    const art = new Article(novel, index);

    //错误跳转
    if (art.error) {
        router.replace("/catalogue");
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
        fontFamily: null,
        fontSize: null,
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
    const toLastClass = { hidden: art.isFirst };
    const toLastChapter = art.isFirst ? {} : {
        params: {
            index: art.getLastIndex()
        }
    };

    //下一章
    const toNextClass = { hidden: art.isLast };
    const toNextChapter = art.isLast ? {} : {
        params: {
            index: art.getNextIndex()
        }
    };

    //本章链接
    const currentUrl = computed(() => {
        return "https://" + config.public.domain + route.path;
    });

    //本卷章节
    const jChapter = computed(() => {
        return jArticle[novel].chapter.filter((c) => c.volume === state.value.currentVolume);
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
            volOrder: art.volOrder,
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
            <aside class="novel-index">
                <select class="index-volume" :value="art.volOrder" v-model="state.currentVolume">
                    <option v-for="(v, i) in jArticle[novel].volume" :value="i">{{ v.title }}</option>
                </select>
                <ul class="index-list">
                    <li v-for="c in jChapter">
                        <nuxt-link :to="{ name: `reader`, params: { novel, index: c.index }}">{{ c.title }}</nuxt-link>
                    </li>
                </ul>
            </aside>
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
                    <h2 id="Title" style="float: left;">{{ state.title }}</h2>
                    <div class="novel-information">
                        <span>{{ state.readCount }} 阅读 ／ {{ state.wordCount }} 字</span>
                        <span :title="state.date.tip">{{ state.date.type }}时间：{{ state.date.value }}</span>
                    </div>
                </div>
                <nuxt-link class="novel-wrap-top" :class="toNextClass" :to="toNextChapter">
                    <span>下一章</span>
                    <i class="fas fa-chevron-right"></i>
                </nuxt-link>
            </header>
            <article v-if="art.runtime" class="novel-text">
                <v-runtime-template :template="state.content"></v-runtime-template>
            </article>
            <article v-else class="novel-text" v-html="state.content"></article>
            <footer class="novel-copyright">
                <div><span class="meta">本章作者</span><nuxt-link :to="{ name: `home` }">{{ state.author }}</nuxt-link></div>
                <div><span class="meta">本章链接</span><nuxt-link class="content" :to="route.path">{{ currentUrl }}</nuxt-link></div>
                <div><span class="meta">版权声明</span><span class="content">本网站的所有文章除特别声明外，转载均需经过作者本人同意；文章内容仅供个人交流用，禁作商业用途。</span></div>
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
        margin: -16px 0 8px;
        padding: 0 0 16px;
        border-bottom: 1px solid var(--color-border);
    }

    .novel-title {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: invisible;
        text-align: center;

        h2 {
            line-height: 52px;
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
    }

    .novel-illustration {
        display: grid;
        grid-gap: 16px;
        padding: 16px 0 8px;
    }

    .novel-copyright {
        position: relative;
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

    .novel-index {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: auto;
        border: var(--border-theme-group);
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-background-alpha);
    }

    .index-volume {
        margin: 4px 16px 8px;
        padding: 8px 0;
        border: 0;
        border-bottom: 1px solid var(--color-border);
        background-color: transparent;
        font-size: 16px;
        font-weight: bolder;
    }

    .index-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow: hidden scroll;
        overscroll-behavior: contain;
        padding: 0 8px 8px;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            border: 0;
            background-color: var(--color-theme-block);
        }

        a {
            display: block;
            overflow: hidden;
            padding: 6px 0 6px 16px;
            border-radius: 8px;
            font-size: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--color-text);

            &:hover {
                background-color: var(--color-border);
                color: white;
            }

            &.router-link-active {
                background-color: var(--color-theme-block);
                color: white;
            }
        }
    }

    .hidden {
        visibility: hidden;
    }

    @media (width < 1024px) {
        .novel-header {
            margin-top: 0;
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

<style lang="scss">
    .novel-illustration {
        display: grid;
        grid-gap: 16px;
        padding: 16px 0 8px;
    }
</style>