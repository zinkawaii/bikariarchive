<script lang="ts" setup>
    const config = useRuntimeConfig();

    useHead({
        title: "主页",
        link: [
            { rel: "canonical", href: `https://${config.public.domain}` }
        ]
    });
</script>

<template>
    <client-only>
        <teleport to=".jumbotron-wrapper">
            <home-jumbotron />
        </teleport>
    </client-only>
    <meow-widget class="home-brief">
        <home-welcome />
        <home-introduction />
        <home-profile />
    </meow-widget>
    <div class="home-complex">
        <home-update />
        <home-calendar />
        <home-blank />
    </div>
    <home-tabular />
</template>

<style lang="scss" scoped>
    .home-brief {
        display: grid;
        grid-template:
            "A A"
            "B C" / 1fr 40%;
        gap: var(--meow-medium);

        @include viewport("md") {
            grid-template: "A" "B" "C";
        }
    }

    .home-complex {
        display: grid;
        grid-gap: 16px;
        grid-template:
            "A B" auto
            "A C" 1fr / auto 1fr;

        @include viewport("sm") {
            grid-template: "A" "B" "C";
        }
    }
</style>