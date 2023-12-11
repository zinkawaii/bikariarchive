<script setup>
    const router = useRouter();
    const signerStore = useSignerStore();
    const userStore = useUserStore();

    const nickname = ref();
    const password = ref();

    const warn = ref({
        nickname: false,
        password: false
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
                    break;
                case 1:
                    warn.value.nickname = true;
                    break;
                case 2:
                    warn.value.password = true;
                    break;
            }
        });
    });
</script>

<template>
    <div class="sign-single">
        <input type="text" class="sign-input" required v-model="nickname" @blur="warn.nickname = false"/>
        <div class="sign-underline"></div>
        <span class="sign-placeholder" :class="{ warn: warn.nickname }">昵称／UID／电子邮箱</span>
    </div>
    <div class="sign-single">
        <input type="password" class="sign-input" required v-model="password" @blur="warn.password = false" @keyup.enter="submit"/>
        <div class="sign-underline"></div>
        <span class="sign-placeholder" :class="{ warn: warn.password }">密码</span>
    </div>
</template>