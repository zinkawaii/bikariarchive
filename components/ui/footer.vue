<script lang="ts" setup>
    const timerStore = useTimerStore();
    const startTime = new Date("2022/09/30").getTime();

    const time = computed(() => {
        const sub = Math.floor((timerStore.now.getTime() - startTime) / 1000);
        const d = Math.floor(sub / 60 / 60 / 24);
        const h = Math.floor(sub / 60 / 60) - 24 * d;
        const m = Math.floor(sub % 3600 / 60);
        const s = Math.floor(sub % 60);
        return {
            day: d,
            hour: h,
            minute: m,
            second: s
        };
    });
</script>

<template>
    <footer class="z-footer">
        <p>茶馆已营业 {{ time.day }} 天 {{ time.hour }} 时 {{ time.minute }} 分 {{ time.second }} 秒</p>
        <p>Copyright © 2022-2024 By KazariEX｜<nuxt-link to="https://icp.gov.moe/?keyword=20230904" target="_blank">萌ICP备20230904号</nuxt-link>｜<nuxt-link to="https://beian.miit.gov.cn" target="_blank">浙ICP备2024064887号</nuxt-link></p>
    </footer>
</template>

<style lang="scss" scoped>
    .z-footer {
        padding: 16px 32px;
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        text-shadow: var(--text-shadow);
        color: white;
    }
</style>