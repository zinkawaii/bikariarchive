<script lang="ts" setup>
    const route = useRoute();
    const signerStore = useSignerStore();
    const userStore = useUserStore();

    //根据登录状态切换视图
    watchImmediate(() => userStore.isLogin, (value) => {
        signerStore.currentView = value ? "profile" : "login";
    });

    //路径变更时收起
    watch(() => route.path, () => {
        signerStore.close();
    });
</script>

<template>
    <mb-dialog class="z-signer" @close="signerStore.close()">
        <div class="signer-innerworld"></div>
        <div class="signer-wrapper">
            <transition mode="out-in">
                <div v-if="signerStore.currentView === `login`">
                    <div class="signer-header">
                        <h2 class="signer-title">登录</h2>
                        <a class="signer-have" @click="signerStore.switchView(`logon`)">没有账号？立即注册<icon name="fa6-solid:chevron-right"/></a>
                    </div>
                    <signer-in />
                </div>
                <div v-else-if="signerStore.currentView === `logon`">
                    <div class="signer-header">
                        <h2 class="signer-title">注册</h2>
                        <a class="signer-have" @click="signerStore.switchView(`login`)">已有账号，前往登录<icon name="fa6-solid:chevron-right"/></a>
                    </div>
                    <signer-on />
                </div>
                <div v-else-if="signerStore.currentView === `profile`">
                    <div class="signer-header">
                        <h2 class="signer-title">资料卡</h2>
                        <span class="signer-have">{{ userStore.sign }}</span>
                    </div>
                    <signer-profile />
                </div>
            </transition>
        </div>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .z-signer {
        display: flex;
        width: 640px;
        padding: 0;
        background-color: var(--color-background-alpha);
        backdrop-filter: blur(4px);
        font-size: 14px;

        @include viewport("xs") {
            flex-direction: column;
        }
    }

    .signer-innerworld {
        flex: 0.75;
        height: 372px;
        box-shadow: var(--box-shadow);
        background-image: url("/garden/outerworld.webp");
        background-position: center 15%;
        background-size: cover;
        mask-image: linear-gradient(to var(--direction, right), white, transparent);

        [z-dark] & {
            background-image: url("/garden/innerworld.webp");
        }

        @include viewport(">xs") {
            border-radius: 16px;
        }

        @include viewport("xs") {
            --direction: bottom;
        }
    }

    .signer-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 288px;
        padding: 32px;

        > :where(.v-enter-active, .v-leave-active) {
            transition: all 0.15s;
        }

        > :where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }

    .signer-header {
        display: grid;
        justify-items: flex-end;
        padding-bottom: 8px;
    }

    .signer-title {
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

    .signer-have {
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
</style>