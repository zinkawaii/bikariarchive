<script lang="ts" setup>
    import type { OutlineHeaderItem } from "~/types/outline";

    defineProps<{
        headers: OutlineHeaderItem[];
        root?: boolean;
    }>();
</script>

<template>
    <ul class="outline-list" :class="{ [`aside-limited`]: root }">
        <li v-for="{ title, link, children } in headers" class="outline-item">
            <a class="text-truncate aside-anchor" :href="link">{{ title }}</a>
            <template v-if="children.length">
                <aside-outline-list :headers="children"/>
            </template>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .outline-item {
        display: grid;

        > .outline-list {
            margin-left: 1em;
        }
    }
</style>