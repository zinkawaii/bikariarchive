<script lang="ts" setup>
    const signerStore = useSignerStore();
    const toastStore = useToastStore();

    const nickname = ref("");
    const email = ref("");
    const verify = ref("");
    const password = ref("");

    const verifyStage = ref(0);
    const verifyDelay = ref(0);

    const { errors, clear, glitch, validate } = useValidate({
        nickname: {
            target: nickname,
            required: true,
            ...nicknameValidates,
        },
        email: {
            target: email,
            required: true,
            rule: Zexp.email,
            message: "邮箱格式不正确",
        },
        verify: {
            target: verify,
            required: true,
            rule: /.+/,
            message: "请输入验证码",
        },
        password: {
            target: password,
            required: true,
            ...passwordValidates,
        },
    });

    //验证码输入限制
    function onVerifyInput(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        target.value = value.replace(/\D+/, "").slice(0, 6);
    }

    //发送验证码
    async function sendVerify() {
        if (!validate("email")) {
            return;
        }

        verifyStage.value = 1;

        try {
            const { error } = await $fetch("/api/user/logon/verify", {
                query: {
                    email: email.value,
                },
            });

            error ? failed() : successed();
        }
        catch {
            failed();
        }

        //发送成功
        async function successed() {
            const max = 60;
            verifyStage.value = 2;
            verifyDelay.value = max;

            await Zin.interval(() => {
                verifyDelay.value--;
            }, {
                immediate: false,
                duration: 1000,
                times: max,
            });

            verifyStage.value = 0;
        }

        //发送失败
        function failed() {
            toastStore.error("[verify]:send", "验证码发送失败");
        }
    }

    //注册
    const register = Zin.debounce(async () => {
        try {
            const { error } = await $fetch("/api/user/logon", {
                method: "post",
                body: {
                    nickname: nickname.value,
                    email: email.value,
                    verify: verify.value,
                    password: password.value,
                },
            });

            switch (error) {
                case 1: return glitch("email", "该邮箱已注册");
                case 2: return glitch("verify", "验证码不存在");
                case 3: return glitch("verify", "验证码已过期");
                case 4: return glitch("verify", "验证码不正确");
                case 0: signerStore.switchView("login");
            }
        }
        catch {
            toastStore.error("[logon]", "注册失败");
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
    <div class="sign-verify">
        <meow-input
            type="text"
            placeholder="验证码"
            v-model="verify"
            v-model:error="errors.verify"
            @input="onVerifyInput"
        />
        <mb-button :disabled="verifyStage > 0" @click="sendVerify">{{
            verifyStage === 1 ? "发送中……" :
            verifyStage === 2 ? `已发送(${verifyDelay})` :
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
</template>

<style lang="scss" scoped>
    .sign-verify {
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: flex-end;
        gap: 1em;
    }
</style>
