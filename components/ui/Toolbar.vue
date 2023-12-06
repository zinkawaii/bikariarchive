<script setup>
    const drawerStore = useDrawerStore();
    const settingStore = useSettingStore();

    const collapse = computed(() => {
        return settingStore.get("ui-collapse");
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
</script>

<template>
    <div class="z-toolbar">
        <div class="tool-list" :class="{ collapse }">
            <nuxt-link class="tool-item" to="https://www.travellings.cn/go.html">
                <i class="fas fa-subway"></i>
            </nuxt-link>
            <a class="tool-item" @click="settingStore.open()">
                <i class="fas fa-gear"></i>
            </a>
            <a class="tool-item" @click="drawerStore.toggle()">
                <i class="fas fa-user"></i>
            </a>
            <a class="tool-item" @click="scrollToTop">
                <i class="fas fa-arrow-up"></i>
            </a>
        </div>
        <a class="tool-item" @click="settingStore.toggle(`ui-collapse`)">
            <i :class="[`fas`, `fa-chevron-${collapse ? `left` : `right`}`]"></i>
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
        align-items: center;
        width: 36px;
        aspect-ratio: 1;
        border-radius: 6px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-theme-block-dark);
        pointer-events: auto;

        &:hover {
            background-color: var(--color-gray);
        }

        > i {
            color: white;
        }
    }
</style>