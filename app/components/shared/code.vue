<script lang="ts" setup>
    import type { BundledLanguage } from "shiki";

    const props = withDefaults(defineProps<{
        lang?: BundledLanguage;
        meta?: string;
        raw?: string;
    }>(), {
        lang: "js",
        raw: "",
    });

    const shikiStore = useShikiStore();

    const [isCollapse, toggleCollapse] = useToggle(false);
    const [isExpand, toggleExpand] = useToggle(false);
    const codeEl = useTemplateRef("pre");

    const actions = [
        {
            icon: "fa7-solid:paste",
            action() {
                copyText(codeEl.value!.textContent!, "代码已复制");
            },
        },
        {
            icon: () => `fa7-solid:chevron-${isCollapse.value ? `left` : `down`}`,
            action: () => toggleCollapse(),
        },
    ];

    //代码
    const code = ref(escapeHtml(props.raw));
    watch(props, async () => {
        const shiki = await shikiStore.load();
        await shikiStore.loadLang(props.lang);
        code.value = shiki.codeToHtml(props.raw, {
            ...shikiStore.options,
            lang: props.lang,
            meta: { __raw: props.meta },
        });
    }, {
        immediate: import.meta.browser,
    });

    //行数
    const lines = computed(() => {
        return props.raw.split("\n").length;
    });

    //行号
    const lineStr = computed(() => {
        return Array.from({ length: lines.value }, (_, i) => i + 1).join("\n");
    });
</script>

<template>
    <figure class="mb-code">
        <figcaption class="code-header">
            <span class="code-lang text-uppercase">{{ lang }}</span>
            <button v-for="{ icon, action } in actions" class="code-action" @click="action">
                <iconify :name="toValue(icon)"/>
            </button>
        </figcaption>
        <div
            class="code-area"
            :class="{
                [`is-collapse`]: isCollapse,
                [`is-expand`]: isExpand,
            }"
        >
            <pre class="code-line">{{ lineStr }}</pre>
            <pre ref="pre" class="shiki edge-fades-x no-scrollbar" v-html="code"></pre>
            <button v-if="lines >= 10" class="code-expand" @click="toggleExpand()">
                <iconify :name="`fa7-solid:angles-${isExpand ? `up` : `down`}`"/>
            </button>
        </div>
    </figure>
</template>

<style lang="scss" scoped>
    .mb-code {
        overflow: hidden;
        border: 1px solid var(--color-border-lighter);
        border-radius: 16px;
        background-color: var(--color-background);
    }

    .code-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px;
        padding-inline: 12px;
        border-radius: 12px;
        background: var(--color-theme);
        font-family: var(--font-smooth);
        font-size: 1rem;
        line-height: 28px;
        color: var(--color-theme-text);
    }

    .code-lang {
        flex: 1;
    }

    .code-action {
        display: grid;
        place-items: center;
        width: 1rem;
    }

    .code-area {
        display: flex;
        position: relative;
        overflow: hidden;
        max-height: 196px;
        margin-top: -4px;
        font-family: var(--font-monospace);
        font-size: 14px;
        line-height: 20px;
        transition-property: max-height, margin;
        transition-duration: 0.25s;

        &.is-expand {
            max-height: fit-content;

            > .shiki {
                padding-bottom: 2em;
            }
        }

        &.is-collapse {
            max-height: 0;
            margin-bottom: 4px;
        }
    }

    .code-line, .shiki {
        padding: 1ch;
    }

    .code-line {
        margin-left: 1ch;
        text-align: right;
        color: var(--color-info);
        user-select: none;
    }

    .shiki {
        overflow-y: hidden;
    }

    .code-expand {
        display: grid;
        place-items: center;
        position: absolute;
        inset: auto 0 0;
        height: 2em;
        background: linear-gradient(to bottom, transparent, var(--color-background));

        > .iconify {
            animation: expand-flash 2s infinite;
        }
    }

    @keyframes expand-flash {
        0% {
            opacity: 1;
        }

        50% {
            opacity: 0.33;
        }
    }
</style>
