<script lang="ts" setup>
    import type { SettingField } from "~/types/setting";

    defineProps<{
        name: SettingField;
        options: string[];
    }>();

    const settingStore = useSettingStore();
</script>

<template>
    <ul class="setting-select">
        <li
            v-for="(item, i) in options"
            class="select-item"
            :class="{
                [`is-checked`]: i === Number(settingStore.get(name))
            }"
            @click="settingStore.set(name, i)"
        >{{ item }}</li>
    </ul>
</template>

<style lang="scss" scoped>
    .setting-select {
        display: flex;
        column-gap: 16px;
        padding-inline: 16px;
        border: 1px solid var(--color-border);
        border-radius: var(--bounded-full);
        line-height: 38px;
        word-break: keep-all;
        user-select: none;
    }

    .select-item {
        display: flex;
        flex: 1;
        justify-content: center;
        position: relative;
        transition: all 0.25s;
        cursor: pointer;

        &::after {
            content: "";
            position: absolute;
            top: 0;
            width: 75%;
            height: 3px;
            border-radius: 1.5px;
            background-color: var(--color-theme);
            transform-origin: top;
            transition: all 0.25s;
            scale: 1 0;
        }

        &:is(.is-checked, :hover)::after {
            scale: 1;
        }

        &.is-checked {
            color: var(--color-theme-text);

            &::after {
                top: 35px;
            }
        }

        &:is(.is-checked:has(~ :hover), :hover ~ .is-checked)::after {
            transform-origin: bottom;
            scale: 1 0;
        }
    }
</style>