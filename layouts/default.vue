<template>
    <ZBackground />
    <ZHeader />
    <ZNavBar />
    <ZToolBar />
    <ZSetting />
    <div class="nakami">
        <main class="main-content">
            <slot></slot>
            <ZFooter />
        </main>
        <ZSideBar />
    </div>
    <ZLoader />
</template>

<style lang="scss">
    .nakami {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 32px;
        padding: 0 32px;
    }

    .main-content {
        container: main / inline-size;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 32px;
        max-width: 1028px;
        margin: 32px 0;
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

    .z-mask {
        z-index: 1024;
    }

    .z-loader {
        z-index: 2048;
    }

    @media (width < 1024px) {
        .nakami {
            flex-direction: column-reverse;
            gap: 0;
            padding: 0;
        }

        .main-content {
            width: 100vw;
            min-width: var(--size-width-min-mobile);
            margin: 8px 0;
            padding: 0 8px;
        }
    }
</style>