<script lang="ts" setup>
    const props = defineProps<{
        title: string,
        type?: string,
        name?: string,
        desc?: string,
        options?: string[]
    }>();

    const settingStore = useSettingStore();

    function isActive(i: number) {
        const value = settingStore.get(props.name);
        return i === Number(value);
    }

    function setValue(i: number) {
        settingStore.set(props.name, i);
    }
</script>

<template>
    <div class="mb-form">
        <div>
            <div class="form-title">{{ title }}</div>
            <div class="form-desc">{{ desc }}</div>
        </div>
        <div class="form-area">
            <template v-if="type === `select`">
                <span
                    v-for="(item, i) in options"
                    class="form-select"
                    :class="{ active: isActive(i) }"
                    @click="setValue(i)"
                >{{ item }}</span>
            </template>
            <slot v-else></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-form {
        display: grid;
        grid-template-columns: 0.8fr 1fr;
        align-items: center;
        gap: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border-light);
    }

    .form-title {
        line-height: 24px;
    }

    .form-desc {
        font-size: 12px;
        color: var(--color-gray);
    }

    .form-area {
        display: flex;
        gap: 16px;
        overflow: hidden;
        padding-inline: 16px;
        border: 1px solid var(--color-border);
        border-radius: 16px;
        line-height: 38px;
    }

    .form-select {
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

        &:is(.active, :hover)::after {
            scale: 1;
        }

        &.active {
            color: var(--color-theme-text);

            &::after {
                top: 35px;
            }
        }

        &:is(.active:has(~ :hover), :hover ~ .active)::after {
            transform-origin: bottom;
            scale: 1 0;
        }
    }
</style>