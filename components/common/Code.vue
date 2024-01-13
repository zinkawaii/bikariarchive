<script setup>
    import ClipboardJS from "clipboard";
    import prism from "prismjs";

    const props = defineProps(["lang"]);
    const slots = useSlots();
    const code = ref();
    const $Code = ref();

    const source = slots.default()[0].children;
    const lines = source.split("\n").length;
    const lineStr = Array.from({ length: lines }).map((_, i) => i + 1).join("\n");

    //代码高亮
    code.value = prism.highlight(source, prism.languages[props.lang], props.lang);

    //折叠与展开
    const isExpand = ref(false);

    //复制
    function copy() {
        ClipboardJS.copy($Code.value);
    }
</script>

<template>
    <div class="mb-code">
        <div class="code-header">
            <span>{{ lang }}</span>
            <span class="code-copy" @click="copy"><fa-icon icon="paste"/></span>
        </div>
        <div class="code-area" :class="{ expanded: isExpand }">
            <pre class="code-line">{{ lineStr }}</pre>
            <template v-if="!code">
                <slot></slot>
            </template>
            <pre v-else ref="$Code" class="code-content" :class="`language-${lang}`" v-html="code"></pre>
        </div>
        <div v-if="lines >= 10" class="code-expand" @click="isExpand = !isExpand">
            <fa-icon :icon="`angles-${isExpand ? `up` : `down`}`"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-code {
        position: relative;
        overflow: hidden;
        margin-block: 1em;
        border: 1px solid var(--color-border-light);
        border-radius: 8px;
        background-color: var(--color-background);
    }

    .code-header {
        display: flex;
        justify-content: space-between;
        padding-inline: 12px;
        background: var(--color-theme);
        font-family: var(--font-smooth);
        line-height: 28px;
        color: var(--color-theme-text);
    }

    .code-copy {
        cursor: pointer;
    }

    .code-area {
        display: flex;
        max-height: 194px;
        font-size: 14px;
        line-height: 20px;

        > pre {
            padding: 8px;
            font-family: consolas;
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
        color: var(--color-gray);
        user-select: none;
    }

    .code-content {
        overflow: auto hidden;
        border-left: 1px solid var(--color-border-light);

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