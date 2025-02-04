<script lang="ts" setup>
    import { LazyMbImageViewer } from "#components";

    const props = withDefaults(defineProps<{
        src: HTMLImageElement["src"];
        alt?: HTMLImageElement["alt"];
        loading?: HTMLImageElement["loading"];
        align?: string;
        character?: string;
        viewable?: boolean;
    }>(), {
        viewable: true
    });

    const dialogStore = useDialogStore();
    const gsap = useGsap();

    const imgComp = useTemplateRef("img");
    const imgEl = computed(() => imgComp.value?.$refs.imgEl);

    const captionEl = useTemplateRef("caption");
    const tagEls = computed(() => {
        return [...captionEl.value?.children ?? []].toReversed();
    });

    const { open, close } = dialogStore.use(() => h(LazyMbImageViewer, {
        target: imgEl.value,
        async onClose() {
            await close();
            if (tagEls.value.length) {
                displayCharacters();
            }
        }
    }));

    const characters = computed(() => {
        return props.character.split(",");
    });

    const [isLoaded, toggleLoaded] = useToggle(false);
    onMounted(() => {
        if (imgEl.value.complete) {
            toggleLoaded();
        }
        else {
            imgEl.value.addEventListener("load", () => toggleLoaded());
        }
    });

    function displayCharacters() {
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
</script>

<template>
    <figure class="mb-image">
        <nuxt-img
            ref="img"
            class="image-entity"
            :style="{ objectPosition: align }"
            :class="{
                [`is-absolute`]: align,
                [`cursor-pointer`]: viewable
            }"
            :src
            :alt
            :loading
            @click="viewable && open()"
        />
        <transition @enter="displayCharacters">
            <figcaption v-if="character && isLoaded" ref="caption" class="image-caption">
                <character-tag v-for="name in characters" :name/>
            </figcaption>
        </transition>
    </figure>
</template>

<style lang="scss" scoped>
    .mb-image {
        position: relative;
    }

    .image-entity {
        height: 100%;
        object-fit: cover;

        &.is-absolute {
            position: absolute;
        }
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