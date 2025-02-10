<script lang="ts" setup>
    defineProps<{
        isOpening?: boolean;
    }>();
    const emit = defineEmits<{
        close: [];
    }>();

    //按下 ESC 键关闭
    useEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            emit("close");
        }
    });
</script>

<template>
    <transition-scale>
        <div v-if="isOpening" class="mb-dialog">
            <div class="dialog-wrapper no-scrollbar">
                <slot></slot>
            </div>
            <span class="dialog-xmark" @click="emit(`close`)">
                <iconify name="fa6-solid:xmark"/>
            </span>
        </div>
    </transition-scale>
</template>

<style lang="scss" scoped>
    .mb-dialog {
        --m: 16px;

        display: grid;
        grid-template-rows: 1fr;
        position: fixed;
        overflow: hidden;
        inset: 0;
        width: fit-content;
        height: fit-content;
        min-width: var(--size-min-width);
        max-width: calc(100% - var(--m) * 2);
        max-height: calc(100dvh - var(--m) * 2);
        margin: auto;
        border-radius: 16px;
        background-color: var(--color-background);

        @include viewport("xs") {
            --m: 0px;
        }
    }

    .dialog-wrapper {
        overflow: auto;
        padding: var(--dialog-padding, 32px);
    }

    .dialog-xmark {
        display: grid;
        place-items: center;
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 1.5rem;
        aspect-ratio: 1;
        border-radius: var(--bounded-circle);
        background-color: var(--color-gray-800);
        font-size: 1rem;
        color: var(--color-gray-300);
        transition: all 0.4s;
        cursor: pointer;

        &:hover {
            background-color: var(--color-theme-dark);
            color: white;
        }
    }
</style>