<script lang="ts" setup>
    const toastStore = useToastStore();
    const userStore = useUserStore();

    const nickname = ref("");
    const password = ref("");

    const warn = ref({
        nickname: false,
        password: false
    });

    const submit = Zin.debounce(async () => {
        try {
            const res = await $fetch("/api/user/login", {
                method: "post",
                body: {
                    account: nickname.value,
                    password: password.value
                }
            });

            switch (res.error) {
                case 0:
                    userStore.$patch({
                        uid: res.uid,
                        nickname: res.nickname,
                        identity: res.identity,
                        sign: res.sign
                    });
                    break;
                case 1:
                    warn.value.nickname = true;
                    break;
                case 2:
                    warn.value.password = true;
                    break;
            }
        }
        catch {
            toastStore.error("[login]", "登录失败");
        }
    }, {
        title: "登录"
    });
</script>

<template>
    <coco-input
        type="text"
        placeholder="昵称／UID／电子邮箱"
        v-model="nickname"
        v-model:error="warn.nickname"
    />
    <coco-input
        type="password"
        placeholder="密码"
        v-model="password"
        v-model:error="warn.password"
        @keyup.enter="submit"
    />
</template>