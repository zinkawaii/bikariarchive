<script lang="ts" setup>
    import { Temporal } from "temporal-polyfill";
    import type { RenderFunction } from "vue";

    const articles = computed(() => {
        return Object.values(Article.meta).flatMap(({ chapters }) => chapters);
    });

    const items: {
        label: string;
        text: RenderFunction;
    }[] = [
        {
            label: "营业时长",
            text: () => Temporal.Now.plainDateISO().since("2022-09-30").days + "天",
        },
        {
            label: "章节数",
            text: () => [
                articles.value.length,
                h("span", { class: "text-gray" }, " / "),
                Entry.meta.all.length + Entry.meta.drafts.length,
            ],
        },
        {
            label: "总字数",
            text: () => articles.value.reduce((acc, { wordCount }) => acc + wordCount, 0),
        },
    ];
</script>

<template>
    <aside-widget title="站点统计">
        <template #icon>
            <iconify name="fa7-solid:chart-line"/>
        </template>
        <dl class="aside-statistics">
            <template v-for="{ label, text } in items">
                <dt class="statistics-label">{{ label }}</dt>
                <dd><component :is="text"/></dd>
            </template>
        </dl>
    </aside-widget>
</template>

<style lang="scss" scoped>
    .aside-statistics {
        display: grid;
        grid-auto-flow: column;
        grid-template-rows: auto 1fr;
        column-gap: 8px;
        margin-top: 8px;
        font-size: 14px;
        text-align: center;
    }

    .statistics-label {
        font-size: 12px;
        color: var(--color-text-secondary);
    }
</style>
