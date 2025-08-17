<script lang="ts" setup>
    import { animate } from "animejs";
    import type { ImgHTMLAttributes } from "vue";
    import { LazyMbImageViewer } from "#components";

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
    const dialogStore = useDialogStore();

    const imgComp = useTemplateRef("img");
    const imgEl = computed(() => imgComp.value?.$refs.imgEl ?? null);

    const charEl = useTemplateRef("char");
    const tagEls = computed(() => {
        return [...charEl.value?.children ?? []].reverse();
    });

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
    const { open, close } = dialogStore.use(() => h(LazyMbImageViewer, {
        target: imgEl.value!,
        async onClose() {
            await close();
            if (tagEls.value.length) {
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
        for (let i = 0; i < tagEls.value.length; i++) {
            const el = tagEls.value[i];
            animate(el, {
                y: [42, 0],
                delay: i * 50,
                duration: 400,
                ease: "outBack",
            });
        }
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
