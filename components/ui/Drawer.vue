<script setup>
    const drawerStore = useDrawerStore();
    const userStore = useUserStore();
    const route = useRoute();

    //路径变更时收起
    watch(() => route.path, () => {
        drawerStore.close();
    });

    const toSpace = computed(() => ({
        name: "space",
        params: {
            uid: userStore.uid || "1"
        }
    }));
</script>

<template>
    <div class="z-drawer" :class="{ show: drawerStore.state }">
        <div class="user-frame">
            <div v-if="userStore.isLogin" class="is-login">
                <nuxt-img class="user-icon" src="/garden/icon/default.png"/>
                <div class="right">
                    <span><nuxt-link class="user-nickname" :to="toSpace">{{ userStore.nickname }}</nuxt-link>，欢迎回来！</span>
                    <div class="user-tool">
                        <nuxt-link class="btn" :to="toSpace">个人空间</nuxt-link>
                        <a class="btn" id="Logout">退出登录</a>
                    </div>
                </div>
            </div>
            <div v-else class="no-login">
                <nuxt-link class="btn" :to="{ name: `login` }">登录</nuxt-link>
                <nuxt-link class="btn" :to="{ name: `logon` }">注册</nuxt-link>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .z-drawer {
        $width: 320px;

        display: block;
        position: fixed;
        top: 0;
        left: calc(0px - $width);
        width: $width;
        height: 100%;
        box-shadow: 0 0 8px rgb(0 0 0 / 33%);
        background-color: var(--color-background);
        font-size: 14px;
        transition: transform 0.4s;

        &.show {
            transform: translateX(100%);
        }
    }

    .user-frame {
        padding: 16px;
        border-bottom: 1px solid var(--color-border-light);
    }

    .no-login {
        display: flex;
        justify-content: space-between;
        gap: 16px;

        > a {
            flex: 1;
        }
    }

    .is-login {
        display: flex;
        gap: 16px;

        > .right {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
        }
    }

    .user-icon {
        display: block;
        width: 72px;
        border-radius: 100%;
        box-shadow: var(--box-shadow);
    }

    .user-nickname {
        color: var(--color-theme-text);
    }

    .user-tool {
        text-align: right;
    }

    @media (width < 425px) {
        :host {
            --width: 100%;
        }
    }
</style>