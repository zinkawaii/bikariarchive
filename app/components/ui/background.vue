<script lang="ts" setup>
    const lightUrl = useBackgroundImage(`/garden/background/bg_${
        Zin.period === Zin.PERIOD_DAY ? "day" : "night"
    }.webp`);
    const darkUrl = useBackgroundImage("/garden/background/bg_dark.webp");
</script>

<template>
    <div class="z-background"></div>
</template>

<style lang="scss" scoped>
    .z-background {
        position: fixed;
        inset: 0;
        height: 100lvh;
        background-image: v-bind("lightUrl");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        [z-dark] & {
            background-image: v-bind("darkUrl");
        }
    }
</style>