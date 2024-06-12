<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { novel, currentNovelIdx } = storeToRefs(shelfStore);
</script>

<template>
    <div class="shelf-novel">
        <ul class="sheno-list" :style="{ translate: `${currentNovelIdx * -144}px` }">
            <li v-for="({ title, cover }, key, i) in Article.meta">
                <a
                    class="sheno-link"
                    :class="{ [`is-checked`]: novel === key }"
                    @click="shelfStore.selectNovel(key as string, i)"
                    ><div class="sheno-cover">
                        <nuxt-img v-if="cover" :src="cover" alt="[cover]"/>
                        <div v-else class="sheno-placeholder">Cover.</div>
                    </div>
                    <span class="sheno-title">{{ title.split("-")[0] }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .shelf-novel {
        padding-left: calc(50% - 72px);
        mask-image: linear-gradient(to right, transparent, white 32px, white calc(100% - 32px), transparent);
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