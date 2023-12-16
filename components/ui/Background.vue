<script setup>
    const settingStore = useSettingStore();
    const bgName = ref();

    settingStore.listen("dark-mode", (value) => {
        const isDay = Zin.period === Zin.PERIOD_DAY;
        bgName.value = {
            0: isDay ? "day" : "dark",
            1: isDay ? "day" : "night",
            2: "dark"
        }[value ?? 0];
    }, {
        viewTransition: true
    });
</script>

<template>
    <div class="z-background" :style="{ backgroundImage: `url(/garden/background/bg_${bgName}.webp)` }"></div>
</template>

<style lang="scss" scoped>
    .z-background {
        position: fixed;
        inset: 0;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }
</style>