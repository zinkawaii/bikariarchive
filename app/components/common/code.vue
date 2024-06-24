<script lang="ts" setup>
    import type { BundledLanguage } from "shiki";

    const props = withDefaults(defineProps<{
        lang?: BundledLanguage;
        raw?: string;
    }>(), {
        lang: "js"
    });

    const toastStore = useToastStore();
    const [isCollapse, toggleCollapse] = useToggle(false);
    const [isExpand, toggleExpand] = useToggle(false);
    const $code = ref();

    //代码
    const code = ref(props.raw);
    onMounted(async () => {
        const shiki = await getShikiHighlighter();
        const options = await resolveShikiOptions({
            ...highlightOptions,
            lang: props.lang
        });
        await loadShikiLanguages(props.lang);
        code.value = shiki.codeToHtml(props.raw, options);
    });

    //行数
    const lines = computed(() => {
        return props.raw.split("\n").length;
    });

    //行号
    const lineStr = computed(() => {
        return Array.from({ length: lines.value }).map((_, i) => i + 1).join("\n");
    });

    //复制
    function copy() {
        navigator.clipboard.writeText($code.value.textContent);
        toastStore.success("copy", "代码已复制");
    }
</script>

<template>
    <figure class="mb-code">
        <div class="code-header">
            <span class="text-uppercase code-lang">{{ lang }}</span>
            <a class="code-action" @click="copy">
                <icon name="fa6-solid:paste"/>
            </a>
            <a class="code-action" @click="toggleCollapse()">
                <icon :name="`fa6-solid:chevron-${isCollapse ? `left` : `down`}`"/>
            </a>
        </div>
        <div v-show="!isCollapse" class="code-area" :class="{ [`is-expand`]: isExpand }">
            <pre class="code-line">{{ lineStr }}</pre>
            <pre ref="$code" class="shiki code-content" v-html="code"></pre>
            <a v-if="lines >= 10" class="code-expand" @click="toggleExpand()">
                <icon :name="`fa6-solid:angles-${isExpand ? `up` : `down`}`"/>
            </a>
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
        max-height: 194px;
        margin-top: -4px;
        font-size: 14px;
        line-height: 20px;

        &.is-expand {
            max-height: none;

            > .code-content {
                padding-bottom: 24px;
            }
        }
    }

    .code-line, .code-content {
        padding: 8px;
        font-family: var(--font-code);
    }

    .code-line {
        margin-left: 4px;
        text-align: right;
        color: var(--color-text-info);
        user-select: none;
    }

    .code-content {
        overflow: auto hidden;
        border-left: 1px solid var(--color-border-lighter);

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .code-expand {
        display: grid;
        place-items: center;
        position: absolute;
        inset: auto 0 0;
        height: 28px;
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