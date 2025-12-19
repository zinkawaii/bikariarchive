<script lang="ts" setup>
    const settingStore = useSettingStore();
</script>

<template>
    <z-jumbotron />
    <z-background />
    <z-header />
    <z-toolbar />
    <div
        class="sotomi"
        :class="{
            [`wide-page`]: $route.meta.widePage,
            [`full-page`]: $route.meta.fullPage,
        }"
    >
        <main class="nakami">
            <slot></slot>
            <comment-area v-if="$route.meta.comment" v-show="settingStore.get(`interaction`)"/>
            <z-footer />
        </main>
        <z-sidebar v-show="$route.meta.sidebar ?? true"/>
    </div>
    <bikariya-modals />
    <toast-area />
    <z-fps />
    <z-context-menu />
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

        @include viewport("sm") {
            --sotomi-padding: 0px;
        }
    }

    .wide-page {
        > .nakami {
            max-width: 1308px;
        }

        > .z-sidebar {
            display: none;
        }
    }

    .full-page {
        --sotomi-padding: 0px;

        > .nakami {
            max-width: none;
        }

        .z-footer, > .z-sidebar {
            display: none;
        }
    }

    .nakami {
        --meow-large: 2rem;
        --meow-medium: 1.5rem;

        container: main / inline-size;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 24px;
        max-width: 1028px;
        z-index: 1;

        @include viewport("lg") {
            --meow-large: 1.5rem;

            gap: 16px;
        }

        @include viewport("sm") {
            gap: 0;
        }

        @include viewport("xs") {
            --meow-large: 1rem;
            --meow-medium: 1rem;
        }
    }

    .bikariya-overlay {
        position: fixed;
        opacity: 0.5;
        inset: 0;
        background-color: black;

        &:where(.v-enter-active, .v-leave-active) {
            transition: opacity 0.4s;
            transition-timing-function: cubic-bezier(var(--bezier));
        }

        &.v-enter-active {
            --bezier: 0, 0.43, 0.37, 1;
        }

        &.v-leave-active {
            --bezier: 0.43, 0, 1, 0.87;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }
    }

    .z-background {
        z-index: -1;
    }

    .z-sidebar {
        z-index: 32;
    }

    .z-jumbotron, .z-header, .z-toolbar {
        z-index: 64;
    }

    .toast-area, .z-fps {
        z-index: 768;
    }

    .z-context-menu {
        z-index: 1024;
    }
</style>
