<script lang="ts" setup>
    import { animate, stagger } from "animejs";
    import type { ImgHTMLAttributes } from "vue";
    import { LazyBikariyaImageViewer } from "#components";

    const props = withDefaults(defineProps<{
        src: ImgHTMLAttributes["src"];
        alt?: ImgHTMLAttributes["alt"];
        loading?: ImgHTMLAttributes["loading"];
        maxWidth?: ImgHTMLAttributes["width"];
        maxHeight?: ImgHTMLAttributes["height"];
        align?: string;
        caption?: string;
        character?: string;
        reference?: string;
        viewable?: boolean;
    }>(), {
        viewable: true,
    });

    const contextMenuStore = useContextMenuStore();
    const modalStore = useModalStore();

    const imgComp = useTemplateRef("img");
    const charEl = useTemplateRef("char");
    const imgEl = computed<HTMLImageElement>(() => imgComp.value?.imgEl);

    //角色列表
    const characters = computed(() => {
        return props.character?.split(",");
    });

    //附加样式
    const style = computed(() => {
        return {
            maxWidth: props.maxWidth ? `${props.maxWidth}px` : void 0,
            maxHeight: props.maxHeight ? `${props.maxHeight}px` : void 0,
            objectPosition: props.align,
        };
    });

    //右键菜单
    contextMenuStore.extra(imgEl, {
        title: "image",
        shield: ["image"],
        when: () => props.reference,
        items: [
            {
                title: "前往图源",
                icon: "fa7-solid:arrow-up-right-from-square",
                action() {
                    window.open(props.reference, "_blank");
                },

            },
        ],
    });

    //查看器
    const { open, close } = modalStore.use(() => h(LazyBikariyaImageViewer, {
        target: imgEl.value!,
        async onClose() {
            await close();
            if (charEl.value?.children.length) {
                displayCharacters();
            }
        },
    }));

    //加载完成时
    const [isLoaded, toggleLoaded] = useToggle(false);
    onMounted(() => {
        if (imgEl.value!.complete) {
            toggleLoaded();
        }
        else {
            imgEl.value!.addEventListener("load", () => toggleLoaded());
        }
    });

    //触发回弹动画
    function displayCharacters() {
        animate(charEl.value?.children ?? [], {
            y: [42, 0],
            delay: stagger(50, { reversed: true }),
            duration: 400,
            ease: "outBack",
        });
    }
</script>

<template>
    <figure class="mb-image">
        <nuxt-img
            ref="img"
            class="image-entity"
            :class="{
                [`is-absolute`]: align,
                [`cursor-pointer`]: viewable,
            }"
            :style
            :src
            :alt
            :loading
            @click="viewable && open()"
        />
        <transition v-if="character" @enter="displayCharacters">
            <div v-if="isLoaded" ref="char" class="image-characters">
                <character-tag v-for="name in characters" :name/>
            </div>
        </transition>
        <figcaption v-if="caption" class="image-caption">{{ caption }}</figcaption>
    </figure>
</template>

<style lang="scss" scoped>
    .mb-image {
        display: grid;
        position: relative;
    }

    .image-entity {
        height: 100%;
        margin: auto;
        object-fit: cover;

        &.is-absolute {
            position: absolute;
        }
    }

    .image-characters {
        display: flex;
        flex-wrap: wrap-reverse;
        justify-content: flex-end;
        gap: 8px;
        position: absolute;
        overflow: hidden;
        inset: auto 0 0;
        padding: 8px;
    }

    .image-caption {
        margin-top: 8px;
        font-size: 13px;
        line-height: 2;
        text-align: center;
        color: var(--color-text-secondary);
    }
</style>
