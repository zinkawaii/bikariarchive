<script lang="ts" setup>
    defineProps<{
        message: string;
    }>();
    const emit = defineEmits<{
        cancel: [];
        confirm: [];
    }>();

    function cancel() {
        emit("cancel");
    }

    function confirm() {
        emit("confirm");
    }
</script>

<template>
    <mb-dialog class="mb-confirm" @close="cancel">
        <coco-title>确认</coco-title>
        <p class="confirm-content">{{ message }}</p>
        <div class="confirm-operator">
            <mb-button @click="cancel">取消</mb-button>
            <mb-button @click="confirm">确定</mb-button>
        </div>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .mb-confirm {
        max-width: 720px;
        padding: 1rem 1.5rem;
        font-size: 14px;
    }

    .confirm-content {
        margin-block: 8px 24px;
        line-height: 24px;
    }

    .confirm-operator {
        display: flex;
        justify-content: right;
        gap: 8px;

        > .mb-button {
            width: 96px;
        }
    }
</style>