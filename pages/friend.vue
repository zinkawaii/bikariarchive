<script setup>
    import jFriend from "~/assets/json/Friend.json";

    useHead({
        title: "友情链接"
    });

</script>

<template>
    <div class="content-widget" z-main>
        <div class="friend-list">
            <nuxt-link v-for="item in jFriend.list" class="friend-item" :to="item.href" target="_blank">
                <div class="friend-avatar-wrapper">
                    <div class="friend-avatar"><nuxt-img :src="item.icon" loading="lazy"/></div>
                    <div class="friend-diamond"></div>
                </div>
                <div class="friend-info">
                    <div class="title">{{ item.title }}</div>
                    <span class="description">{{ item.description }}</span>
                </div>
            </nuxt-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .friend-list {
        display: grid;
        grid: auto / repeat(auto-fill, minmax(240px, 1fr));
        grid-gap: 16px;
    }

    .friend-item {
        display: flex;
        height: 112px;
        padding: 8px;
        border: 8px solid transparent;
        border-radius: 8px;
        box-shadow:
            0 0 1px var(--color-border),
            0 0 2px inset var(--color-border);
        background-clip: padding-box;
        background-color: var(--color-background);

        &:hover {
            color: var(--color-theme-text);

            .friend-avatar {
                rotate: 12deg;
                scale: 1.1;
            }

            .friend-diamond {
                rotate: -12deg;
                translate: 31px 15px;
            }
        }
    }

    .friend-avatar-wrapper {
        position: relative;
        width: 80px;
    }

    .friend-avatar {
        position: absolute;
        margin-block: 4px;
        transition: all 0.4s;
        z-index: 1;

        > img {
            display: block;
            width: 72px;
            height: 72px;
            clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
        }

        &::after {
            content: "";
            position: absolute;
            inset: 0;
            border: 1px solid var(--color-theme-dark);
            rotate: 45deg;
            scale: 0.7;
        }
    }

    .friend-diamond {
        position: absolute;
        width: 51px;
        height: 51px;
        border: 3px solid var(--color-theme);
        transition: translate 0.4s, rotate 0.4s;
        rotate: 45deg;
        translate: 24px 14px;
    }

    .friend-info {
        flex: 1;
        overflow: hidden;
        padding-inline: 12px 8px;

        .title {
            margin-bottom: 4px;
            border-bottom: 1px solid var(--color-border-light);
            font-family: "腾祥沁圆简";
            font-size: 21px;
            line-height: 35px;
        }

        .description {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
            line-height: 20px;
            text-overflow: ellipsis;
            color: var(--color-gray);
        }
    }
</style>