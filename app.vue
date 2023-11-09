<script setup>
    useHead({
        titleTemplate: (title) => {
            return title ? `${title} - 微光茶馆` : "微光茶馆";
        }
    });

    const settingStore = useSettingStore();

    //夜间模式
    settingStore.listen("dark-mode", (value) => {
        const mode = {
            1: false,
            2: true
        }[value] ?? (Zin.period === Zin.PERIOD_NIGHT);
        process.browser && document.documentElement.toggleAttribute("z-dark", mode);
    }, {
        viewTransition: true
    });

    //主题颜色
    settingStore.listen("theme", (value) => {
        const theme = {
            /* 初空 */ 0: "hatsusora",
            /* 抹茶 */ 1: "ayame"
        }[value] ||
            /* 早樱 */ "sakura";
        process.browser && document.documentElement.setAttribute("theme", theme)
    }, {
        viewTransition: true
    });
</script>

<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>