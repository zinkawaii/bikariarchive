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
            <z-footer />
        </main>
        <z-sidebar />
    </div>
    <z-setting />
    <user-sign />
    <mb-image-viewer />
    <mb-confirm />
    <mb-fps />
    <z-loader />
</template>

<style lang="scss">
    .sotomi {
        display: flex;
        justify-content: center;
        gap: 24px;
        min-width: var(--size-width-min-mobile);
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

    .mb-mask {
        z-index: 511;
    }

    .z-setting {
        z-index: 512;
    }

    .user-sign {
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