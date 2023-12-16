<script setup>
    const timerStore = useTimerStore();
    const startDate = new Date("2022/09/30");

    const time = computed(() => {
        const sub = Math.floor((timerStore.now - startDate) / 1000);
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
        <p class="icp">
            <span>Copyright © 2022-2023 By KazariEX</span>｜<nuxt-link class="icp" href="https://icp.gov.moe/?keyword=20230904" target="_blank">萌ICP备20230904号</nuxt-link>
        </p>
    </footer>
</template>

<style lang="scss" scoped>
    .z-footer {
        display: grid;
        padding: 16px 32px;
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
        font-size: 14px;
        text-align: center;
        text-shadow: var(--text-shadow);
        color: white;

        > p {
            line-height: 24px;
        }
    }

    .icp {
        color: white;
    }
</style>