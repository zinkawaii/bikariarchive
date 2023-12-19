<script setup>
    useHead({
        title: "全文检索"
    });

    const route = useRoute();
    const router = useRouter();
    const searchHistoryStore = useSearchHistoryStore();

    const word = ref("");
    const results = ref([]);
    const searchWord = ref("");
    const { history } = searchHistoryStore;

    //全文检索
    const fullTextSearch = Zin.debounce(async (w = word.value) => {
        if (!(w?.length > 0)) return;

        //限制长度
        w = w.slice(0, 64);

        const { data } = await useFetch("/api/search", { query: { word: w } });

        results.value.length = 0;
        searchWord.value = w;
        router.replace({ query: { word: w } });

        const { error, results: res } = data.value;
        if (error !== 0) return;

        const art = new Article();
        for (const item of res) {
            art.init("bikari", item.index);
            const parts = item.parts.map((part) => {
                return part.replaceAll(w, `<span class="light">${w}</span>`);
            });

            results.value.push({
                index: item.index,
                title: art.title,
                volName: art.volName,
                count: item.count,
                parts
            });
        }

        //写入历史记录
        searchHistoryStore.push(w);
    });

    //带参数进入页面时
    watch(() => route.query.word, (value) => {
        word.value = value;
        fullTextSearch(value);
    }, {
        immediate: true
    });

    //点击历史词条
    function clickHistory(value) {
        word.value = value;
        fullTextSearch(value);
    }

    //总出现次数
    const totalCount = computed(() => {
        return results.value.reduce((count, item) => {
            return count + item.count;
        }, 0);
    });
</script>

<template>
    <div class="content-page">
        <div class="content-widget" z-main>
            <div class="search-box">
                <input class="search-input" v-model="word" @keyup.enter="fullTextSearch()"/>
                <a class="search-button" @click="fullTextSearch()">全文检索</a>
            </div>
            <div class="search-history">
                <div class="history-title">
                    <span>历史词条</span>
                    <i class="fas fa-trash-can cursor-pointer" @click="searchHistoryStore.clear()"></i>
                </div>
                <ul v-if="history.length > 0" class="history-list">
                    <li v-for="item in history">
                        <a class="tag text-truncate history-item" @click="clickHistory(item)">{{ item }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="searchWord.length > 0" class="content-widget" z-main>
            <div class="search-statistics">
                <div class="title">
                    “{{ searchWord }}”的检索结果
                </div>
                <div class="text">
                    共检索到{{ results.length }}章，总出现次数为{{ totalCount }}次
                </div>
            </div>
            <div class="search-result">
                <nuxt-link v-for="item in results" class="result-box" :to="`/book/bikari/${item.index}`">
                    <div class="result-title">
                        {{ item.title }}
                    </div>
                    <span class="result-volume">{{ item.volName }}</span>
                    <article class="result-part">
                        <p v-for="part in item.parts" v-html="part"></p>
                    </article>
                    <span class="result-count">本章共出现{{ item.count }}次</span>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .search-box {
        display: flex;
        justify-content: center;
        overflow: hidden;
        height: 36px;
        border: 1px solid var(--color-border);
        border-radius: 16px;
    }

    .search-input {
        flex: 1;
        padding-inline: 12px;
    }

    .search-button {
        display: flex;
        align-items: center;
        padding-inline: 16px 18px;
        background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
        text-shadow: var(--text-shadow);
        color: white;
    }

    .search-history {
        margin-top: 16px;
        color: var(--color-gray);
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
        max-width: 112px;
        padding: 4px 8px;
        border-radius: 4px;
    }

    .search-statistics {
        .title {
            padding-bottom: 4px;
            font-size: 23px;
        }

        .text {
            font-size: 15px;
            color: var(--color-gray);
        }
    }

    .search-result {
        display: flex;
        flex-direction: column;
        margin-top: 16px;
    }

    .result-box {
        padding: 16px;
        border: 1px solid transparent;
        border-left-width: 16px;
        border-radius: 8px;
        color: inherit;
        transition: all 0.2s;

        &:hover {
            border-color: var(--color-border-light);
            border-left-color: var(--color-theme-block);
            background-color: var(--color-background);
        }
    }

    .result-title {
        font-size: 19px;
    }

    .result-volume {
        display: inline-block;
        padding-block: 4px;
        font-size: 15px;
        color: var(--color-gray);
    }

    .result-part {
        p {
            font-size: 13px;
            line-height: 21px;
        }

        :deep(.light) {
            color: var(--color-danger);
        }
    }

    .result-count {
        float: right;
        font-size: 14px;
        color: var(--color-gray);
    }
</style>