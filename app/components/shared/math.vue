<script lang="ts" setup>
    import { renderToString } from "katex";

    const props = withDefaults(defineProps<{
        type: "inline" | "block";
        raw?: string;
    }>(), {
        raw: ""
    });

    useHead({
        link: [
            { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css" }
        ]
    });

    const code = computed(() => {
        return renderToString(props.raw, {
            displayMode: props.type === "block",
            errorColor: "var(--color-danger)",
            throwOnError: false,
            strict(errorCode) {
                if (errorCode === "newLineInDisplayMode") {
                    return "ignore";
                }
                return "warn";
            }
        });
    });

    function render() {
        if (props.type === "inline") {
            return h("span", {
                class: "katex",
                innerHTML: code.value.slice("<span class=\"katex\">".length, -"</span>".length)
            });
        }
        else {
            return h("pre", {
                innerHTML: code.value
            });
        }
    }
</script>

<template>
    <render class="mb-math"/>
</template>