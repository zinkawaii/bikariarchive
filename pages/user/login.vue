<script setup>
    useHead({
        title: "登录"
    });

    const router = useRouter();
    const userStore = useUserStore();

    const nickname = ref();
    const password = ref();
    const tip = ref({
        nickname: "",
        password: ""
    });

    const submit = Zin.debounce(() => {
        Zjax.post("/api/user/login", {
            body: {
                account: nickname.value,
                password: password.value
            }
        })
        .then((res) => {
            switch (res.error) {
                case 0:
                    userStore.$patch({
                        uid: res.uid,
                        nickname: res.nickname,
                        identity: res.identity,
                        sign: res.sign,
                        isLogin: true
                    });
                    router.push({ name: "space", params: { uid: res.uid } });
                    break;
                case 1:
                    tip.value.nickname = "* 账号不存在";
                    break;
                case 2:
                    tip.value.password = "* 密码错误";
                    break;
            }
        });
    });
</script>

<template>
    <div class="content-group">
        <div class="content-table login-frame">
            <p>登录账号，进入茶馆用茶~</p>
        </div>
        <div class="content-table login-frame">
            <label class="login-line">
                <span>昵称／UID／电子邮箱</span>
                <input autocomplete="username" v-model="nickname" @blur="tip.nickname = ``"/>
                <span class="login-tip">{{ tip.nickname }}</span>
            </label>
            <label class="login-line">
                <span>密码</span>
                <input type="password" maxlength="18" v-model="password" @blur="tip.password = ``" @keyup.enter="submit"/>
                <span class="login-tip">{{ tip.password }}</span>
            </label>
            <div class="login-bottom">
                <nuxt-link class="btn left" :to="{ name: `logon` }">注册</nuxt-link>
                <a class="btn" @click="submit">登录</a>
                <a class="btn">忘记密码</a>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .login-frame {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 360px;
        margin-inline: auto;
        padding: 16px 32px;

        & + & {
            margin-top: 16px;
        }
    }

    .login-line {
        display: flex;
        flex-direction: column;
        gap: 4px;

        input {
            width: 100%;
            height: 32px;
            padding: 0 4px;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            font-size: 16px;

            &:focus {
                border: 1px solid var(--color-theme-block-dark);
                box-shadow: 0 0 4px 0 var(--color-theme-block-dark);
            }
        }
    }

    .login-tip {
        color: var(--color-danger);
    }

    .login-bottom {
        display: flex;
        justify-content: flex-end;

        > .left {
            margin-right: auto;
        }
    }
</style>