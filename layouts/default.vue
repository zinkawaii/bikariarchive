<template>
    <div class="jumbotron-wrapper"></div>
    <client-only>
        <z-background />
    </client-only>
    <z-header />
    <z-navbar />
    <z-toolbar />
    <z-maestrale />
    <div
        class="sotomi"
        :class="{
            [`wide-page`]: $route.meta.widePage,
            [`full-page`]: $route.meta.fullPage
        }"
        ><main class="nakami">
            <slot></slot>
            <comment-area v-if="$route.meta.comment"/>
            <z-footer />
        </main>
        <z-sidebar />
    </div>
    <z-mask />
    <z-setting />
    <user-sign />
    <comment-panel />
    <mb-image-viewer />
    <mb-confirm />
    <mb-fps />
    <toast-area />
    <z-context-menu />
    <z-loader />
</template>

<style lang="scss">
    .sotomi {
        display: flex;
        justify-content: center;
        gap: 24px;
        min-width: var(--size-min-width);
        padding: 32px;

        @include viewport("lg") {
            flex-direction: column;
            padding: 12px;
        }
    }

    .wide-page {
        .nakami {
            max-width: 1308px;
        }

        .z-sidebar {
            display: none;
        }
    }

    .full-page {
        padding: 0;

        .nakami {
            max-width: none;
        }

        .z-footer, .z-sidebar {
            display: none;
        }
    }

    .nakami {
        container: main / inline-size;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 24px;
        max-width: 1028px;
        z-index: 1;

        @include viewport("lg") {
            gap: 16px;
        }
    }

    .z-background {
        z-index: -1;
    }

    .z-header {
        z-index: 64;
    }

    .z-navbar {
        z-index: 128;
    }

    .z-toolbar {
        z-index: 256;
    }

    .z-maestrale {
        z-index: 256;
    }

    .z-mask {
        z-index: 511;
    }

    .z-setting {
        z-index: 512;
    }

    .user-sign {
        z-index: 512;
    }

    .comment-panel {
        z-index: 512;
    }

    .mb-image-viewer {
        z-index: 512;
    }

    .mb-confirm {
        z-index: 512;
    }

    .mb-fps {
        z-index: 512;
    }

    .toast-area {
        z-index: 768;
    }

    .z-context-menu {
        z-index: 1024;
    }

    .z-loader {
        z-index: 2048;
    }
</style>