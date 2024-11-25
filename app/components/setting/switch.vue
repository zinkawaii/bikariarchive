<script lang="ts" setup>
    import type { SettingBooleanField } from "~/types/setting";

    const props = defineProps<{
        name: SettingBooleanField;
    }>();

    const settingStore = useSettingStore();

    const state = computed(() => {
        return settingStore.get(props.name);
    });
</script>

<template>
    <button class="setting-switch" @click="settingStore.toggle(name)">
        <span class="switch-button" :class="{ [`is-checked`]: state }">
            <span class="switch-thumb"></span>
        </span>
        <span class="switch-title">{{ state ? "打开" : "关闭" }}</span>
    </button>
</template>

<style lang="scss" scoped>
    .setting-switch {
        display: flex;
        align-items: stretch;
        padding: 6px;
        border: 1px solid var(--color-border);
        border-radius: var(--bounded-full);
        line-height: 26px;
        user-select: none;
    }

    .switch-button {
        display: flex;
        width: 48px;
        padding: 3px;
        border: 1px solid var(--color-border);
        border-radius: var(--bounded-full);
        transition: all 0.25s;

        &.is-checked {
            border-color: var(--color-theme-dark);
            background-color: var(--color-theme-dark);
        }
    }

    .switch-thumb {
        aspect-ratio: 1;
        border-radius: var(--bounded-full);
        background-color: var(--color-gray-500);
        transition: all 0.25s;

        .is-checked > & {
            background-color: white;
            translate: 22px;
        }
    }

    .switch-title {
        flex: 1;
        text-align: center;
    }
</style>