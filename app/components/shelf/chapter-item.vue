<script lang="ts" setup>
    const props = defineProps<{
        art: Article;
    }>();

    const shelfStore = useShelfStore();
    const readRecordStore = useReadRecordStore();
    const { novel } = storeToRefs(shelfStore);

    const tags = [
        {
            name: "草稿",
            color: "rgb(216 108 234)",
            when: () => props.art.draft,
        },
        {
            name: "最近阅读",
            color: "var(--color-warning)",
            when: () => props.art.index === readRecordStore.get(novel.value)?.index,
        },
    ];
</script>

<template>
    <nuxt-link class="shech-item" :to="art.route">
        <span class="shech-title text-truncate">{{ art.title }}</span>
        <ul class="shech-tags">
            <template v-for="{ name, color, when } in tags">
                <li
                    v-if="toValue(when)"
                    class="shech-tag"
                    :style="`--color: ${color}`"
                >{{ name }}</li>
            </template>
        </ul>
        <novel-attributes
            :art
            :attrs="[`word-count`, `publish-date`, `update-date`]"
            :wrap="false"
        />
        <span class="shech-order">{{ art.orderInVol + 1 }}</span>
    </nuxt-link>
</template>

<style lang="scss" scoped>
    .shech-item {
        display: grid;
        grid-template:
            "A B D" 26px
            "C C D" 24px / auto 1fr auto;
        align-items: center;
        column-gap: 8px;
        padding-top: 8px;
        border-bottom: 1px dashed var(--color-border-light);
        font-size: 14px;
        break-inside: avoid;

        &:hover {
            color: var(--color-theme-text);
        }
    }

    .shech-title {
        font-size: 1rem;
    }

    .shech-tags {
        display: flex;
        align-items: center;
        gap: 0.5em;
        line-height: 1.5;
        text-wrap: nowrap;
    }

    .shech-tag {
        padding-inline: 7px;
        border: 1px solid var(--color);
        border-radius: 4px;
        font-size: 13px;
        color: var(--color);
    }

    .novel-attributes {
        grid-area: C;
    }

    .shech-order {
        grid-area: D;
        opacity: 0.5;
        font-size: 28px;
        font-style: italic;
        font-weight: bold;
        color: var(--color-info);
    }
</style>
