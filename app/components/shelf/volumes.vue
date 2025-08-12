<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { volume, novelInfo } = storeToRefs(shelfStore);

    const volumes = computed(() => {
        return novelInfo.value.volumes.map((item) => item.title);
    });
</script>

<template>
    <ul class="shelf-volumes">
        <li
            v-for="(title, i) in volumes"
            class="shelf-volume"
            :class="{ [`is-checked`]: i === volume }"
            @click="shelfStore.selectVolume(i)"
        >
            <span class="font-italic text-gray text-small">#{{ i + 1 }}</span>
            <span>{{ title }}</span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .shelf-volumes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));
        gap: 4px 16px;
    }

    .shelf-volume {
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px dashed var(--color-border-light);
        line-height: 2;
        cursor: pointer;

        &.is-checked {
            color: var(--color-theme-text);
        }
    }
</style>
