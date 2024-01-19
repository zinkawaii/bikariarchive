<script setup>
    const signerStore = useSignerStore();
    const settingStore = useSettingStore();

    const collapse = computed(() => {
        return settingStore.get("ui-collapse");
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0
        });
    }
</script>

<template>
    <div class="z-toolbar">
        <div class="tool-list" :class="{ collapse }">
            <nuxt-link class="tool-item" to="https://www.travellings.cn/go.html">
                <fa-icon icon="subway"/>
            </nuxt-link>
            <a class="tool-item" @click="settingStore.open()">
                <fa-icon icon="gear"/>
            </a>
            <a class="tool-item" @click="signerStore.toggle()">
                <fa-icon icon="user"/>
            </a>
            <a class="tool-item" @click="scrollToTop">
                <fa-icon icon="arrow-up"/>
            </a>
        </div>
        <a class="tool-item" @click="settingStore.toggle(`ui-collapse`)">
            <fa-icon :icon="`chevron-${collapse ? `left` : `right`}`"/>
        </a>
    </div>
</template>

<style lang="scss" scoped>
    .z-toolbar {
        position: fixed;
        right: 24px;
        bottom: 32px;
        pointer-events: none;
    }

    .tool-list {
        display: grid;
        gap: 8px;
        margin-bottom: 8px;
        transition: all 0.4s;

        &.collapse {
            opacity: 0;
            transform: translateX(60px);
            pointer-events: none;
        }
    }

    .tool-item {
        display: grid;
        place-content: center;
        width: 36px;
        aspect-ratio: 1;
        border-radius: 6px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-theme-dark);
        color: white;
        pointer-events: auto;

        &:hover {
            background-color: var(--color-text-info);
        }
    }
</style>