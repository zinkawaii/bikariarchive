<script lang="ts" setup>
    const settingStore = useSettingStore();
    const config = useRuntimeConfig();
    const image = useImage();

    useHead({
        link: [
            { rel: "icon", href: "/garden/favicon.ico" },
            { rel: "apple-touch-icon", href: image(config.public.avatar, { width: 180 }) },
            { rel: "alternate", type: "application/atom+xml", title: config.public.title, href: "/feed" }
        ],
        meta: [
            { name: "apple-mobile-web-app-capable", content: "yes" },
            { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
            { name: "apple-mobile-web-app-title", content: config.public.title }
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