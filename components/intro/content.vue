<script setup>
    const props = defineProps({
        novel: String
    });

    //简介
    const synopsis = computed(() => {
        return jArticle[props.novel].synopsis.split("\n");
    });
</script>

<template>
    <div class="intro-content">
        <ul class="intro-tag">
            <li v-for="tag in jArticle[novel].tag">{{ tag }}</li>
        </ul>
        <div class="intro-synopsis">
            <p v-for="line in synopsis" class="p-small">{{ line }}</p>
        </div>
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

    .intro-tag {
        display: flex;
        gap: 12px;
        overflow: auto;

        &::-webkit-scrollbar {
            display: none;
        }

        > li {
            padding-inline: 12px;
            border: 1px solid var(--color-border-lighter);
            border-radius: 12px;
            line-height: 24px;
            word-break: keep-all;
        }
    }

    .intro-synopsis {
        overflow: auto;
    }
</style>