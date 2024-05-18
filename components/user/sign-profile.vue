<script lang="ts" setup>
    const route = useRoute();
    const router = useRouter();
    const toastStore = useToastStore();
    const userStore = useUserStore();

    //空间链接
    const toSpace = computed(() => ({
        name: "space",
        params: {
            uid: userStore.uid ?? -1
        }
    }));

    //退出登录
    async function logout() {
        try {
            await $fetch("/api/user/logout", {
                method: "post"
            });

            userStore.reset();
            if (route.meta.identity > 0) {
                router.push({ name: "home" });
            }
        }
        catch {
            toastStore.error("logout-error", "退出登录失败");
        }
    }
</script>

<template>
    <div class="sign-profile">
        <span class="sign-nickname">{{ userStore.nickname }}</span>
        <div class="sign-operator">
            <mb-button @click="logout">退出登录</mb-button>
        </div>
        <nuxt-link class="sign-avatar" :to="toSpace"><nuxt-img src="/garden/icon/default.png" alt="[avatar]"/></nuxt-link>
    </div>
</template>

<style lang="scss" scoped>
    .sign-profile {
        display: grid;
        grid-template:
            "A C"
            "B C" / 1fr auto;
        place-items: center flex-end;
        column-gap: 1em;
        margin-top: 1em;
    }

    .sign-nickname {
        font-size: 18px;
        font-weight: bold;
    }

    .sign-avatar {
        grid-area: C;
        overflow: hidden;
        width: 72px;
        aspect-ratio: 1;
        border-radius: 100%;
        box-shadow: var(--box-shadow);
    }
</style>