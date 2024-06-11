<script lang="ts" setup>
    useHead({
        title: "全文检索"
    });

    const history = useLocalStorage("search-history", []);
    const toastStore = useToastStore();

    const novel = useRouteQuery("novel");
    const queryWord = useRouteQuery("word", "");
    const inputWord = ref(queryWord.value);
    const searchWord = ref("");

    const { execute, pending, data } = useLazyFetch("/api/search", {
        query: {
            novel,
            word: computed(() => inputWord.value.slice(0, 64))
        },
        immediate: false,
        watch: false
    });

    const results = computed(() => {
        const { error, list } = data.value ?? {};
        if (error || !list) return [];

        return list.map((item) => {
            const art = Article.for(item.novel, item.index);
            const parts = item.parts.map((part) => {
                return part.replaceAll(searchWord.value, `<span class="text-danger">${searchWord.value}</span>`);
            }).join("");

            return {
                art,
                parts,
                count: item.count
            };
        });
    });

    const { page, filteredArr } = usePagination(results);

    //全文检索
    const fullTextSearch = Zin.debounce(async () => {
        if (!inputWord.value) {
            toastStore.info("search-empty", "请输入内容");
            return;
        }

        //发送请求
        await execute();
        queryWord.value = inputWord.value;
        searchWord.value = inputWord.value;

        //写入历史记录
        updateHistory(inputWord.value);

        //重置到第一页
        page.value = 1;
    }, {
        title: "检索"
    });

    //带参数进入页面时
    watchImmediate(queryWord, (value) => {
        inputWord.value = value;
        value ? (searchWord.value !== value) && fullTextSearch() : (
            results.value.length = 0
        );
    });

    //总出现次数
    const totalCount = computed(() => {
        return results.value.reduce((count, item) => {
            return count + item.count;
        }, 0);
    });

    //更新历史
    function updateHistory(word: string) {
        const pos = history.value.indexOf(word);
        if (pos !== -1) {
            history.value.splice(pos, 1);
        }
        history.value.unshift(word);
    }

    //清空历史
    function clearHistory() {
        history.value = [];
    }
</script>

<template>
    <coco-widget title="全文检索">
        <form class="search-form" @submit.prevent="fullTextSearch">
            <mb-select class="search-select" v-model="novel">
                <mb-option title="全文检索"/>
                <mb-option-group title="书名">
                    <mb-option v-for="{ title }, key in Article.meta" :key :title :value="key"/>
                </mb-option-group>
            </mb-select>
            <coco-input type="search" placeholder="关键词" v-model="inputWord"/>
        </form>
        <div class="search-history">
            <div class="history-title">
                <span>历史词条</span>
                <a @click="clearHistory"><icon name="fa6-solid:trash-can"/></a>
            </div>
            <client-only>
                <ul v-if="history.length > 0" class="history-list">
                    <li v-for="word in history" :key="word">
                        <nuxt-link class="tag text-truncate history-item" :to="toSearch(word)">{{ word }}</nuxt-link>
                    </li>
                </ul>
            </client-only>
        </div>
    </coco-widget>
    <coco-widget v-if="searchWord.length">
        <div class="search-statistics">
            <h2>"{{ searchWord }}"的检索结果</h2>
            <span class="text-gray">共检索到{{ results.length }}章，总出现次数为{{ totalCount }}次</span>
        </div>
        <div class="search-results">
            <mb-skeleton v-if="pending"/>
            <template v-else>
                <nuxt-link v-for="{ art, parts, count } in filteredArr" :key="art.index" class="search-result" :to="art.route">
                    <h3 class="result-title">{{ art.title }}</h3>
                    <span class="result-volume">{{ art.volumeInfo.title }}</span>
                    <article class="result-part" v-html="parts"></article>
                    <span class="result-count">本章共出现{{ count }}次</span>
                </nuxt-link>
            </template>
        </div>
        <mb-pagination :total="results.length" scroll-target=".content-widget" v-model="page"/>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .search-form {
        display: grid;
        gap: 16px 8px;

        @include viewport(">xs") {
            grid-template-columns: auto 1fr;
        }
    }

    .search-select {
        width: 180px;
        margin-inline: auto;
        z-index: 1;
    }

    .search-history {
        margin-top: 16px;
        color: var(--color-text-info);
    }

    .history-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .history-list {
        display: flex;
        flex-wrap: wrap;
        gap: 16px 8px;
        margin-top: 8px;
        font-size: 14px;
    }

    .history-item {
        display: block;
        max-width: 112px;
        padding: 4px 8px;
        border-radius: 4px;
    }

    .search-statistics {
        display: grid;
        gap: 4px;
        font-size: 15px;

        @include viewport("lg") {
            margin: 8px;
        }
    }

    .search-results {
        display: flex;
        flex-direction: column;
        margin-block: 16px;
    }

    .search-result {
        padding: 16px;
        border: 1px solid transparent;
        border-left-width: 16px;
        border-radius: 8px;
        transition: all 0.25s;

        &:hover {
            border-color: var(--color-border-lighter);
            border-left-color: var(--color-theme);
            background-color: var(--color-background);
        }
    }

    .result-title {
        line-height: 28px;
    }

    .result-volume {
        font-size: 15px;
        color: var(--color-text-info);
    }

    .result-part {
        padding-block: 4px;
        font-size: 13px;
        line-height: 22px;
    }

    .result-count {
        float: right;
        font-size: 14px;
        color: var(--color-text-info);
    }
</style>