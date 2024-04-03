<script setup>
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
    }, {
        title: "登录"
    });
</script>

<template>
    <coco-input
        type="text"
        placeholder="昵称／UID／电子邮箱"
        :warn="warn.nickname"
        v-model="nickname"
        @blur="warn.nickname = false"
    />
    <coco-input
        type="password"
        placeholder="密码"
        :warn="warn.password"
        v-model="password"
        @blur="warn.password = false"
        @keyup.enter="submit"
    />
</template>