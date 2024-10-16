<script lang="ts" setup>
    import { injectionKey } from "~/types/search";

    useHead({
        title: "全文检索"
    });

    const toastStore = useToastStore();

    const novel = useRouteQuery("novel");
    const queryWord = useRouteQuery("word", "");
    const inputWord = ref(queryWord.value);
    const searchWord = ref("");

    provide(injectionKey, {
        searchWord
    });

    const { execute, status, data, error } = useLazyFetch("/api/search", {
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

    const { page, total, paginatedArr } = usePagination(results);

    //全文检索
    const fullTextSearch = Zin.debounce(async () => {
        if (!inputWord.value) {
            toastStore.info("[search]:empty", "请输入内容");
            return;
        }

        queryWord.value = inputWord.value;
        searchWord.value = inputWord.value;

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

    //错误处理
    whenever(error, (err) => {
        if (err.statusCode === 429) {
            toastStore.info("[search]:throttle", "接口节流中");
        }
    }, {
        immediate: true
    });

    //总出现次数
    const totalCount = computed(() => {
        return results.value.reduce((count, item) => {
            return count + item.count;
        }, 0);
    });
</script>

<template>
    <meow-widget title="全文检索">
        <form class="search-form" @submit.prevent="fullTextSearch">
            <mb-select class="search-select" v-model="novel">
                <mb-option title="全文检索"/>
                <mb-option-group title="书名">
                    <mb-option v-for="{ title }, key in Article.meta" :key :title :value="key"/>
                </mb-option-group>
            </mb-select>
            <meow-input type="search" placeholder="关键词" accesskey="/" v-model.trim="inputWord"/>
            <meow-button icon="twemoji:magnifying-glass-tilted-right">全文检索</meow-button>
        </form>
        <search-history />
    </meow-widget>
    <meow-widget v-if="searchWord.length">
        <div class="search-statistics">
            <h2>"{{ searchWord }}"的检索结果</h2>
            <p class="text-gray">共检索到 {{ results.length }} 章，总出现次数为 {{ totalCount }} 次</p>
        </div>
        <div class="search-results">
            <mb-skeleton v-if="status !== `success`"/>
            <template v-else>
                <search-result v-for="result in paginatedArr" :key="result.index" v-bind="result"/>
            </template>
        </div>
        <mb-pagination :total scroll-target=".content-widget" v-model="page"/>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .search-form {
        display: grid;
        grid-template: "A B C" / auto 1fr auto;
        gap: 16px 8px;

        @include viewport("sm") {
            grid-template:
                "A A"
                "B C" / 1fr auto;
        }
    }

    .search-select {
        grid-area: A;
        width: 160px;
        margin-inline: auto;
        z-index: 1;
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