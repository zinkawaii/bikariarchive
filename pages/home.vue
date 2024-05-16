<script setup>
    useHead({
        title: "主页"
    });
</script>

<template>
    <client-only>
        <teleport to=".jumbotron-wrapper">
            <home-jumbotron />
        </teleport>
    </client-only>
    <coco-widget class="home-brief">
        <home-welcome />
        <home-introduction />
        <home-profile />
    </coco-widget>
    <div class="home-complex">
        <home-update />
        <home-calendar />
        <home-blank />
    </div>
    <home-tool-container />
</template>

<style lang="scss" scoped>
    .home-brief {
        display: grid;
        grid-template:
            "A A"
            "B C" / 1fr 40%;
        gap: var(--cw-medium);
    }

    .home-complex {
        display: grid;
        grid-gap: 16px;
        grid-template:
            "A B" auto
            "A C" 1fr / auto 1fr;
    }

    @container main (width < 768px) {
        .home-brief {
            grid-template: "A" "B" "C";
        }
    }

    @container main (width < 596px) {
        .home-complex {
            grid-template: "A" "B" "C";
        }
    }
</style>