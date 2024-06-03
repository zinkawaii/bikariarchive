<script lang="ts" setup>
    const modelValue = defineModel<boolean>();

    const toggleModel = useToggle(modelValue);

    //添加遮罩层
    useMask({
        isOpened: () => modelValue.value,
        onClick: () => toggleModel(false)
    });
</script>

<template>
    <transition-scale>
        <div v-if="modelValue" class="mb-dialog">
            <slot></slot>
            <span class="dialog-xmark" @click="toggleModel(false)">
                <icon name="fa6-solid:xmark"/>
            </span>
        </div>
    </transition-scale>
</template>

<style lang="scss" scoped>
    .mb-dialog {
        position: fixed;
        inset: 0;
        width: fit-content;
        height: fit-content;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        padding: 32px;
        border-radius: 16px;
        background-color: var(--color-background);

        @include viewport("xs") {
            height: 100dvh;
            padding: 16px;
            border-radius: 0;
        }
    }

    .dialog-xmark {
        display: grid;
        place-items: center;
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 1.5rem;
        aspect-ratio: 1;
        border-radius: 100%;
        background-color: var(--color-info-light-8);
        font-size: 1rem;
        color: var(--color-text-disabled);
        transition: all 0.4s;
        cursor: pointer;

        &:hover {
            background-color: var(--color-theme-dark);
            color: white;
        }
    }
</style>