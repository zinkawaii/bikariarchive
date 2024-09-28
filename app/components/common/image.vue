<script lang="ts" setup>
    import { MbImageViewer } from "#components";

    const props = defineProps<{
        src: string;
        character?: string;
        alt?: string;
    }>();

    const imgComp = useTemplateRef("img");
    const imgEl = useCurrentElement(imgComp);
    const dialogStore = useDialogStore();

    const { open } = dialogStore.use(() => h(MbImageViewer, {
        target: imgEl.value
    }));

    const characters = computed(() => {
        return props.character.split(",");
    });

    const [isLoaded, toggleLoaded] = useToggle(false);
    useEventListener(imgEl, "load", toggleLoaded);
</script>

<template>
    <figure class="mb-image">
        <nuxt-img
            ref="img"
            class="cursor-pointer"
            :src
            :alt
            @click="open"
        />
        <figcaption v-if="character && isLoaded" class="image-caption">
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