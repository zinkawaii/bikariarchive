<script setup>
    const settingStore = useSettingStore();
    const type = ref();

    settingStore.listen("dark-mode", () => {
        type.value = settingStore.isDarkMode ?
            "dark" : Zin.period === Zin.PERIOD_DAY ?
            "day" :
            "night";
    }, {
        viewTransition: true
    });
</script>

<template>
    <div class="z-background" :style="{ backgroundImage: `url(/garden/background/bg_${type}.webp)` }"></div>
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