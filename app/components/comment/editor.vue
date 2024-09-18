<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        maxlength?: number;
    }>(), {
        maxlength: 512
    });
    const modelValue = defineModel<string>();

    const initialValue = modelValue.value;
    const length = computed(() => {
        return modelValue.value.replaceAll(/\s/g, "").length;
    });

    const editorEl = useTemplateRef("editor");
    usePlainShiki(editorEl, {
        lang: "markdown",
        selector: (theme) => `[z-${theme}]`
    });

    function checkLength(event: InputEvent) {
        if (length.value + event.data?.length > props.maxlength) {
            event.preventDefault();
        }
    }

    function updateModelValue(event: InputEvent) {
        const target = event.target as HTMLElement;
        modelValue.value = target.textContent;
    }
</script>

<template>
    <div
        ref="editor"
        class="panel-editor"
        contenteditable="plaintext-only"
        @beforeinput="checkLength"
        @input="updateModelValue"
        v-text="initialValue"
    ></div>
    <div class="panel-count">{{ length }} / {{ maxlength }}</div>
</template>

<style lang="scss" scoped>
    .panel-editor {
        overflow: auto;
        height: 180px;
        padding: 6px 8px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 4px;
        outline: 2px solid transparent;
        outline-offset: -1px;
        background-color: var(--color-background);
        line-height: 24px;
        word-break: break-all;
        transition: outline 0.25s;

        &:focus {
            outline-color: var(--color-theme-dark);
        }
    }

    .panel-count {
        position: absolute;
        right: 8px;
        bottom: 30px;
        font-size: 12px;
        color: var(--color-text-info);
    }
</style>