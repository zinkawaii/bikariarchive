<script lang="ts" setup>
    const signerStore = useSignerStore();
    const toastStore = useToastStore();

    const nickname = ref("");
    const email = ref("");
    const verify = ref("");
    const password = ref("");

    const verifyStage = ref({
        stage: 0,
        delay: 0
    });

    const checker = new Checker({
        nickname: {
            target: nickname,
            required: true,
            reg: /^[\w\u4E00-\u9FA5]*$/,
            message: "昵称不可包含非法字符",
            validate(value) {
                const count = getByteLength(value);
                if (count === 0) {
                    return "昵称不能为空";
                }
                else if (count > 24) {
                    return "昵称长度不能超过 24 个字符";
                }
            }
        },
        email: {
            target: email,
            required: true,
            reg: Zexp.email,
            message: "邮箱格式不正确"
        },
        verify: {
            target: verify,
            required: true,
            reg: /.+/,
            message: "请输入验证码"
        },
        password: {
            target: password,
            required: true,
            reg: /^\w*$/,
            message: "密码仅由大小写字母、数字以及下划线组成",
            validate(value) {
                const count = getByteLength(value);
                if (count < 6 || count > 18) {
                    return "密码位数必须在 6-18 位之间";
                }
            }
        }
    });
    const { tips } = checker;

    //验证码输入限制
    function verifyInput(event) {
        const value = event.target.value;
        event.target.value = value.replace(/\D+/, "").slice(0, 6);
    }

    //发送验证码
    async function verifySend() {
        if (!checker.exec("email")) return;

        verifyStage.value.stage = 1;

        try {
            const { error } = await $fetch("/api/user/logon/verify", {
                query: {
                    email: email.value
                }
            });

            switch (error) {
                case 1:
                    return failed();
                default:
                    return successed();
            }
        }
        catch {
            failed();
        }

        //发送成功
        async function successed() {
            const max = 60;
            verifyStage.value.stage = 2;
            verifyStage.value.delay = max;

            await Zin.interval(() => {
                verifyStage.value.delay--;
            }, {
                immediate: false,
                duration: 1000,
                times: max
            });

            verifyStage.value.stage = 0;
        }

        //发送失败
        function failed() {
            toastStore.error("verify-send-error", "验证码发送失败");
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
                    password: password.value
                }
            });

            switch (error) {
                case 1:
                    tips.value.email = "* 该邮箱已注册";
                    break;
                case 2:
                    tips.value.verify = "* 验证码不存在";
                    break;
                case 3:
                    tips.value.verify = "* 验证码已过期";
                    break;
                case 4:
                    tips.value.verify = "* 验证码不正确";
                    break;
                default:
                    signerStore.switchView("login");
            }
        }
        catch {
            toastStore.error("logon-error", "注册失败");
        }
    }, {
        title: "注册"
    });

    //提交
    function submit() {
        checker.clearTips();
        if (checker.exec()) {
            register();
        }
    }
</script>

<template>
    <coco-input
        type="text"
        placeholder="昵称"
        :warn-tip="tips.nickname"
        v-model="nickname"
        @blur="tips.nickname = ``"
    />
    <coco-input
        type="text"
        placeholder="电子邮箱"
        :warn-tip="tips.email"
        v-model="email"
        @blur="tips.email = ``"
    />
    <div class="sign-verify">
        <coco-input
            type="text"
            placeholder="验证码"
            :warn-tip="tips.verify"
            v-model="verify"
            @blur="tips.verify = ``"
            @input="verifyInput"
        />
        <mb-button :disabled="verifyStage.stage > 0" @click="verifySend">{{
            verifyStage.stage === 1 ? "发送中……" :
            verifyStage.stage === 2 ? `已发送(${verifyStage.delay})` :
            "发送验证码"
        }}</mb-button>
    </div>
    <coco-input
        type="password"
        placeholder="密码"
        :warn-tip="tips.password"
        v-model="password"
        @blur="tips.password = ``"
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