<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { infoType, jChapters } = storeToRefs(shelfStore);

    const properties = [
        {
            label: "总字数",
            value: computed(() => {
                return jChapters.value.reduce((res, c) => res + c.wordCount, 0);
            })
        },
        {
            label: "最近更新",
            value: computed(() => {
                return jChapters.value.length
                    ? jChapters.value.reduce((prev, curr) => (
                        curr.updateDate !== Article.FARAWAY &&
                        curr.updateDate.localeCompare(prev.updateDate) > 0
                            ? curr
                            : prev
                    )).updateDate
                    : Article.FARAWAY;
            })
        },
        {
            label: "状态",
            value: computed(() => {
                return jChapters.value.some((c) => c.ending) ? "已完结" : "连载中";
            })
        }
    ];

    const { page, total, sizes, paginatedArr } = usePagination(jChapters, {
        sizes: 32
    });
</script>

<template>
    <div class="shelf-control">
        <div v-for="{ label, value: { value } } in properties" class="shelf-property">
            <span class="shelf-label">{{ label }}</span>
            <span>{{ value }}</span>
        </div>
        <div class="shelf-property">
            <span class="shelf-label">显示</span>
            <button
                v-for="(label, i) in [`字数`, `发布日期`]"
                :class="{
                    [`text-primary`]: infoType === i
                }"
                @click="infoType = i"
            >{{ label }}</button>
        </div>
    </div>
    <ul class="shelf-chapter">
        <li v-for="chapter in paginatedArr" :key="chapter.index">
            <shelf-chapter-item :chapter/>
        </li>
    </ul>
    <mb-pagination v-if="total > sizes" class="shelf-pagination" :total :sizes v-model="page"/>
</template>

<style lang="scss" scoped>
    .shelf-control {
        display: flex;
        flex-wrap: wrap;
        column-gap: 1.5em;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 2em;
        color: var(--color-info);
    }

    .shelf-property {
        display: flex;
        gap: 0.75em;

        &:last-child {
            margin-left: auto;
        }
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