<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { currentVolumeIdx, jNovel } = storeToRefs(shelfStore);

    const volumes = computed(() => {
        return jNovel.value.volumes.map((item) => item.title);
    });
</script>

<template>
    <ul class="shelf-volume">
        <li v-for="(title, i) in volumes">
            <a
                class="shevo-link"
                :class="{ checked: currentVolumeIdx === i }"
                @click="shelfStore.selectVolume(i)"
            >{{ title }}</a>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .shelf-volume {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));
    }

    .shevo-link {
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
</style>