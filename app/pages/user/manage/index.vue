<script lang="ts" setup>
    const views = [
        {
            title: "阅读记录",
            sub: "Read Record",
            to: { name: "read-record" }
        },
        {
            title: "用户数据",
            sub: "User Data",
            to: { name: "user-data" }
        }
    ];
</script>

<template>
    <div class="manage-banner">
        <nuxt-link v-for="{ title, sub, to } in views" class="manage-link" :to>
            <span class="title">{{ title }}</span>
            <span class="sub">{{ sub }}</span>
        </nuxt-link>
    </div>
    <nuxt-page keepalive/>
</template>

<style lang="scss" scoped>
    .manage-banner {
        display: grid;
        grid: auto / repeat(auto-fill, minmax(146px, 1fr));
        grid-gap: 16px;
    }

    .manage-link {
        display: grid;
        height: 72px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
        background: linear-gradient(to left, var(--color-theme), var(--color-theme-dark));
        color: white;
        transition: all 0.4s;

        .title {
            font-family: var(--font-smooth);
            text-shadow: var(--text-shadow);
        }

        .sub {
            opacity: 0.5;
            font-size: 18px;
            font-weight: bold;
            line-height: 28px;
            text-shadow: 2px 2px 0 var(--color-theme-dark);
        }

        &:not(.router-link-active, :hover) {
            opacity: 0.75;
            filter: grayscale(1);
        }
    }
</style>

<style lang="scss">
    .manage-table-wrapper {
        overflow: auto;
        box-shadow: var(--box-shadow);
    }

    .manage-table {
        background-color: var(--color-background-alpha);
        text-align: center;
        text-wrap: nowrap;

        tr {
            &:where(.v-enter-active, .v-leave-active) {
                transition: all 0.4s;
            }

            &:where(.v-enter-from, .v-leave-to) {
                opacity: 0;
            }
        }
    }
</style>