<script lang="ts" setup>
    const signerStore = useSignerStore();
    const userStore = useUserStore();
    const route = useRoute();

    const outerworld = Zin.image("/garden/outerworld.webp", { wrap: true });
    const innerworld = Zin.image("/garden/innerworld.webp", { wrap: true });

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
                        <button class="signer-have" @click="signerStore.switchView(`logon`)">
                            没有账号？立即注册<iconify name="fa6-solid:chevron-right"/>
                        </button>
                    </div>
                    <signer-in />
                </div>
                <div v-else-if="signerStore.currentView === `logon`">
                    <div class="signer-header">
                        <h2 class="signer-title">注册</h2>
                        <button class="signer-have" @click="signerStore.switchView(`login`)">
                            已有账号，前往登录<iconify name="fa6-solid:chevron-right"/>
                        </button>
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
        --dialog-padding: 0;

        width: 640px;
        background-color: var(--color-background-alpha);
        backdrop-filter: blur(4px);
        font-size: 14px;

        @include viewport("xs") {
            height: 100dvh;
            border-radius: 0;
        }
    }

    .signer-innerworld {
        box-shadow: var(--box-shadow);
        background-image: v-bind(outerworld);
        background-position: center 15%;
        background-size: cover;
        mask-image: linear-gradient(to var(--direction, right), white, transparent);

        @include dark {
            background-image: v-bind(innerworld);
        }

        @include viewport(">xs") {
            width: 75%;
            height: 372px;
        }

        @include viewport("xs") {
            --direction: bottom;

            height: 75%;
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
        margin-bottom: 16px;
        font-size: 28px;

        &::after {
            content: "";
            position: absolute;
            right: 0;
            bottom: -8px;
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
        color: var(--color-gray-50);

        &:hover {
            color: var(--color-theme-text);
        }
    }

    :deep(.meow-input) {
        margin-top: 22px;
    }
</style>
