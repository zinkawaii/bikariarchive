<script lang="ts" setup>
    defineProps<{
        opening?: boolean;
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
        <div v-if="opening" class="mb-dialog">
            <slot></slot>
            <span class="dialog-xmark" @click="emit(`close`)">
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
        min-width: var(--size-min-width);
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        padding: 32px;
        border-radius: 16px;
        background-color: var(--color-background);
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