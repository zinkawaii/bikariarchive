<script setup>
    const emit = defineEmits(["success"]);

    const nickname = ref();
    const email = ref();
    const verify = ref();
    const password = ref();

    const tip = ref({
        nickname: "",
        email: "",
        verify: "",
        password: "",
        clear() {
            this.nickname = "";
            this.email = "";
            this.verify = "";
            this.password = "";
        }
    });
    const verifyStage = ref({
        stage: 0,
        delay: 0
    });

    const checker = {
        nickname: {
            target: nickname,
            reg: /^[\w\u4e00-\u9fa5]*$/,
            message: "昵称不可包含非法字符",
            validate() {
                const count = getByteLength(this.target.value);
                if (count === 0) {
                    return "昵称不能为空";
                }
                else if (count > 24) {
                    return "昵称长度不能超过24个字符";
                }
            }
        },
        email: {
            target: email,
            reg: /^[\w-]+@[\w-]+(.[\w-]+)+$/,
            message: "邮箱格式不正确"
        },
        password: {
            target: password,
            reg: /^[\w]*$/,
            message: "密码仅由大小写字母、数字以及下划线组成",
            validate() {
                const count = getByteLength(this.target.value);
                if (count < 6 || count > 18) {
                    return "密码位数必须在6-18位之间";
                }
            }
        },
        all() {
            for (const key of ["nickname", "email", "password"]) {
                const { target, reg, message } = this[key];
                const msg = !reg.test(target.value) ? message : this[key].validate?.();
                if (msg?.length > 0) {
                    tip.value[key] = `* ${msg}`;
                    return false;
                }
            }
            return true;
        }
    };

    //验证码输入限制
    function verifyInput(event) {
        const value = event.target.value;
        event.target.value = value.replace(/\D+/, "").slice(0, 6);
    }

    //发送验证码
    function verifySend() {
        if (!checker.email()) return;

        verifyStage.value.stage = 1;

        Zjax.get("/api/user/logon/verify", {
            query: {
                email: email.value
            }
        })
        .then((res) => {
            switch (res.error) {
                case 0: {
                    return successed();
                }
            }
        });

        //发送成功
        function successed() {
            const max = 60;
            verifyStage.value.stage = 2;
            verifyStage.value.delay = max + 1;

            Zin.setInterval(() => {
                verifyStage.value.delay--;
            }, {
                duration: 1000,
                times: max + 1
            })
            .then(() => {
                verifyStage.value.stage = 0;
            });
        }
    }

    //提交
    function submit() {
        tip.value.clear();
        if (checker.all()) {
            register();
        }
    }

    //注册
    const register = Zin.debounce(() => {
        Zjax.post("/api/user/logon", {
            body: {
                nickname: nickname.value,
                email: email.value,
                verify: verify.value,
                password: password.value
            }
        })
        .then(async (res) => {
            switch (res.error) {
                case 0:
                    emit("success");
                    break;
                case 1:
                    tip.value.email = "* 该邮箱已注册";
                    break;
                case 2:
                    tip.value.verify = "* 验证码不存在";
                    break;
                case 3:
                    tip.value.verify = "* 验证码已过期";
                    break;
                case 4:
                    tip.value.password = "* 验证码不正确";
                    break;
            }
        });
    });
</script>

<template>
    <coco-input
        type="text"
        placeholder="昵称"
        :warn-tip="tip.nickname"
        v-model="nickname"
        @blur="tip.nickname = ``"
    />
    <coco-input
        type="text"
        placeholder="电子邮箱"
        :warn-tip="tip.email"
        v-model="email"
        @blur="tip.email = ``"
    />
    <div class="sign-verify">
        <coco-input
            type="number"
            placeholder="验证码"
            :warn-tip="tip.verify"
            v-model="verify"
            @blur="tip.verify = ``"
            @input="verifyInput"
        />
        <a :class="[`btn`, { disabled: verifyStage.stage > 0 }]" @click="verifySend">{{
            verifyStage.stage === 1 ? "发送中……" :
            verifyStage.stage === 2 ? `已发送(${verifyStage.delay})` :
            "发送验证码"
        }}</a>
    </div>
    <coco-input
        type="password"
        placeholder="密码"
        :warn-tip="tip.password"
        v-model="password"
        @blur="tip.password = ``"
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