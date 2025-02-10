<script lang="ts" setup>
    import type { GetArticleResponse } from "~~/server/types/api/article";

    type Attr = "volume" | "read-count" | "word-count" | "publish-date" | "update-date";

    const props = withDefaults(defineProps<{
        art: Article;
        post?: GetArticleResponse;
        attrs: Attr[];
        wrap?: boolean;
    }>(), {
        wrap: true
    });

    const infos: {
        attr: Attr;
        icon: string;
        content: MaybeRefOrGetter<unknown>;
    }[] = [
        {
            attr: "volume",
            icon: "fa6-solid:book-open",
            content: () => props.art.volumeInfo.title
        },
        {
            attr: "read-count",
            icon: "fa6-solid:eye",
            content: () => `${props.post?.readCount ?? "?"} 阅读`
        },
        {
            attr: "word-count",
            icon: "nonicons:keyword-16",
            content: () => `${props.art.wordCount} 字`
        },
        {
            attr: "publish-date",
            icon: "fa6-solid:pen",
            content: () => props.art.publishDate
        },
        {
            attr: "update-date",
            icon: "fa6-solid:clock-rotate-left",
            content: () => props.art.updateDate
        }
    ];

    const filterred = computed(() => {
        return infos.filter(({ attr }) => props.attrs.includes(attr));
    });
</script>

<template>
    <ul
        class="novel-attributes"
        :class="{
            [`is-wrap`]: wrap,
            [`edge-fades-x no-scrollbar`]: !wrap
        }"
    >
        <li v-for="{ icon, content } in filterred" class="novel-attr">
            <iconify :name="icon"/>
            <span>{{ toValue(content) }}</span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .novel-attributes {
        display: flex;
        column-gap: 18px;
        font-size: 12px;
        line-height: 20px;
        text-wrap: nowrap;
        color: var(--color-info);

        &.is-wrap {
            flex-wrap: wrap;
            justify-content: center;
        }
    }

    .novel-attr {
        display: flex;
        align-items: center;
        gap: 4px;
    }
</style>