<script setup>
    const props = defineProps(["item"]);

    const selectedIndex = ref(0);
</script>

<template>
    <div class="mb-tab">
        <ul class="tab-list">
            <li v-for="(name, index) in item" class="tab-item" :class="{
                active: selectedIndex === index
            }" @click="selectedIndex = index"
            >{{ name }}</li>
        </ul>
        <div class="content">
            <template v-for="(name, index) in item">
                <div v-show="selectedIndex === index">
                    <slot :name="name"></slot>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .tab-list {
        display: flex;
        align-items: flex-end;
        height: 32px;
    }

    .tab-item {
        overflow: hidden;
        height: 18px;
        margin: 0 0 5px;
        padding: 0 12px 5px;
        font-size: 14px;
        line-height: 1.5;
        word-break: break-all;

        &:first-child {
            border-left: 1px solid transparent;
        }

        &:last-child {
            border-right: 1px solid transparent;
        }

        &.active {
            height: 32px;
            margin: 0 0 -1px;
            padding: 3px 12px 6px;
            border: 1px solid var(--color-border-light);
            border-top: 4px solid var(--color-theme-block);
            border-bottom: 0;
            background-color: var(--color-background);
            z-index: 1;
        }

        &:not(.active) {
            color: var(--color-gray);
            cursor: pointer;
        }

        &:not(.active) + &:not(.active) {
            border-left: 1px solid var(--color-border-light);
        }
    }

    .content {
        min-height: 64px;
        padding: 8px;
        border: 1px solid var(--color-border-light);
        background-color: var(--color-background);
    }
</style>