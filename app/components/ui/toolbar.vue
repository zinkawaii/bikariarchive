<script lang="ts" setup>
    const gsap = useGsap();
    const signerStore = useSignerStore();
    const settingStore = useSettingStore();

    const collapse = computed(() => settingStore.get("ui-collapse"));

    onMounted(() => {
        const items = [...document.querySelectorAll(".z-toolbar > .mb-popper")].slice(0, -1);

        watchEffect(() => {
            const tl = gsap.timeline({
                defaults: {
                    duration: 0.4,
                    ease: `back.${collapse.value ? `in` : `out`}`
                }
            });

            const sortedItems = collapse.value ? items : items.toReversed();
            for (const item of sortedItems) {
                tl.to(item, { x: collapse.value ? 60 : 0 }, "<0.05");
            }
            tl.play();
        });
    });
</script>

<template>
    <div class="z-toolbar">
        <mb-popper direction="left" plaintext="开往">
            <nuxt-link class="tool-item" to="https://www.travellings.cn/go.html">
                <iconify name="fa6-solid:train-subway"/>
            </nuxt-link>
        </mb-popper>
        <mb-popper direction="left" plaintext="设置">
            <a class="tool-item" @click="settingStore.open()">
                <iconify name="fa6-solid:gear"/>
            </a>
        </mb-popper>
        <mb-popper direction="left" plaintext="用户">
            <a class="tool-item" @click="signerStore.open()">
                <iconify name="fa6-solid:user"/>
            </a>
        </mb-popper>
        <mb-popper direction="left" plaintext="回到顶部">
            <a class="tool-item" href="#">
                <span class="tool-progress"></span>
                <iconify class="tool-arrow-top" name="fa6-solid:arrow-up"/>
            </a>
        </mb-popper>
        <mb-popper direction="left" plaintext="收起">
            <a class="tool-item" @click="settingStore.toggle(`ui-collapse`)">
                <iconify :name="`fa6-solid:chevron-${collapse ? `left` : `right`}`"/>
            </a>
        </mb-popper>
    </div>
</template>

<style lang="scss" scoped>
    .z-toolbar {
        display: grid;
        gap: 8px;
        position: fixed;
        right: 24px;
        bottom: 32px;
        pointer-events: none;
    }

    .tool-item {
        display: grid;
        place-items: center;
        position: relative;
        width: 36px;
        aspect-ratio: 1;
        border-radius: 6px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-theme-dark);
        color: white;
        pointer-events: auto;

        &:hover {
            background-color: var(--color-info);
        }
    }

    @property --scroll-progress {
        syntax: "<integer>";
        initial-value: 0;
        inherits: false;
    }

    .tool-progress, .tool-arrow-top {
        position: absolute;
        opacity: var(--op0);
        inset: 0;
        margin: auto;
        animation: scroll-progress linear;
        animation-timeline: scroll();
    }

    .tool-progress {
        --op1: 1;
        --op0: 0;

        font-family: var(--font-smooth);
        font-size: 14px;
        line-height: 36px;
        text-align: center;
        counter-reset: scroll-progress var(--scroll-progress);

        &::before {
            content: counter(scroll-progress);
        }

        &::after {
            content: "%";
            padding-left: 1px;
            font-size: 11px;
        }

        :hover > & {
            --op1: 0;
        }
    }

    .tool-arrow-top {
        --op1: 0;
        --op0: 1;

        :hover > & {
            --op1: 1;
        }
    }

    @keyframes scroll-progress {
        0% {
            --scroll-progress: 0;

            opacity: var(--op1);
        }

        99.9999999% {
            opacity: var(--op1);
        }

        100% {
            --scroll-progress: 99;
        }
    }
</style>