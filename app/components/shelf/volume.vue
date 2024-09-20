<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { currentVolumeIdx, jNovel } = storeToRefs(shelfStore);

    const volumes = computed(() => {
        return jNovel.value.volumes.map((item) => item.title);
    });
</script>

<template>
    <ul class="shelf-volume">
        <li
            v-for="(title, i) in volumes"
            class="shevo-item"
            :class="{
                [`is-checked`]: currentVolumeIdx === i
            }"
            @click="shelfStore.selectVolume(i)"
        >
            <span class="font-italic text-gray text-small">#{{ i + 1 }}</span>
            <span>{{ title }}</span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .shelf-volume {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));
        gap: 4px 16px;
    }

    .shevo-item {
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px dashed var(--color-border-light);
        line-height: 32px;
        cursor: pointer;

        &.is-checked {
            color: var(--color-theme-text);
        }
    }
</style>