<script lang="ts" setup>
    const novel = useRouteParams<string>("novel");
    const index = useRouteParams<string>("index");

    //当前章节
    const art = Article.for(novel, index);
</script>

<template>
    <aside-catalog v-if="art?.novelInfo.type === `novel`" :art/>
    <aside-outline v-else/>
</template>

<style lang="scss">
    .aside-unified {
        display: flex;
        flex-direction: column;
        overflow: auto;
        max-height: calc(100dvh - 96px);
        padding: 0;

        > .aside-title {
            margin: 16px 16px 4px;
        }
    }

    .aside-limited {
        overflow: hidden scroll;
        padding: 0 7px 12px 12px;
        overscroll-behavior: contain;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            border: 0;
            background-color: var(--color-theme);
        }
    }

    .aside-anchor {
        padding: 6px 0 6px 12px;
        border-radius: 8px;
        font-size: 14px;
        color: var(--color-text);

        &:hover {
            background-color: var(--color-info-light-5);
            color: white;
        }

        &.router-link-active, &.is-active {
            background-color: var(--color-theme);
            color: white;
        }
    }
</style>