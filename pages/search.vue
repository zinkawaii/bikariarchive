<script setup>
    useHead({
        title: "全文检索"
    });

    const route = useRoute();
    const router = useRouter();
    const word = ref(route.query.word);
    const results = ref([]);
    const searchWord = ref();

    //全文检索
    const fullTextSearch = Zin.debounce(() => {
        useFetch("/api/search", {
            query: {
                word: word.value
            },
            onResponse({ response }) {
                results.value.length = 0;
                searchWord.value = word.value;
                router.replace({
                    query: {
                        word: word.value
                    }
                });

                const {
                    error,
                    results: res
                } = response._data;
                if (error !== 0 || res.length === 0) return;

                const art = new Article();
                for (const item of res) {
                    art.init("bikari", item.index);
                    const parts = item.parts.map((part) => {
                        return part.replaceAll(word.value, `<span class="light">${word.value}</span>`);
                    });

                    results.value.push({
                        index: item.index,
                        title: art.title,
                        volName: art.volName,
                        count: item.count,
                        parts
                    });
                }
            },
            pick: [word.value]
        });
    });

    //带参数进页面时
    if (word.value) {
        fullTextSearch();
    }

    //总出现次数
    const totalCount = computed(() => {
        return results.value.reduce((count, item) => {
            return count + item.count;
        }, 0);
    });
</script>

<template>
    <div class="content-group">
        <div class="search-box">
            <input class="search-input" v-model="word" @keyup.enter="fullTextSearch"/>
            <span class="search-button" @click="fullTextSearch">全文检索</span>
        </div>
        <div class="search-history">
            <div class="history-title">
                <span>历史词条</span>
                <i class="fas fa-trash-can history-clear"></i>
            </div>
            <ul class="history-list">
            </ul>
        </div>
    </div>
    <div v-if="results.length > 0" class="content-group">
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
        padding: 0 12px;
        border: 0;
        font-size: 16px;
    }

    .search-button {
        display: flex;
        align-items: center;
        width: 100px;
        padding-left: 16px;
        background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
        text-shadow: var(--text-shadow);
        color: white;
        cursor: pointer;
        user-select: none;
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

    .history-clear {
        cursor: pointer;
    }

    .history-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;

        > li > a {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
        }
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
        border-width: 0 0 0 16px;
        border-style: solid;
        border-color: transparent;
        border-radius: 8px;
        color: inherit;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
            border-left: 16px solid var(--color-theme-block);
            background-color: var(--color-background);
        }
    }

    .result-title {
        font-size: 19px;
    }

    .result-volume {
        display: inline-block;
        padding: 4px 0;
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