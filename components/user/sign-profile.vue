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
        <div>
            <span class="sign-nickname">{{ userStore.nickname }}</span>
            <div class="sign-tool">
                <mb-button @click="logout">退出登录</mb-button>
            </div>
        </div>
        <nuxt-link :to="toSpace"><nuxt-img class="sign-avatar" src="/garden/icon/default.png" alt="[avatar]"/></nuxt-link>
    </div>
</template>

<style lang="scss" scoped>
    .sign-profile {
        display: flex;
        gap: 1em;
        margin-top: 1em;

        > div {
            display: grid;
            flex: 1;
            place-items: center flex-end;
        }
    }

    .sign-nickname {
        font-size: 18px;
        font-weight: bold;
    }

    .sign-avatar {
        width: 72px;
        aspect-ratio: 1;
        border-radius: 100%;
        box-shadow: var(--box-shadow);
    }
</style>