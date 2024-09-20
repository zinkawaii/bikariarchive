<script lang="ts" setup>
    withDefaults(defineProps<{
        direction?: "top" | "right" | "bottom" | "left";
        plaintext?: string;
    }>(), {
        direction: "bottom"
    });
</script>

<template>
    <div class="mb-popper">
        <slot></slot>
        <div
            v-if="$slots.floating || plaintext"
            class="popper-outer"
            :class="[`is-${direction}`, {
                [`is-plain`]: plaintext
            }]"
        >
            <div class="popper-inner">
                <template v-if="plaintext">{{ plaintext }}</template>
                <slot v-else name="floating"></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-popper {
        display: grid;
        place-items: center;
        position: relative;
    }

    .popper-outer {
        display: grid;
        place-items: center;
        position: absolute;
        opacity: 0;
        transition: all 0.25s;
        filter: drop-shadow(var(--box-shadow-dark));
        pointer-events: none;

        &.is-top {
            bottom: 100%;
            padding-bottom: 8px;
            transform-origin: bottom;
            scale: 1 0.66;

            &::before {
                bottom: 4px;
                rotate: -135deg;
            }
        }

        &.is-right {
            left: 100%;
            padding-left: 8px;
            transform-origin: left;
            scale: 0.66 1;

            &::before {
                left: 4px;
                rotate: -45deg;
            }
        }

        &.is-bottom {
            top: 100%;
            padding-top: 8px;
            transform-origin: top;
            scale: 1 0.66;

            &::before {
                top: 4px;
                rotate: 45deg;
            }
        }

        &.is-left {
            right: 100%;
            padding-right: 8px;
            transform-origin: right;
            scale: 0.66 1;

            &::before {
                right: 4px;
                rotate: 135deg;
            }
        }

        :hover + &.is-plain, :hover > &:not(.is-plain) {
            opacity: 1;
            scale: 1;
            pointer-events: auto;
        }

        &::before {
            content: "";
            position: absolute;
            width: 10px;
            aspect-ratio: 1;
            border: 1px solid var(--color-border-lighter);
            background-color: var(--color-background);
            clip-path: polygon(0 0, 0 100%, 100% 0);
        }
    }

    .popper-inner {
        padding: 6px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 12px;
        background-color: var(--color-background);

        .is-plain > & {
            padding-inline: 14px;
            font-size: 14px;
            line-height: 20px;
            text-wrap: nowrap;
            color: var(--color-text-secondary);
        }
    }
</style>