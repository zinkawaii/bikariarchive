<script lang="ts" setup>
    withDefaults(defineProps<{
        direction?: "top" | "right" | "bottom" | "left";
        plaintext?: string;
    }>(), {
        direction: "bottom",
    });
    const slots = defineSlots<{
        default?: () => any;
        floating?: () => any;
    }>();

    const id = useId();
    const isOpen = ref(false);
    let closeTimer: NodeJS.Timeout;

    const vnode = computed(() => {
        return slots.default?.()[0];
    });

    function open() {
        clearTimeout(closeTimer);
        isOpen.value = true;
    }

    function close() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            isOpen.value = false;
        }, 0);
    }
</script>

<template>
    <mb-primitive
        class="mb-popper"
        :style="{ anchorName: `--popper-${id}` }"
        @pointerenter="open"
        @pointerleave="close"
    >
        <component :is="vnode" :aria-label="plaintext"/>
        <transition v-if="slots.floating || plaintext">
            <teleport v-if="isOpen" to="body">
                <div
                    class="popper-outer"
                    :class="`is-${direction}`"
                    :style="{ positionAnchor: `--popper-${id}` }"
                    @pointerenter="plaintext === void 0 && open()"
                    @pointerleave="plaintext === void 0 && close()"
                >
                    <div class="popper-inner" :class="{ [`is-plaintext`]: plaintext }">
                        <template v-if="plaintext">{{ plaintext }}</template>
                        <slot v-else name="floating"></slot>
                    </div>
                </div>
            </teleport>
        </transition>
    </mb-primitive>
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
        position: fixed;
        position-area: var(--popper-area);
        padding: var(--popper-padding);
        transform-origin: var(--popper-origin);
        filter: drop-shadow(var(--box-shadow-dark));
        z-index: 1024;

        &:where(.v-enter-active, .v-leave-active) {
            transition: all 0.25s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;

            &:where(.is-top, .is-bottom) {
                scale: 1 0.66;
            }

            &:where(.is-right, .is-left) {
                scale: 0.66 1;
            }
        }

        &.is-top {
            --popper-area: top;
            --popper-padding: 0 0 8px;
            --popper-origin: bottom;
            --arrow-bottom: 4px;
            --arrow-rotate: -135deg;
        }

        &.is-right {
            --popper-area: right;
            --popper-padding: 0 0 0 8px;
            --popper-origin: left;
            --arrow-left: 4px;
            --arrow-rotate: -45deg;
        }

        &.is-bottom {
            --popper-area: bottom;
            --popper-padding: 8px 0 0;
            --popper-origin: top;
            --arrow-top: 4px;
            --arrow-rotate: 45deg;
        }

        &.is-left {
            --popper-area: left;
            --popper-padding: 0 8px 0 0;
            --popper-origin: right;
            --arrow-right: 4px;
            --arrow-rotate: 135deg;
        }

        &::before {
            content: "";
            position: absolute;
            inset:
                var(--arrow-top, auto)
                var(--arrow-right, auto)
                var(--arrow-bottom, auto)
                var(--arrow-left, auto);
            width: 10px;
            aspect-ratio: 1;
            border: 1px solid var(--color-border-lighter);
            background-color: var(--color-background);
            clip-path: polygon(0 0, 0 100%, 100% 0);
            rotate: var(--arrow-rotate);
        }
    }

    .popper-inner {
        padding: 6px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 12px;
        background-color: var(--color-background);

        &.is-plaintext {
            padding-inline: 14px;
            font-size: 14px;
            line-height: 20px;
            text-wrap: nowrap;
            color: var(--color-text-secondary);
        }
    }
</style>
