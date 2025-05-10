<script lang="ts" setup>
    const settingStore = useSettingStore();
    const config = useRuntimeConfig();
    const image = useImage();

    const dark = ref<boolean>();
    const theme = ref<string>();

    useHead({
        link: [
            { rel: "icon", href: "/garden/favicon.svg" },
            { rel: "apple-touch-icon", href: image(config.public.avatar, { width: 180 }) },
            { rel: "alternate", type: "application/atom+xml", title: config.public.title, href: "/feed" },
        ],
        meta: [
            { name: "mobile-web-app-capable", content: "yes" },
            { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
            { name: "apple-mobile-web-app-title", content: config.public.title },
        ],
        titleTemplate: "%s %separator %site.name",
        templateParams: {
            separator: "-",
        },
        htmlAttrs: {
            theme,
            "z-dark": dark,
        },
    });

    //主题颜色
    settingStore.listen("theme", () => {
        theme.value = settingStore.themeName;
    });

    //夜间模式
    settingStore.listen("dark-mode", () => {
        dark.value = settingStore.isDarkMode;
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
