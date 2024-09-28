<script lang="ts" setup>
    import { MbImageViewer } from "#components";

    const props = defineProps<{
        src: string;
        character?: string;
        alt?: string;
    }>();

    const dialogStore = useDialogStore();
    const gsap = useGsap();

    const imgComp = useTemplateRef("img");
    const imgEl = useCurrentElement(imgComp);

    const captionEl = useTemplateRef("caption");
    const tagEls = computed(() => {
        return [...captionEl.value?.children ?? []].toReversed();
    });

    const { open, close } = dialogStore.use(() => h(MbImageViewer, {
        target: imgEl.value,
        async onClose() {
            await close();
            if (!tagEls.value.length) {
                return;
            }

            const tl = gsap.timeline({
                defaults: {
                    duration: 0.4,
                    ease: "back.out"
                }
            });

            for (const el of tagEls.value) {
                tl.fromTo(el, { y: 42 }, { y: 0 }, "<0.05");
            }
            tl.play();
        }
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
        <figcaption v-if="character && isLoaded" ref="caption" class="image-caption">
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
        overflow: hidden;
        inset: auto 0 0;
        padding: 0.5em;
    }
</style>