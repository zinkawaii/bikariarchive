<script lang="ts" setup>
    const route = useRoute();
    const signerStore = useSignerStore();
    const userStore = useUserStore();

    //当前视图
    const currentView = ref();

    //添加遮罩层
    useMask({
        isOpened: () => signerStore.isOpened,
        onClick: () => signerStore.close()
    });

    //根据登录状态切换视图
    watchImmediate(() => userStore.isLogin, (value) => {
        currentView.value = value ? "profile" : "login";
    });

    //路径变更时收起
    watch(() => route.path, () => {
        signerStore.close();
    });
</script>

<template>
    <transition-scale>
        <div v-if="signerStore.isOpened" class="user-sign">
            <div class="sign-innerworld"></div>
            <div class="sign-wrapper">
                <transition name="fade" mode="out-in">
                    <div v-if="currentView === `login`">
                        <div class="sign-header">
                            <h2 class="sign-title">登录</h2>
                            <a class="sign-have" @click="currentView = `logon`">没有账号？立即注册<icon name="fa6-solid:chevron-right"/></a>
                        </div>
                        <user-sign-in />
                    </div>
                    <div v-else-if="currentView === `logon`">
                        <div class="sign-header">
                            <h2 class="sign-title">注册</h2>
                            <a class="sign-have" @click="currentView = `login`">已有账号，前往登录<icon name="fa6-solid:chevron-right"/></a>
                        </div>
                        <user-sign-on @success="currentView = `login`"/>
                    </div>
                    <div v-else-if="currentView === `profile`">
                        <div class="sign-header">
                            <h2 class="sign-title">资料卡</h2>
                            <span class="sign-have">{{ userStore.sign }}</span>
                        </div>
                        <user-sign-profile />
                    </div>
                </transition>
            </div>
            <icon class="xmark" name="fa6-solid:xmark" @click="signerStore.close"/>
        </div>
    </transition-scale>
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

    .fade-enter-active, .fade-leave-active {
        transition: all 0.15s;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }

    .sign-innerworld {
        flex: 0.75;
        box-shadow: var(--box-shadow);
        background-image: url("/garden/outerworld.webp");
        background-position: center 15%;
        background-size: cover;
        mask-image: linear-gradient(to left, transparent, white);

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
        color: var(--color-info-dark-2);

        &:hover {
            color: var(--color-theme-text);
        }
    }

    :deep(.coco-input) {
        margin-top: 22px;
    }

    @media (width < 425px) {
        .user-sign {
            flex-direction: column;
            height: 100dvh;
            border-radius: 0;
        }

        .sign-innerworld {
            mask-image: linear-gradient(to top, transparent, white);
        }
    }
</style>