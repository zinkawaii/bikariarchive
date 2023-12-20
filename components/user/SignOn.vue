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

    //表单检测
    const checker = {
        //昵称
        nickname() {
            const reg = /^[\w\u4e00-\u9fa5]*$/;
            const count = getByteLength(nickname.value);

            let str;
            if (count === 0) {
                str = "* 昵称不能为空";
            }
            else if (count > 24) {
                str = "* 昵称长度不能超过24个字符";
            }
            else if (reg.test(nickname.value) === false) {
                str = "* 昵称不可包含非法字符";
            }
            else return true;

            tip.value.nickname = str;
            return false;
        },
        //邮箱
        email() {
            const reg = /^[\w-]+@[\w-]+(.[\w-]+)+$/;

            let str;
            if (reg.test(email.value) === false) {
                str = "* 邮箱格式不正确";
            }
            else return true;

            tip.value.email = str;
            return false;
        },
        //密码
        password() {
            const reg = /^[\w]*$/;
            const count = password.value?.length;

            let str;
            if (count < 6 || count > 18) {
                str = "* 密码位数必须在6-18位之间";
            }
            else if (reg.test(password.value) === false) {
                str = "* 密码仅由大小写字母、数字以及下划线组成";
            }
            else return true;

            tip.value.password = str;
            return false;
        },
        //全检测
        all() {
            return this.nickname() && this.email() && this.password();
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
    <div class="sign-single">
        <input type="text" class="sign-input" required v-model="nickname" @blur="tip.nickname = ``"/>
        <div class="sign-underline"></div>
        <span class="sign-placeholder" :class="{ warn: tip.nickname }">{{ tip.nickname || "昵称" }}</span>
    </div>
    <div class="sign-single">
        <input type="email" class="sign-input" required v-model="email" @blur="tip.email = ``"/>
        <div class="sign-underline"></div>
        <span class="sign-placeholder" :class="{ warn: tip.email }">{{ tip.email || "电子邮箱" }}</span>
    </div>
    <div class="sign-verify">
        <div class="sign-single">
            <input type="number" class="sign-input" required v-model="verify" @blur="tip.verify = ``" @input="verifyInput"/>
            <div class="sign-underline"></div>
            <span class="sign-placeholder" :class="{ warn: tip.verify }">{{ tip.verify || "验证码" }}</span>
        </div>
        <a :class="[`btn`, { disabled: verifyStage.stage > 0 }]" @click="verifySend">{{
            verifyStage.stage === 1 ? "发送中……" :
            verifyStage.stage === 2 ? `已发送(${verifyStage.delay})` :
            "发送验证码"
        }}</a>
    </div>
    <div class="sign-single">
        <input type="password" class="sign-input" required v-model="password" @blur="tip.password = ``" @keyup.enter="submit"/>
        <div class="sign-underline"></div>
        <span class="sign-placeholder" :class="{ warn: tip.password }">{{ tip.password || "密码" }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .sign-verify {
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: flex-end;
        gap: 1em;
    }
</style>