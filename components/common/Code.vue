<script setup>
    import prism from "prismjs";

    const props = defineProps({
        lang: {
            type: String,
            default: "js"
        },
        raw: {
            type: String,
            default: ""
        }
    });

    const messageStore = useMessageStore();
    const isExpand = ref(false);
    const $Code = ref();

    //行数
    const lines = computed(() => {
        return props.raw.split("\n").length;
    });

    //行号
    const lineStr = computed(() => {
        return Array.from({ length: lines.value }).map((_, i) => i + 1).join("\n");
    });

    //代码
    const code = computed(() => {
        return prism.highlight(props.raw, prism.languages[props.lang], props.lang);
    });

    //复制
    function copy() {
        navigator.clipboard.writeText($Code.value.textContent);
        messageStore.show("copy", "代码已复制");
    }
</script>

<template>
    <div class="mb-code">
        <div class="code-header">
            <span class="text-uppercase">{{ lang }}</span>
            <a @click="copy"><fa icon="paste"/></a>
        </div>
        <div class="code-area" :class="{ expanded: isExpand }">
            <pre class="code-line">{{ lineStr }}</pre>
            <pre ref="$Code" class="code-content" :class="`language-${lang}`" v-html="code"></pre>
        </div>
        <div v-if="lines >= 10" class="code-expand" @click="isExpand = !isExpand">
            <fa :icon="`angles-${isExpand ? `up` : `down`}`"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-code {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--color-border-lighter);
        border-radius: 8px;
        background-color: var(--color-background);
    }

    .code-header {
        display: flex;
        justify-content: space-between;
        padding-inline: 12px;
        background: var(--color-theme);
        font-family: var(--font-smooth);
        font-size: 1rem;
        line-height: 28px;
        color: var(--color-theme-text);
    }

    .code-area {
        display: flex;
        max-height: 194px;
        font-size: 14px;
        line-height: 20px;

        > pre {
            padding: 8px;
            font-family: var(--font-consolas);
        }

        &.expanded {
            max-height: none;

            > .code-content {
                padding-bottom: 24px;
            }
        }
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

        :deep(.token.operator) {
            background-color: transparent;
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

        > svg {
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