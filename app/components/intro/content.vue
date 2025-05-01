<script lang="ts" setup>
    const props = defineProps<{
        novel: string;
    }>();
</script>

<template>
    <div class="intro-content">
        <ul class="intro-tags edge-fades-x no-scrollbar">
            <li v-for="tag in Article.meta[novel].tag" class="intro-tag">{{ tag }}</li>
        </ul>
        <novel-article class="intro-synopsis" :body="Article.meta[props.novel].synopsis"/>
    </div>
</template>

<style lang="scss" scoped>
    .intro-content {
        display: grid;
        grid-template-rows: auto 1fr;
        gap: 8px;
        overflow: hidden;
        font-size: 14px;
    }

    .intro-tags {
        display: flex;
        gap: 12px;
    }

    .intro-tag {
        padding-inline: 12px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 12px;
        line-height: 24px;
        word-break: keep-all;
    }

    .intro-synopsis {
        overflow: auto;

        :deep(p) {
            line-height: 24px;
        }
    }
</style>
