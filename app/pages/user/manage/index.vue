<script lang="ts" setup>
    const views = [
        {
            title: "阅读记录",
            subtitle: "Read Record",
            to: { name: "read-record" },
        },
        {
            title: "用户数据",
            subtitle: "User Data",
            to: { name: "user-data" },
        },
    ];
</script>

<template>
    <div class="manage-banner">
        <nuxt-link v-for="{ title, subtitle, to } in views" class="manage-link" :to>
            <span class="manage-title">{{ title }}</span>
            <span class="manage-subtitle">{{ subtitle }}</span>
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
        height: 76px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: var(--box-shadow);
        background-image: linear-gradient(to left, var(--color-theme), var(--color-theme-dark));
        font-family: var(--font-smooth);
        color: white;
        transition: all 0.4s;

        &:not(.router-link-active, :hover) {
            opacity: 0.75;
            filter: grayscale(1);
        }
    }

    .manage-title {
        text-shadow: var(--text-shadow);
    }

    .manage-subtitle {
        opacity: 0.4;
        font-size: 18px;
        text-shadow: 2px 2px 0 var(--color-theme-dark);
    }
</style>

<style lang="scss">
    .manage-table-wrapper {
        box-shadow: var(--box-shadow);
    }

    .manage-table {
        --font-size-td: 14px;

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
