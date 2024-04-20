<script setup>
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

    const toastStore = useToastStore();
    const isExpand = ref(false);
    const $Code = ref();

    //代码
    const code = await useShikiHighlighted(props.raw, { lang: props.lang, ...highlightOptions });

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
        navigator.clipboard.writeText($Code.value.textContent);
        toastStore.success("copy", "代码已复制");
    }
</script>

<template>
    <figure class="mb-code">
        <div class="code-header">
            <span class="text-uppercase">{{ lang }}</span>
            <a @click="copy"><icon name="fa6-solid:paste"/></a>
        </div>
        <div class="code-area" :class="{ expanded: isExpand }">
            <pre class="code-line">{{ lineStr }}</pre>
            <pre ref="$Code" class="shiki code-content" v-html="code || props.raw"></pre>
        </div>
        <div v-if="lines >= 10" class="code-expand" @click="isExpand = !isExpand">
            <icon :name="`fa6-solid:angles-${isExpand ? `up` : `down`}`"/>
        </div>
    </figure>
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
            font-family: var(--font-code);
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