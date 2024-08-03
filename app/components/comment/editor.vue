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

    const editorEl = ref<HTMLTextAreaElement>();
    usePlainShiki(editorEl, {
        lang: "markdown",
        watch: true
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
        ref="editorEl"
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
        background-color: var(--color-background);
        line-height: 24px;
        word-break: break-all;
        transition: border-color 0.4s;

        &:focus {
            border-color: var(--color-theme-dark);
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