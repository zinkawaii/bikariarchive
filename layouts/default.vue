<template>
    <ZBackground />
    <ZHeader />
    <ZNavBar />
    <ZToolBar />
    <ZSetting />
    <div class="nakami">
        <ZSideBar />
        <main class="main-content">
            <slot></slot>
            <ZFooter />
        </main>
    </div>
    <ZLoader />
</template>

<style lang="scss">
    .nakami {
        display: flex;
        flex-direction: row-reverse;
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

    .mb-background {
        z-index: -1;
    }

    .mb-jumbotron {
        z-index: 64;
    }

    .mb-header {
        z-index: 64;
    }

    .mb-navbar {
        z-index: 128;
    }

    .mb-maestrale {
        z-index: 128;
    }

    .mb-toolbar {
        z-index: 128;
    }

    .mb-drawer {
        z-index: 128;
    }

    .mb-setting {
        z-index: 512;
    }

    .mb-mask {
        z-index: 1024;
    }

    .mb-loader {
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