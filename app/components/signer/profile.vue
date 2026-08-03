<script lang="ts" setup>
  const config = useRuntimeConfig();
  const signerStore = useSignerStore();
  const toastStore = useToastStore();

  // 退出登录
  async function logout() {
    try {
      await signerStore.clear();
    }
    catch {
      toastStore.error("[logout]", "退出登录失败");
    }
  }
</script>

<template>
  <signer-view title="资料卡">
    <div class="signer-profile">
      <span class="signer-nickname">{{ config.public.author }}</span>
      <div class="signer-operator">
        <mb-button @click="logout">退出登录</mb-button>
      </div>
      <user-avatar class="signer-avatar" :src="config.public.avatar"/>
    </div>
  </signer-view>
</template>

<style scoped>
  .signer-profile {
    display: grid;
    grid-template:
      "A C"
      "B C" / 1fr auto;
    place-items: center flex-end;
    column-gap: 1em;
    margin-top: 1em;
  }

  .signer-nickname {
    font-family: var(--font-smooth);
    font-size: 18px;
  }

  .signer-avatar {
    grid-area: C;
    width: 72px;
  }
</style>
