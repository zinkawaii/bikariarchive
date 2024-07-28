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

    const { execute, status, data } = useLazyFetch("/api/search", {
        query: {
            novel,
            word: computed(() => inputWord.value.slice(0, 64))
        },
        immediate: false,
        watch: false
    });

    const results = computed(() => {
        const { list } = data.value ?? {};
        return list ?? [];
    });

    const { page, total, filteredArr } = usePagination(results);

    //全文检索
    const fullTextSearch = Zin.debounce(async () => {
        if (!inputWord.value) {
            toastStore.info("[search]:empty", "请输入内容");
            return;
        }

        queryWord.value = inputWord.value;
        searchWord.value = inputWord.value;

        //写入历史记录
        updateHistory(inputWord.value);

        //发送请求
        await execute();
    }, {
        title: "检索"
    });

    //带参数进入页面时
    watchImmediate(queryWord, (value) => {
        inputWord.value = value;
        if (value && searchWord.value !== value) {
            fullTextSearch();
        }
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
            <span class="text-gray">共检索到 {{ results.length }} 章，总出现次数为 {{ totalCount }} 次</span>
        </div>
        <div class="search-results">
            <mb-skeleton v-if="status !== `success`"/>
            <template v-else>
                <search-result v-for="result in filteredArr" :key="result.index" :word="searchWord" v-bind="result"/>
            </template>
        </div>
        <mb-pagination :total scroll-target=".content-widget" v-model="page"/>
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
</style>