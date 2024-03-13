<script setup>
    const signerStore = useSignerStore();
    const settingStore = useSettingStore();

    const collapse = computed(() => {
        return settingStore.get("ui-collapse");
    });
</script>

<template>
    <div class="z-toolbar" :class="{ collapse }">
        <nuxt-link class="tool-item" to="https://www.travellings.cn/go.html">
            <fa icon="subway"/>
        </nuxt-link>
        <a class="tool-item" @click="settingStore.open()">
            <fa icon="gear"/>
        </a>
        <a class="tool-item" @click="signerStore.toggle()">
            <fa icon="user"/>
        </a>
        <a class="tool-item" href="#">
            <span class="tool-progress"></span>
            <fa class="tool-arrow-top" icon="arrow-up"/>
        </a>
        <a class="tool-item" @click="settingStore.toggle(`ui-collapse`)">
            <fa :icon="`chevron-${collapse ? `left` : `right`}`"/>
        </a>
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

        &.collapse > .tool-item:not(:last-child) {
            opacity: 0;
            transform: translateX(60px);
            pointer-events: none;
        }
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
        transition: all 0.4s;
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