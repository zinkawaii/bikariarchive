<script setup>
    import { ref } from "vue";

    const views = ref([
        {
            title: "阅读记录",
            sub: "Read Record",
            path: "/manage/read-record"
        },
        {
            title: "用户数据",
            sub: "User Data",
            path: "/manage/user-data"
        }
    ]);
</script>

<template>
    <div class="manage-banner">
        <router-link v-for="view in views" class="manage-link" :to="view.path">
            <span class="title">{{ view.title }}</span>
            <span class="sub">{{ view.sub }}</span>
        </router-link>
    </div>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component"></component>
        </keep-alive>
    </router-view>
</template>

<style lang="scss" scoped>
    .manage-banner {
        display: grid;
        grid: auto / repeat(auto-fill, minmax(146px, 1fr));
        grid-gap: 16px;
        margin-bottom: 32px;
    }

    .manage-link {
        height: 72px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
        background: linear-gradient(to left, var(--color-theme-block), var(--color-theme-block-dark));
        color: white;
        transition: all 0.4s;

        .title {
            display: block;
            font-family: "腾祥沁圆简";
            text-shadow: var(--text-shadow);
        }

        .sub {
            opacity: 0.5;
            font-size: 18px;
            font-weight: bold;
            line-height: 28px;
            text-shadow: 2px 2px 0 var(--color-theme-block-dark);
        }

        &:not(.router-link-active, :hover) {
            opacity: 0.75;
            filter: grayscale(1);
        }
    }
</style>

<!-- 全局样式 -->
<style lang="scss">
    .manage-table-wrapper {
        overflow: auto;
        margin-top: 32px;
        box-shadow: var(--box-shadow);
    }

    .manage-table {
        min-width: 616px;
        background-color: var(--color-background-alpha);
        font-size: 14px;
        text-align: center;

        tr {
            &:nth-child(even) > th {
                background-color: var(--color-theme-block-light);
            }

            &.v-enter-active,
            &.v-leave-active {
                transition: all 0.4s;
            }

            &.v-enter-from,
            &.v-leave-to {
                opacity: 0;
            }
        }
    }
</style>