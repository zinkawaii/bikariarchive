<script setup>
    const startDate = new Date("2022/09/30");
    const time = ref({
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
    });

    Zin.setInterval(() => {
        const now = new Date();
        const sub = Math.floor((now - startDate) / 1000);
        const d = Math.floor(sub / 60 / 60 / 24);
        const h = Math.floor(sub / 60 / 60) - 24 * d;
        const m = Math.floor(sub % 3600 / 60);
        const s = Math.floor(sub % 60);
        time.value.day = d;
        time.value.hour = h;
        time.value.minute = m;
        time.value.second = s;
    }, {
        duration: 1000
    });
</script>

<template>
    <div class="mb-footer">
        <div class="time">
            茶馆已营业 {{ time.day }} 天 {{ time.hour }} 时 {{ time.minute }} 分 {{ time.second }} 秒
        </div>
        <div class="icp">
            <span>Copyright © 2022-2023 By KazariEX</span>｜<a href="https://icp.gov.moe/?keyword=20230904" target="_blank" rel="nofollow noopener noreferrer">萌ICP备20230904号</a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .mb-footer {
        display: block;
        padding: 16px 32px;
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background: linear-gradient(to right, var(--color-theme-block), var(--color-theme-block-dark));
        line-height: 24px;
        text-align: center;
        text-shadow: var(--text-shadow);
        color: white;
    }

    .icp {
        display: inline-block;

        > a {
            color: white;
        }
    }
</style>