<template>
    <div class="z-background"></div>
</template>

<style lang="scss" scoped>
    .z-background {
        display: grid;
        position: fixed;
        inset: 0;
        height: 100lvh;
        background-position: center;
        background-size: cover;

        @include theme using ($theme) {
            background-image: cdn("/background/#{$theme}.webp");
        }

        @include dark {
            background-image: cdn("/background/dark.webp");
        }

        @include viewport("sm") {
            &::after {
                content: "";
                background-color: var(--color-background-alpha);
            }
        }
    }
</style>
