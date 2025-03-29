<script lang="ts" setup>
    const settingStore = useSettingStore();
</script>

<template>
    <z-jumbotron />
    <z-background />
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
    >
        <main class="nakami">
            <slot></slot>
            <comment-area v-if="$route.meta.comment" v-show="settingStore.get(`interaction`)"/>
            <z-footer />
        </main>
        <z-sidebar v-show="$route.meta.sidebar ?? true"/>
    </div>
    <z-overlay />
    <z-dialog />
    <toast-area />
    <z-fps />
    <z-context-menu />
    <z-loader />
</template>

<style lang="scss">
    .sotomi {
        --sotomi-padding: 32px;

        display: flex;
        justify-content: center;
        gap: 24px;
        min-width: var(--size-min-width);
        min-height: calc(100svh - 64px);
        padding: var(--sotomi-padding);

        @include viewport("lg") {
            --sotomi-padding: 12px;

            flex-direction: column;
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
        --sotomi-padding: 0;

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

    .toast-area {
        z-index: 768;
    }

    .z-fps {
        z-index: 768;
    }

    .z-context-menu {
        z-index: 1024;
    }

    .z-loader {
        z-index: 2048;
    }
</style>