<script lang="ts" setup>
  const signerStore = useSignerStore();
  const toastStore = useToastStore();

  const nickname = ref("");
  const password = ref("");

  const { errors, glitch, validate } = useValidate({
    nickname: {
      target: nickname,
      required: true,
      preset: "nickname",
    },
    password: {
      target: password,
      required: true,
      preset: "password",
    },
  });

  const { execute, error } = useLazyFetch("/api/auth/login", {
    method: "post",
    body: {
      account: nickname,
      password,
    },
    watch: false,
    immediate: false,
  });

  const submit = Zin.debounce(async () => {
    if (!validate()) {
      return;
    }
    await execute();

    if (error.value) {
      switch (error.value.status) {
        case 401:
          return glitch("password", "账号或密码错误");
        case 429:
          return toastStore.info("[login]:throttle", "接口节流中");
        default:
          return toastStore.error("[login]", "登录失败");
      }
    }
    await signerStore.refresh();
  }, {
    title: "登录",
  });
</script>

<template>
  <signer-view title="登录">
    <meow-input
      type="text"
      placeholder="账号"
      v-model="nickname"
      v-model:error="errors.nickname"
    />
    <meow-input
      type="password"
      placeholder="密码"
      v-model="password"
      v-model:error="errors.password"
      @keyup.enter="submit"
    />
  </signer-view>
</template>
