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

    function clickCover(event: MouseEvent) {
        if (isCurrentNovel.value) {
            return;
        }

        shelfStore.selectNovel(props.novel as string);
        event.stopPropagation();
    }
</script>

<template>
    <li>
        <button
            class="sheno-link"
            :class="{ [`is-checked`]: novel === shelfStore.novel }"
            @click.capture="clickCover"
        >
            <div class="sheno-cover">
                <mb-image v-if="cover" :src="cover" alt="[cover]" align="center"/>
                <div v-else class="sheno-placeholder">Cover.</div>
            </div>
            <span class="sheno-title">{{ title }}</span>
        </button>
    </li>
</template>

<style lang="scss" scoped>
    .sheno-link {
        margin-inline: 8px;
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

        :deep(.image-entity) {
            right: 0;
        }
    }

    .sheno-placeholder {
        display: grid;
        place-items: center;
        height: 100%;
        border: 4px dashed var(--color-border);
        border-radius: 8px;
        font-size: 32px;
        font-weight: bold;
        user-select: none;
    }

    .sheno-title {
        line-height: 42px;

        .is-checked > & {
            color: var(--color-theme-text);
        }
    }
</style>