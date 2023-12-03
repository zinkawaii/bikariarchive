<template>
    <div class="jumbotron-wrapper"></div>
    <z-background />
    <z-header />
    <z-navbar />
    <z-toolbar />
    <z-drawer />
    <div class="sotomi">
        <main class="nakami">
            <slot></slot>
            <z-footer />
        </main>
        <z-sidebar />
    </div>
    <z-setting />
    <mb-image-viewer />
    <mb-confirm />
    <z-loader />
</template>

<style lang="scss">
    .sotomi {
        display: flex;
        justify-content: center;
        gap: 32px;
        min-width: var(--size-width-min-mobile);
        padding: 32px;
    }

    .nakami {
        container: main / inline-size;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 32px;
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

    .z-maestrale {
        z-index: 128;
    }

    .z-toolbar {
        z-index: 128;
    }

    .z-drawer {
        z-index: 128;
    }

    .z-setting {
        z-index: 512;
    }

    .mb-image-viewer {
        z-index: 512;
    }

    .mb-confirm {
        z-index: 512;
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