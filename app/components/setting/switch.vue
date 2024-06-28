<script lang="ts" setup>
    import type { SettingField } from "~/types/setting";

    const props = defineProps<{
        name: SettingField;
    }>();

    const settingStore = useSettingStore();

    const state = computed(() => {
        return settingStore.get(props.name);
    });
</script>

<template>
    <div class="setting-switch" @click="settingStore.toggle(name)">
        <div class="switch-button" :class="{ [`is-checked`]: state }">
            <span class="switch-thumb"></span>
        </div>
        <span class="switch-title">{{ state ? "打开" : "关闭" }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .setting-switch {
        display: flex;
        padding: 6px;
        border: 1px solid var(--color-border);
        border-radius: var(--bounded-full);
        line-height: 26px;
        cursor: pointer;
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
        background-color: var(--color-info-light-5);
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