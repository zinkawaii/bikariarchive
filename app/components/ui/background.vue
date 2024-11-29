<script lang="ts" setup>
    const settingStore = useSettingStore();

    const lightUrl = ref("");
    const darkUrl = Zin.background("/garden/background/bg_dark.webp");

    settingStore.listen("theme", () => {
        lightUrl.value = Zin.background(`/garden/background/bg_${settingStore.themeName}.webp`);
    });
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