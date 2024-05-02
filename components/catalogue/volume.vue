<script lang="ts" setup>
    const catalogueStore = useCatalogueStore();
    const { curOrder, jNovel } = storeToRefs(catalogueStore);

    const volumes = computed(() => {
        return jNovel.value.volumes.map((item) => item.title);
    });
</script>

<template>
    <ul class="catalogue-volume">
        <li v-for="(title, i) in volumes">
            <a
                :class="{ checked: curOrder.volume === i }"
                @click="catalogueStore.selectVolume(i)"
            >{{ title }}</a>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .catalogue-volume {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));

        a {
            display: flex;
            justify-content: center;
            border: 1px solid transparent;
            border-radius: 4px;
            line-height: 32px;

            &:hover {
                border-color: var(--color-theme-dark);
            }

            &.checked {
                color: var(--color-theme-text);
            }
        }
    }
</style>