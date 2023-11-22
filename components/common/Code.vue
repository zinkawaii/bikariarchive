<script setup>
    import ClipboardJS from "clipboard";
    import prism from "prismjs";
    import "prism-themes/themes/prism-one-dark.min.css";

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
            <span class="code-copy" @click="copy"><i class="fas fa-paste"></i></span>
        </div>
        <div class="code-area" :class="{ expanded: isExpand }">
            <pre class="code-line">{{ lineStr }}</pre>
            <template v-if="!code">
                <slot></slot>
            </template>
            <pre v-else class="code-content" ref="$Code" v-html="code"></pre>
        </div>
        <div v-if="lines >= 10" class="code-expand" @click="isExpand = !isExpand">
            <i :class="[`fas`, `fa-angles-${isExpand ? `up` : `down`}`]"></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-code {
        position: relative;
        overflow: hidden;
        margin: 8px 0;
        border: 1px solid var(--color-border-light);
        border-radius: 8px;
        background-color: var(--color-background);
    }

    .code-header {
        display: flex;
        justify-content: space-between;
        padding: 0 12px;
        background: var(--color-theme-block);
        font-weight: bold;
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
        height: 24px;
        background: linear-gradient(to bottom, transparent, var(--color-background));
        text-align: center;
        cursor: pointer;

        > i {
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