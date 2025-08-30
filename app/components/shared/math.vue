<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        type: "inline" | "block";
        raw?: string;
    }>(), {
        raw: "",
    });

    const contextMenuStore = useContextMenuStore();
    const rootEl = useTemplateRef("root");

    contextMenuStore.extra(rootEl, {
        title: "math",
        items: [
            {
                title: "复制公式",
                icon: "fa7-solid:paste",
                action() {
                    copyText(props.raw, "公式已复制");
                },
            },
        ],
    });

    const code = computedAsync(async () => {
        const { renderToString } = await import("katex");

        return renderToString(props.raw, {
            displayMode: props.type === "block",
            errorColor: "var(--color-danger)",
            throwOnError: false,
            strict(errorCode) {
                if (errorCode === "newLineInDisplayMode") {
                    return "ignore";
                }
                return "warn";
            },
        });
    }, `<span class="katex">${props.raw}</span>`, { lazy: true });

    function render() {
        if (props.type === "block") {
            return h("pre", {
                class: "mb-math",
                innerHTML: code.value,
            });
        }
        else {
            return h("span", {
                class: "katex",
                innerHTML: code.value.slice("<span class=\"katex\">".length, -"</span>".length),
            });
        }
    }
</script>

<template>
    <render ref="root"/>
</template>
