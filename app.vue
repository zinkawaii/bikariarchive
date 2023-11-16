<script setup>
    useHead({
        titleTemplate: (title) => {
            return title ? `${title} - 微光茶馆` : "微光茶馆";
        }
    });

    //浏览器环境下
    if (process.browser) {
        const settingStore = useSettingStore();

        //移动端
        if (window.innerWidth < Zin.MOBILE_SIZE_MAX) {
            settingStore.set("ui-collapse", true);
        }

        //夜间模式
        settingStore.listen("dark-mode", (value) => {
            const mode = {
                1: false,
                2: true
            }[value] ?? (Zin.period === Zin.PERIOD_NIGHT);
            document.documentElement.toggleAttribute("z-dark", mode);
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

        //全局走时
        Zin.setInterval(() => {
            const event = new Event("timer");
            event.date = new Date();
            document.dispatchEvent(event);
        }, {
            duration: 1000
        });
    }
</script>

<template>
    <nuxt-layout>
        <nuxt-page />
    </nuxt-layout>
</template>