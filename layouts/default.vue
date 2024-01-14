<template>
    <div class="jumbotron-wrapper"></div>
    <client-only>
        <z-background />
    </client-only>
    <z-header />
    <z-navbar />
    <z-toolbar />
    <div class="sotomi">
        <main class="nakami">
            <slot></slot>
            <z-comment v-if="$route.meta.comment"/>
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
    }

    .nakami {
        container: main / inline-size;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 24px;
        max-width: 1028px;
    }

    .z-background {
        z-index: -1;
    }

    .z-jumbotron {
        z-index: 64;
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
        z-index: 768;
    }

    .z-context-menu {
        z-index: 1024;
    }

    .z-loader {
        z-index: 2048;
    }

    @media (width < 1024px) {
        .sotomi {
            flex-direction: column;
            padding: 16px 8px;
        }

        .nakami {
            gap: 16px;
        }
    }
</style>