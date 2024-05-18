<script lang="ts" setup>
    import type { BundledLanguage } from "shiki";
    import CryptoES from "crypto-es";

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
    const { data: code } = await useLazyAsyncData(
        CryptoES.MD5(props.raw).toString(),
        async () => {
            const shiki = await getShikiHighlighter();
            await loadShikiLanguages(shiki, props.lang);
            return shiki.highlight(props.raw, {
                lang: props.lang,
                ...highlightOptions
            });
        }
    );

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
            <a @click="copy"><icon name="fa6-solid:paste"/></a>
            <a @click="toggleCollapse()">
                <icon :name="`fa6-solid:chevron-${isCollapse ? `left` : `down`}`"/>
            </a>
        </div>
        <template v-if="!isCollapse">
            <div class="code-area" :class="{ [`is-expand`]: isExpand }">
                <pre class="code-line">{{ lineStr }}</pre>
                <pre ref="$code" class="shiki code-content" v-html="code || props.raw"></pre>
            </div>
            <div v-if="lines >= 10" class="code-expand" @click="toggleExpand()">
                <icon :name="`fa6-solid:angles-${isExpand ? `up` : `down`}`"/>
            </div>
        </template>
    </figure>
</template>

<style lang="scss" scoped>
    .mb-code {
        position: relative;
        overflow: hidden;
        padding: 4px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 16px;
        background-color: var(--color-background);
    }

    .code-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        height: 28px;
        padding-inline: 12px;
        border-radius: 12px;
        background: var(--color-theme);
        font-family: var(--font-smooth);
        font-size: 1rem;
        color: var(--color-theme-text);
    }

    .code-lang {
        flex: 1;
    }

    .code-area {
        display: flex;
        max-height: 190px;
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
        margin-bottom: -4px;
        padding: 8px;
        font-family: var(--font-code);
    }

    .code-line {
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
        position: absolute;
        bottom: 0;
        width: 100%;
        background: linear-gradient(to bottom, transparent, var(--color-background));
        line-height: 28px;
        text-align: center;
        cursor: pointer;

        > .icon {
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