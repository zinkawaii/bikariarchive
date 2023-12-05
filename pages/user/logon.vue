<script setup>
    useHead({
        title: "注册"
    });

    const router = useRouter();

    const nickname = ref();
    const email = ref();
    const verify = ref();
    const password = ref();
    const repeat = ref();
    const tip = ref({
        nickname: "",
        email: "",
        verify: "",
        password: "",
        repeat: "",
        clear() {
            this.nickname = "";
            this.email = "",
            this.verify = "",
            this.password = "",
            this.repeat = "";
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
        //重复密码
        repeat() {
            let str;
            if (repeat.value !== password.value) {
                str = "* 两次密码不一致";
            }
            else return true;

            tip.value.repeat = str;
            return false;
        },
        //全检测
        all() {
            return this.nickname() && this.email() && this.password() && this.repeat();
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
                    router.push({ name: "login" });
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
    <div class="content-group">
        <div class="content-table login-frame">
            <p>注册账号，成为茶馆的常客~</p>
        </div>
        <div class="content-table login-frame">
            <label class="login-line">
                <span>昵称</span>
                <input autocomplete="username" v-model="nickname" @blur="tip.nickname = ``"/>
                <span class="login-tip">{{ tip.nickname }}</span>
            </label>
            <label class="login-line">
                <span>电子邮箱地址</span>
                <input autocomplete="email" v-model="email" @blur="tip.email = ``"/>
                <span class="login-tip">{{ tip.email }}</span>
            </label>
            <label class="login-line">
                <span>验证码</span>
                <div class="logon-verify">
                    <input type="text" maxlength="6" v-model="verify" @input="verifyInput" @blur="tip.verify = ``"/>
                    <div class="btn" :disabled="verifyStage.stage > 0 || null" @click="verifySend">{{
                        verifyStage.stage === 1 ? "发送中……" :
                        verifyStage.stage === 2 ? `已发送(${verifyStage.delay})` :
                        "发送验证码"
                    }}</div>
                </div>
                <span class="login-tip">{{ tip.verify }}</span>
            </label>
            <label class="login-line">
                <span>密码</span>
                <input type="password" maxlength="18" v-model="password" @blur="tip.password = ``"/>
                <span class="login-tip">{{ tip.password }}</span>
            </label>
            <label class="login-line">
                <span>重复密码</span>
                <input type="password" maxlength="18" v-model="repeat" @blur="tip.repeat = ``"/>
                <span class="login-tip">{{ tip.repeat }}</span>
            </label>
            <div class="login-bottom">
                <nuxt-link class="btn left" :to="{ name: `login` }">登录</nuxt-link>
                <div class="btn" @click="submit">注册</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .logon-verify {
        display: flex;
        gap: 16px;

        input {
            flex: 1;
        }
    }
</style>