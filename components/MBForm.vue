<script lang="ts" setup>
    const props = defineProps<{
        title: string,
        type?: string,
        name?: string,
        list?: string[]
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
        <span class="form-name">{{ title }}</span>
        <div class="form-area">
            <template v-if="type === `select`">
                <span v-for="(item, i) in list" class="form-select" :class="{ active: isActive(i) }" @click="setValue(i)">{{ item }}</span>
            </template>
            <slot v-else></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-form {
        display: flex;
        overflow: hidden;
        height: 40px;
        margin: 16px 0;
        border: 1px solid var(--color-border-dark);
        border-radius: 8px;
        background-color: var(--color-background);
        line-height: 38px;
    }

    .form-name {
        margin: auto;
        padding-inline: 1em;
        border-right: 1px solid var(--color-border-dark);
        line-height: 1;
    }

    .form-area {
        display: flex;
        flex: 1;
        justify-content: space-between;
    }

    .form-select {
        display: flex;
        flex: 1;
        justify-content: center;
        position: relative;
        cursor: pointer;

        &::after {
            content: "";
            align-self: flex-end;
            position: absolute;
            opacity: 0;
            width: 75%;
            height: 3px;
            background-color: var(--color-theme-block);
            transform: scale(1, 0);
            transform-origin: bottom;
            transition: all 0.2s ease-out;
        }

        &:is(.active, :hover) {
            color: var(--color-theme-text);

            &::after {
                opacity: 1;
                transform: scale(1);
            }
        }
    }
</style>