<script lang="ts" setup>
    import type { EntryIllustration } from "@bikari/process";

    const props = defineProps<{
        data: EntryIllustration[];
    }>();

    const items = computed(() => {
        return props.data.map((item) => item.title);
    });
</script>

<template>
    <mb-tab class="entry-illustration" :items>
        <template v-for="{ title, illustrator, src } in data" #[title]>
            <mb-gallery :illustrator>
                <mb-image :src alt="[illustration]"/>
            </mb-gallery>
        </template>
    </mb-tab>
</template>

<style lang="scss" scoped>
    .entry-illustration {
        width: min(336px, 100%);
        margin-inline: auto;
    }
</style>