<script lang="ts" setup>
    const catalogueStore = useCatalogueStore();
    const { novel, curOrder } = storeToRefs(catalogueStore);
</script>

<template>
    <div class="catalogue-shelf">
        <ul class="shelf-wrapper" :style="{ translate: `${curOrder.novel * -144}px` }">
            <li v-for="({ title, cover }, key, i) in Article.meta">
                <a
                    class="shelf-novel"
                    :class="{ checked: novel === key }"
                    @click="catalogueStore.selectNovel(key as string, i)"
                    ><div class="shelf-cover">
                        <nuxt-img v-if="cover" :src="cover" alt="[cover]"/>
                        <div v-else class="shelf-placeholder">Cover.</div>
                    </div>
                    <span class="shelf-title">{{ title.split("-")[0] }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .catalogue-shelf {
        padding-left: calc(50% - 72px);
        mask-image: linear-gradient(to right, transparent, white 32px, white calc(100% - 32px), transparent);
    }

    .shelf-wrapper {
        display: flex;
        width: fit-content;
        transition: all 0.4s;
    }

    .shelf-novel {
        display: grid;
        justify-items: center;
        margin-inline: 8px;
        color: var(--color-text-info);
    }

    .shelf-cover {
        width: 128px;
        aspect-ratio: 1 / 1.414;
        transform-origin: bottom;
        transition: all 0.4s;
        filter: drop-shadow(8px 8px 2px rgb(0 0 0 / 16%));

        :not(.checked) > & {
            opacity: 0.66;
            scale: 0.9;
        }
    }

    .shelf-placeholder {
        display: grid;
        place-items: center;
        height: 100%;
        border: 4px dashed var(--color-border);
        border-radius: 8px;
        font-size: 32px;
        font-weight: bold;
        user-select: none;
    }

    .shelf-title {
        line-height: 42px;

        .checked > & {
            color: var(--color-theme-text);
        }
    }
</style>