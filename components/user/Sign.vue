<script setup>
    const route = useRoute();
    const router = useRouter();
    const signerStore = useSignerStore();
    const userStore = useUserStore();

    //当前视图
    const currentView = ref();

    //根据登录状态切换视图
    watch(() => userStore.isLogin, (value) => {
        currentView.value = value ? "profile" : "login";
    }, {
        immediate: true
    });

    //路径变更时收起
    watch(() => route.path, () => {
        signerStore.close();
    });

    //空间链接
    const toSpace = computed(() => ({
        name: "space",
        params: {
            uid: userStore.uid ?? -1
        }
    }));

    //退出登录
    function logout() {
        Zjax.post("/api/user/logout").then(() => {
            userStore.reset();
            if (route.meta.identity > 0) {
                router.push({ name: "home" });
            }
        });
    }
</script>

<template>
    <transition name="scale">
        <div v-if="signerStore.isOpened" class="user-sign">
            <div class="sign-innerworld"></div>
            <div class="sign-wrapper">
                <transition name="fade" mode="out-in">
                    <div v-if="currentView === `login`">
                        <div class="sign-header">
                            <h2 class="sign-title">登录</h2>
                            <a class="sign-have" @click="currentView = `logon`">没有账号？立即注册<i class="fas fa-chevron-right"></i></a>
                        </div>
                        <user-sign-in />
                    </div>
                    <div v-else-if="currentView === `logon`">
                        <div class="sign-header">
                            <h2 class="sign-title">注册</h2>
                            <a class="sign-have" @click="currentView = `login`">已有账号，前往登录<i class="fas fa-chevron-right"></i></a>
                        </div>
                        <user-sign-on @success="currentView.value = `login`"/>
                    </div>
                    <div v-else-if="currentView === `profile`">
                        <div class="sign-header">
                            <h2 class="sign-title">资料卡</h2>
                            <span class="sign-have">{{ userStore.sign }}</span>
                        </div>
                        <div class="user-profile">
                            <div>
                                <span class="user-nickname">{{ userStore.nickname }}</span>
                                <div class="user-tool">
                                    <a class="btn" @click="logout">退出登录</a>
                                </div>
                            </div>
                            <nuxt-link :to="toSpace"><nuxt-img class="user-icon" src="/garden/icon/default.png"/></nuxt-link>
                        </div>
                    </div>
                </transition>
            </div>
            <i class="fas fa-xmark xmark" @click="signerStore.close"></i>
        </div>
    </transition>
    <mb-mask :when="signerStore.isOpened" @click="signerStore.close"/>
</template>

<style lang="scss" scoped>
    .user-sign {
        display: flex;
        position: fixed;
        overflow: hidden;
        inset: 0;
        width: min(640px, 100vw);
        height: 372px;
        margin: auto;
        border-radius: 16px;
        background-color: var(--color-background-alpha);
        backdrop-filter: blur(4px);
        font-size: 14px;
    }

    .scale-enter-active, .scale-leave-active {
        transition: all 0.4s;
    }

    .scale-enter-from, .scale-leave-to {
        opacity: 0;
        scale: 0.5;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all 0.15s;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }

    .sign-innerworld {
        flex: 0.75;
        box-shadow: var(--box-shadow);
        mask-image: linear-gradient(to left, transparent, white);
        background-image: url("/garden/outerworld.webp");
        background-position: center 15%;
        background-size: cover;

        [z-dark] & {
            background-image: url("/garden/innerworld.webp");
        }
    }

    .sign-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 288px;
        padding: 32px;
    }

    .sign-header {
        display: grid;
        justify-items: flex-end;
        padding-bottom: 8px;
    }

    .sign-title {
        position: relative;
        margin-bottom: 12px;
        font-family: "腾祥沁圆简";
        font-size: 28px;

        &::after {
            content: "";
            position: absolute;
            right: 0;
            bottom: -6px;
            width: calc(100% + 6px);
            height: 3px;
            border-radius: 3px;
            background-color: var(--color-theme-dark);
        }
    }

    .sign-have {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 12px;
        line-height: 1.5em;
        text-align: right;
        color: var(--color-gray-dark);

        &:hover {
            color: var(--color-theme-text);
        }
    }

    .user-profile {
        display: flex;
        gap: 1em;
        margin-top: 1em;

        > div {
            display: grid;
            flex: 1;
            place-items: center flex-end;
        }
    }

    .user-nickname {
        font-size: 18px;
        font-weight: bold;
    }

    .user-icon {
        width: 72px;
        border-radius: 100%;
        box-shadow: var(--box-shadow);
    }

    @media (width < 425px) {
        .user-sign {
            flex-direction: column;
            height: 100%;
            border-radius: 0;
        }

        .sign-innerworld {
            mask-image: linear-gradient(to top, transparent, white);
        }
    }
</style>

<style lang="scss">
    .sign-single {
        display: grid;
        position: relative;
        margin-top: 22px;
        line-height: 20px;
    }

    .sign-input {
        padding: 4px;
        background-color: transparent;

        &:where(:focus) {
            ~ .sign-underline::before {
                width: 100%;
            }

            ~ .sign-placeholder {
                color: var(--color-theme-text);
            }
        }

        &:where(:focus, :valid) {
            ~ .sign-placeholder {
                top: -1em;
                font-size: 12px;
                line-height: 1em;
            }
        }
    }

    .sign-underline {
        height: 1px;
        background-color: var(--color-border-light);

        &::before {
            content: "";
            display: block;
            width: 0;
            height: 1px;
            background-color: var(--color-theme-dark);
            transition: all 0.4s;
        }
    }

    .sign-placeholder {
        position: absolute;
        top: 4px;
        left: 4px;
        color: var(--color-gray);
        transition: all 0.25s;
        pointer-events: none;

        &.warn {
            color: var(--color-danger);
        }
    }
</style>