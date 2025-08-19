<script lang="ts" setup>
    import { differenceInDays } from "date-fns";

    const articles = computed(() => {
        return Object.values(Article.meta).flatMap(({ chapters }) => chapters);
    });

    const items: {
        label: string;
        text: () => any;
    }[] = [
        {
            label: "营业时长",
            text: () => differenceInDays(new Date(), "2022/09/30") + "天",
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
        <ul class="aside-statistics">
            <li v-for="{ label, text } in items">
                <small class="statistics-label">{{ label }}</small>
                <br />
                <span><component :is="text"/></span>
            </li>
        </ul>
    </aside-widget>
</template>

<style lang="scss" scoped>
    .aside-statistics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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
