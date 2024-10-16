<script lang="ts" setup>
    const toastStore = useToastStore();
    const userStore = useUserStore();

    const nickname = ref("");
    const password = ref("");

    const { errors, glitch, validate } = useValidate({
        nickname: {
            target: nickname,
            required: true,
            ...nicknameValidates
        },
        password: {
            target: password,
            required: true,
            ...passwordValidates
        }
    });

    const { status, execute, data: res } = useLazyFetch("/api/user/login", {
        method: "post",
        body: {
            account: nickname,
            password
        },
        watch: false,
        immediate: false
    });

    const submit = Zin.debounce(async () => {
        if (!validate()) {
            return;
        }

        const key = "[login]";
        await execute();

        if (status.value !== "success") {
            toastStore.error(key, "登录失败");
            return;
        }

        const { error, uid, nickname, identity, sign } = res.value;
        switch (error) {
            case 1: {
                glitch("nickname", "账号不存在");
                return;
            }
            case 2: {
                glitch("password", "密码错误");
                return;
            }
            default: {
                userStore.$patch({
                    uid,
                    nickname,
                    identity,
                    sign
                });
            }
        }
    }, {
        title: "登录"
    });
</script>

<template>
    <meow-input
        type="text"
        placeholder="昵称／UID／电子邮箱"
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
</template>