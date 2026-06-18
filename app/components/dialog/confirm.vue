<script lang="ts" setup>
  defineProps<{
    message: string;
  }>();
  const emit = defineEmits<{
    close: [value: boolean];
  }>();

  function cancel() {
    emit("close", false);
  }

  function confirm() {
    emit("close", true);
  }
</script>

<template>
  <mb-dialog class="dialog-confirm" @close="cancel">
    <meow-title>确认</meow-title>
    <p class="confirm-content">{{ message }}</p>
    <div class="confirm-operator">
      <mb-button @click="cancel">取消</mb-button>
      <mb-button @click="confirm">确定</mb-button>
    </div>
  </mb-dialog>
</template>

<style lang="scss" scoped>
  .dialog-confirm {
    --dialog-padding: 1rem 1.5rem;

    max-width: 720px;
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
