<script lang="ts" setup>
    const settingStore = useSettingStore();

    const lightUrl = ref("");
    const darkUrl = Zin.image("/garden/background/dark.webp", { wrap: true });

    settingStore.listen("theme", (name) => {
        lightUrl.value = Zin.image(`/garden/background/${name}.webp`, { wrap: true });
    });
</script>

<template>
    <div class="z-background"></div>
</template>

<style lang="scss" scoped>
    .z-background {
        display: grid;
        position: fixed;
        inset: 0;
        height: 100lvh;
        background-image: v-bind("lightUrl");
        background-position: center;
        background-size: cover;

        @include dark {
            background-image: v-bind("darkUrl");
        }

        @include viewport("sm") {
            &::after {
                content: "";
                background-color: var(--color-background-alpha);
            }
        }
    }
</style>
