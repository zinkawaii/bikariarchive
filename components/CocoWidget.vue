<script setup>
    const props = defineProps({
        title: String
    });
</script>

<template>
    <div class="content-widget coco-widget">
        <header v-if="title" class="cw-header">
            <h1 class="cw-title">{{ title }}</h1>
        </header>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
    .coco-widget {
        padding: 32px;

        @media (width < 1024px) {
            padding: 16px;
        }
    }

    .cw-header {
        margin-bottom: 24px;

        @media (width < 1024px) {
            margin-bottom: 12px;
        }
    }

    .cw-title {
        text-align: center;
    }
</style>