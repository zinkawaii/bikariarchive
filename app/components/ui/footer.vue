<script lang="ts" setup>
    const startDate = new Date("2022/09/30");
    const currentDate = new Date();

    const day = Math.floor((currentDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
</script>

<template>
    <footer class="z-footer">
        <p>茶馆已营业 {{ day }} 天・おはびかり・</p>
        <p>Copyright © 2022-{{ currentDate.getFullYear() }} KazariEX｜<nuxt-link to="https://icp.gov.moe/?keyword=20230904" target="_blank">萌ICP备20230904号</nuxt-link>｜<nuxt-link to="https://beian.miit.gov.cn" target="_blank">浙ICP备2024064887号</nuxt-link></p>
    </footer>
</template>

<style lang="scss" scoped>
    .z-footer {
        padding: 16px 32px;
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background-image: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        text-shadow: var(--text-shadow);
        color: white;
    }
</style>
