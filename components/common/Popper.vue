<script setup>

</script>

<template>
    <div class="mb-popper">
        <div class="popper-wrapper">
            <slot></slot>
        </div>
        <div v-if="$slots.floating" class="popper-outer">
            <div class="popper-inner">
                <slot name="floating"></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-popper {
        display: grid;
        justify-items: center;
        position: relative;
    }

    .popper-outer {
        position: absolute;
        opacity: 0;
        top: 100%;
        padding-top: 8px;
        transform-origin: top;
        transition: all 0.25s;
        scale: 1 0.66;
        filter: drop-shadow(0 0 8px rgb(0 0 0 / 16%));
        pointer-events: none;

        &::before {
            content: "";
            position: absolute;
            inset: 4px 0;
            width: 10px;
            aspect-ratio: 1;
            margin-inline: auto;
            border: 1px solid var(--color-border-lighter);
            background-color: var(--color-background);
            clip-path: polygon(0 0, 0 100%, 100% 0);
            rotate: 45deg;
        }

        :hover > & {
            opacity: 1;
            scale: 1;
            pointer-events: auto;
        }
    }

    .popper-inner {
        padding: 6px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 12px;
        background-color: var(--color-background);
    }
</style>