<script lang="ts" setup>
    const config = useRuntimeConfig();
    const settingStore = useSettingStore();

    useHead({
        link: [
            { rel: "icon", href: "/garden/favicon.ico" },
            { rel: "alternate", type: "application/atom+xml", title: config.public.title, href: "/feed" }
        ],
        titleTemplate: "%s %separator %siteName",
        templateParams: {
            separator: "-"
        }
    });

    //夜间模式
    settingStore.listen("dark-mode", () => {
        document.documentElement.toggleAttribute("z-dark", settingStore.isDarkMode);
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
        document.documentElement.setAttribute("theme", theme);
    }, {
        viewTransition: true
    });

    onMounted(() => {
        //移动端
        if (window.innerWidth < Zin.WINDOW_SIZE_MAX) {
            settingStore.set("ui-collapse", true);
        }
    });
</script>

<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>