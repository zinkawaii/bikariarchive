<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { volume, novelInfo } = storeToRefs(shelfStore);

    const volumes = computed(() => {
        return novelInfo.value.volumes.map((item) => item.title);
    });
</script>

<template>
    <ol class="shelf-volumes">
        <li
            v-for="(title, i) in volumes"
            class="shelf-volume"
            :class="{ [`is-checked`]: i === volume }"
        >
            <nuxt-link
                class="volume-link"
                :to="{ params: { volume: i } }"
            >{{ title }}</nuxt-link>
        </li>
    </ol>
</template>

<style lang="scss" scoped>
    .shelf-volumes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));
        gap: 4px 16px;
    }

    .shelf-volume {
        display: grid;
        counter-increment: volume-order;

        &.is-checked {
            color: var(--color-theme-text);
        }
    }

    .volume-link {
        border-bottom: 1px dashed var(--color-border-light);
        line-height: 2;

        &::before {
            content: "#" counter(volume-order) " ";
            font-variant-numeric: tabular-nums;
            font-size: 14px;
            font-style: italic;
            color: var(--color-info);
        }
    }
</style>
