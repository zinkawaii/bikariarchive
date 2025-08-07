<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { articles } = storeToRefs(shelfStore);

    const properties = [
        {
            label: "总字数",
            value: computed(() => {
                return articles.value.reduce((res, c) => res + c.wordCount, 0);
            }),
        },
        {
            label: "最近更新",
            value: computed(() => {
                return articles.value.length
                    ? articles.value.reduce((prev, curr) => (
                        curr.updateDate !== Article.FARAWAY &&
                        curr.updateDate.localeCompare(prev.updateDate) > 0
                            ? curr
                            : prev
                    )).updateDate
                    : Article.FARAWAY;
            }),
        },
        {
            label: "状态",
            value: computed(() => {
                return articles.value.some((art) => art.ending) ? "已完结" : "连载中";
            }),
        },
    ];

    const { page, total, sizes, paginatedList } = usePagination(articles, {
        sizes: 32,
    });
</script>

<template>
    <div class="shelf-control">
        <div v-for="{ label, value } in properties" class="shelf-property">
            <span class="shelf-label">{{ label }}</span>
            <span>{{ value }}</span>
        </div>
    </div>
    <ul class="shelf-chapter">
        <li v-for="art in paginatedList" :key="art.index">
            <shelf-chapter-item :art/>
        </li>
    </ul>
    <mb-pagination v-if="total > sizes" class="shelf-pagination" :total :sizes v-model="page"/>
</template>

<style lang="scss" scoped>
    .shelf-control {
        display: flex;
        flex-wrap: wrap;
        column-gap: 1.5em;
        margin-bottom: 4px;
        font-size: 14px;
        line-height: 2;
        color: var(--color-info);
    }

    .shelf-property {
        display: flex;
        gap: 0.75em;
    }

    .shelf-label {
        font-weight: bold;
        color: var(--color-theme-text);
    }

    .shelf-chapter {
        @include viewport(">sm") {
            columns: 2;
            column-gap: 2em;
        }
    }

    .shelf-pagination {
        margin-top: 16px;
    }
</style>
