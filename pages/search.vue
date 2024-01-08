<script setup>
    useHead({
        title: "全文检索"
    });

    const route = useRoute();
    const router = useRouter();
    const searchHistoryStore = useSearchHistoryStore();

    const word = ref("");
    const searchWord = ref("");
    const results = ref([]);
    const page = ref(0);
    const { history } = searchHistoryStore;

    //全文检索
    const fullTextSearch = Zin.debounce(async (w = word.value) => {
        if (!(w?.length > 0)) return;

        //限制长度
        w = w.slice(0, 64);

        //会话存储对象
        const session = useSessionStorage("search-result", {});

        //获取数据
        const data = session.value[w] ?? (await useFetch("/api/search", { query: { word: w } })).data.value;

        results.value.length = 0;
        searchWord.value = w;
        router.replace({ query: { word: w } });

        const { error, results: res } = data;
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
                volume: art.volumeInfo.title,
                count: item.count,
                parts
            });
        }

        //写入历史记录
        searchHistoryStore.push(w);

        //写入会话存储
        session.value[w] = data;

        //重置到第一页
        page.value = 1;
    });

    //带参数进入页面时
    watch(() => route.query.word, (value) => {
        word.value = value;
        fullTextSearch(value);
    }, {
        immediate: true
    });

    //分页显示结果
    const displayResults = computed(() => {
        const start = (page.value - 1) * 10;
        const end = start + 10;
        return results.value.slice(start, end);
    });

    //总出现次数
    const totalCount = computed(() => {
        return results.value.reduce((count, item) => {
            return count + item.count;
        }, 0);
    });
</script>

<template>
    <div class="content-widget" z-main>
        <form class="search-form" @submit.prevent="fullTextSearch()">
            <input class="search-input" type="search" v-model="word"/>
            <button class="search-button">全文检索</button>
        </form>
        <div class="search-history">
            <div class="history-title">
                <span>历史词条</span>
                <fa-icon class="cursor-pointer" icon="trash-can" @click="searchHistoryStore.clear()"/>
            </div>
            <ul v-if="history.length > 0" class="history-list">
                <li v-for="item in history">
                    <nuxt-link class="tag text-truncate history-item" :to="toSearch(item)">{{ item }}</nuxt-link>
                </li>
            </ul>
        </div>
    </div>
    <div v-if="searchWord.length > 0" class="content-widget" z-main>
        <div class="search-statistics">
            <h2>"{{ searchWord }}"的检索结果</h2>
            <span>共检索到{{ results.length }}章，总出现次数为{{ totalCount }}次</span>
        </div>
        <div class="search-results">
            <nuxt-link v-for="item in displayResults" :key="item.index" class="result-item" :to="`/book/bikari/${item.index}`">
                <h3 class="result-title">
                    {{ item.title }}
                </h3>
                <span class="result-volume">{{ item.volume }}</span>
                <article class="result-part">
                    <p v-for="part in item.parts" v-html="part"></p>
                </article>
                <span class="result-count">本章共出现{{ item.count }}次</span>
            </nuxt-link>
        </div>
        <mb-pagination :total="results.length" scroll-to=".content-widget" v-model="page"/>
    </div>
</template>

<style lang="scss" scoped>
    .search-form {
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
        background: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
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
        display: block;
        max-width: 112px;
        padding: 4px 8px;
        border-radius: 4px;
    }

    .search-statistics {
        > h2 {
            padding-bottom: 4px;
            font-size: 23px;
        }

        > span {
            font-size: 15px;
            color: var(--color-gray);
        }
    }

    .search-results {
        display: flex;
        flex-direction: column;
        margin-block: 16px;
    }

    .result-item {
        padding: 16px;
        border: 1px solid transparent;
        border-left-width: 16px;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
            border-color: var(--color-border-light);
            border-left-color: var(--color-theme);
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