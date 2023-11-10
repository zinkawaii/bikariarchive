<script setup>
    const settingStore = useSettingStore();

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function scrollToBottom() {
        window.scrollTo({
            top: document.body.offsetHeight,
            behavior: "smooth"
        });
    }

    const collapse = computed(() => {
        return settingStore.setting["ui-collapse"];
    });
</script>

<template>
    <div class="z-toolbar">
        <ul class="tool-list" :class="{ collapse }">
            <li class="tool-item" @click="settingStore.open()">
                <i class="fas fa-gear"></i>
            </li>
            <li class="tool-item" id="User">
                <i class="fas fa-user"></i>
            </li>
            <li class="tool-item" @click="scrollToTop">
                <i class="fas fa-arrow-up"></i>
            </li>
            <li class="tool-item" @click="scrollToBottom">
                <i class="fas fa-arrow-down"></i>
            </li>
        </ul>
        <div class="tool-item" id="Hide" @click="settingStore.toggle(`ui-collapse`)">
            <i :class="[`fas`, `fa-chevron-${collapse ? `left` : `right`}`]"></i>
        </div>
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
        display: flex;
        flex-direction: column;
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
        display: block;
        width: 36px;
        border-radius: 6px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-theme-block-dark);
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        pointer-events: auto;

        &:hover {
            background-color: var(--color-gray);
        }

        > i {
            color: white;
        }
    }
</style>