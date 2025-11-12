<script lang="ts" setup>
    const signerStore = useSignerStore();
    const toastStore = useToastStore();
    const userStore = useUserStore();

    const nickname = ref("");
    const password = ref("");

    const { errors, glitch, validate } = useValidate({
        nickname: {
            target: nickname,
            required: true,
            ...nicknameValidates,
        },
        password: {
            target: password,
            required: true,
            ...passwordValidates,
        },
    });

    const { execute, data, error } = useLazyFetch("/api/user/login", {
        method: "post",
        body: {
            account: nickname,
            password,
        },
        watch: false,
        immediate: false,
    });

    const submit = Zin.debounce(async () => {
        if (!validate()) {
            return;
        }
        await execute();

        if (error.value) {
            switch (error.value.data?.message) {
                case "1": return glitch("nickname", "账号不存在");
                case "2": return glitch("password", "密码错误");
            }
            toastStore.error("[login]", "登录失败");
            return;
        }

        userStore.$patch(data.value!);
    }, {
        title: "登录",
    });
</script>

<template>
    <signer-view title="登录">
        <template #subtitle>
            <button @click="signerStore.switchView(`logon`)">
                没有账号？立即注册<iconify name="fa7-solid:chevron-right"/>
            </button>
        </template>
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
    </signer-view>
</template>
