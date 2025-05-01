<script lang="ts" setup>
    import type { JNovel } from "@bikari/article";

    const props = defineProps<JNovel<Article> & {
        novel: PropertyKey;
    }>();

    const shelfStore = useShelfStore();

    const isCurrentNovel = computed(() => {
        return props.novel === shelfStore.novel;
    });

    const cover = computed(() => {
        return isCurrentNovel.value && shelfStore.jVolume.cover || props.cover;
    });

    function onClick() {
        if (!isCurrentNovel.value) {
            shelfStore.selectNovel(props.novel as string);
        }
    }
</script>

<template>
    <li class="sheno-item">
        <button
            :class="{ [`is-checked`]: isCurrentNovel }"
            @click="onClick"
        >
            <div class="sheno-cover">
                <mb-image v-if="cover" :src="cover" alt="[cover]" align="center" :viewable="isCurrentNovel"/>
                <div v-else class="sheno-placeholder">Cover.</div>
            </div>
            <span class="sheno-title">{{ title }}</span>
        </button>
    </li>
</template>

<style lang="scss" scoped>
    .sheno-item {
        margin-inline: 8px;
        text-align: center;
        color: var(--color-info);
    }

    .sheno-cover {
        display: grid;
        width: 128px;
        aspect-ratio: 1 / 1.414;
        transform-origin: bottom;
        transition: all 0.4s;
        filter: drop-shadow(8px 8px 2px rgb(0 0 0 / 16%));

        :not(.is-checked) > & {
            opacity: 0.66;
            scale: 0.9;
        }
    }

    .sheno-placeholder {
        display: grid;
        align-items: center;
        border: 4px dashed var(--color-border);
        border-radius: 8px;
        font-size: 32px;
        font-weight: bold;
    }

    .sheno-title {
        line-height: 42px;

        .is-checked > & {
            color: var(--color-theme-text);
        }
    }
</style>
