<script setup>
    const image = `url(/garden/background/bg_${
        Zin.period === Zin.PERIOD_DAY ? "day" : "night"
    }.webp)`;
</script>

<template>
    <div class="z-background"></div>
</template>

<style lang="scss" scoped>
    .z-background {
        position: fixed;
        inset: 0;
        width: 100vw;
        background-image: v-bind("image");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        [z-dark] & {
            background-image: url("/garden/background/bg_dark.webp");
        }
    }
</style>