<script lang="ts" setup>
    import { MbImageViewer } from "#components";

    const props = defineProps<{
        src: string;
        character?: string;
        alt?: string;
    }>();

    const imgComp = ref();
    const imgEl = useCurrentElement<HTMLImageElement>(imgComp);
    const dialogStore = useDialogStore();

    const { open, close } = dialogStore.use(() => h(MbImageViewer, {
        target: imgEl.value,
        onClose: close
    }));

    const characters = computed(() => {
        return props.character.split(",");
    });
</script>

<template>
    <figure class="mb-image">
        <nuxt-img
            ref="imgComp"
            class="cursor-pointer"
            :src
            :alt
            @click="open"
        />
        <figcaption v-if="character" class="image-caption">
            <character-tag v-for="name in characters" :name/>
        </figcaption>
    </figure>
</template>

<style lang="scss" scoped>
    .mb-image {
        position: relative;
    }

    .image-caption {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap-reverse;
        gap: 0.5em;
        position: absolute;
        inset: auto 0.5em 0.5em;
    }
</style>