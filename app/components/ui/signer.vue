<script lang="ts" setup>
    const signerStore = useSignerStore();
    const userStore = useUserStore();
    const route = useRoute();

    //根据登录状态切换视图
    watchImmediate(() => userStore.isLoggedIn, (value) => {
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
        <transition mode="out-in">
            <signer-in v-if="signerStore.currentView === `login`"/>
            <signer-on v-else-if="signerStore.currentView === `logon`"/>
            <signer-profile v-else-if="signerStore.currentView === `profile`"/>
        </transition>
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
        background-image: url("/api/image/outerworld.webp");
        background-position: center 15%;
        background-size: cover;
        mask-image: linear-gradient(to var(--direction, right), white, transparent);

        @include dark {
            background-image: url("/api/image/innerworld.webp");
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

    :deep(.meow-input) {
        margin-top: 22px;
    }
</style>
