<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { novel, currentNovelIdx } = storeToRefs(shelfStore);
</script>

<template>
    <div class="shelf-novel">
        <ul class="sheno-list" :style="{ translate: `${currentNovelIdx * -144}px` }">
            <li v-for="{ title, cover }, key in Article.meta">
                <button
                    class="sheno-link"
                    :class="{ [`is-checked`]: novel === key }"
                    @click="shelfStore.selectNovel(key as string)"
                >
                    <div class="sheno-cover">
                        <nuxt-img v-if="cover" :src="cover" alt="[cover]"/>
                        <div v-else class="sheno-placeholder">Cover.</div>
                    </div>
                    <span class="sheno-title">{{ title }}</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .shelf-novel {
        overflow: hidden;
        padding-left: calc(50% - 72px);
        animation-name: edge-fades;
        animation-timeline: view();
    }

    .sheno-list {
        display: flex;
        width: fit-content;
        transition: all 0.4s;
    }

    .sheno-link {
        display: grid;
        justify-items: center;
        margin-inline: 8px;
        color: var(--color-text-info);
    }

    .sheno-cover {
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