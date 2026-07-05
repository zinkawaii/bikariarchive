<script lang="ts" setup>
  const signerStore = useSignerStore();
  const toastStore = useToastStore();

  const nickname = ref("");
  const email = ref("");
  const captcha = ref("");
  const password = ref("");

  const captchaStage = ref(0);
  const captchaDelay = ref(0);

  const { errors, clear, glitch, validate } = useValidate({
    nickname: {
      target: nickname,
      required: true,
      preset: "nickname",
    },
    email: {
      target: email,
      required: true,
      preset: "email",
    },
    captcha: {
      target: captcha,
      required: true,
      preset: "captcha",
    },
    password: {
      target: password,
      required: true,
      preset: "password",
    },
  });

  //验证码输入限制
  function onCaptchaInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    target.value = value.replace(/\D+/, "").slice(0, 6);
  }

  //发送验证码
  async function sendCaptcha() {
    if (!validate("email")) {
      return;
    }

    captchaStage.value = 1;

    try {
      await $fetch("/api/user/logon/captcha", {
        query: {
          email: email.value,
        },
      });

      const max = 60;
      captchaStage.value = 2;
      captchaDelay.value = max;

      await Zin.interval(() => {
        captchaDelay.value--;
      }, {
        immediate: false,
        duration: 1000,
        times: max,
      });

      captchaStage.value = 0;
    }
    catch {
      toastStore.error("[captcha]:send", "验证码发送失败");
    }
  }

  //注册
  const register = Zin.debounce(async () => {
    try {
      await $fetch("/api/user/logon", {
        method: "post",
        body: {
          nickname: nickname.value,
          email: email.value,
          captcha: captcha.value,
          password: password.value,
        },
      });
      signerStore.switchView("login");
    }
    catch (error) {
      switch (getErrorCode(error)) {
        case "1":
          return glitch("email", "该邮箱已注册");
        case "2":
          return glitch("captcha", "验证码不存在");
        case "3":
          return glitch("captcha", "验证码已过期");
        case "4":
          return glitch("captcha", "验证码不正确");
        default:
          return toastStore.error("[logon]", "注册失败");
      }
    }
  }, {
    title: "注册",
  });

  //提交
  function submit() {
    clear();
    validate() && register();
  }
</script>

<template>
  <signer-view title="注册">
    <template #subtitle>
      <button @click="signerStore.switchView(`login`)">
        已有账号，前往登录<iconify name="fa7-solid:chevron-right"/>
      </button>
    </template>
    <meow-input
      type="text"
      placeholder="昵称"
      v-model="nickname"
      v-model:error="errors.nickname"
    />
    <meow-input
      type="text"
      placeholder="电子邮箱"
      v-model="email"
      v-model:error="errors.email"
    />
    <div class="sign-captcha">
      <meow-input
        type="text"
        placeholder="验证码"
        v-model="captcha"
        v-model:error="errors.captcha"
        @input="onCaptchaInput"
      />
      <mb-button :disabled="captchaStage > 0" @click="sendCaptcha">{{
        captchaStage === 1 ? "发送中……" :
        captchaStage === 2 ? `已发送(${captchaDelay})` :
        "发送验证码"
      }}</mb-button>
    </div>
    <meow-input
      type="password"
      placeholder="密码"
      v-model="password"
      v-model:error="errors.password"
      @keyup.enter="submit"
    />
  </signer-view>
</template>

<style scoped>
  .sign-captcha {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: flex-end;
    gap: 1em;
  }
</style>
