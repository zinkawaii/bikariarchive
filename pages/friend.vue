<script setup>
    import jFriend from "~/assets/json/Friend.json";

    useHead({
        title: "友情链接"
    });

    const schema = `export default {
  title: "微光茶馆",
  link: "https://bikariarchive.xyz",
  icon: "https://cravatar.cn/avatar/ECB2EA87C4532F007838D86D02798F89",
  description: "虚幻的幸福"
};`;
</script>

<template>
    <div class="content-widget" z-main>
        <div class="novel-text">
            <div class="friend-list">
                <nuxt-link v-for="item in jFriend.list" class="friend-item" :to="item.link" target="_blank">
                    <nuxt-img class="friend-avatar" :src="item.icon" loading="lazy"/>
                    <div class="friend-info">
                        <div class="content-h2 text-truncate friend-title">{{ item.title }}</div>
                        <span class="friend-desc">{{ item.description }}</span>
                    </div>
                </nuxt-link>
            </div>
            <h2>交换基准</h2>
            <ul>
                <li>全站 HTTPS，可正常访问；</li>
                <li>原创文章大于 7 篇，言之有物；</li>
                <li>拥有独立域名，而不是公有子域名或免费域名（如 <code>github.io</code> <code>vercel.app</code> <code>.tk</code> <code>.ml</code> <code>.cf</code> 等）。</li>
            </ul>
            <h2>本站信息</h2>
            <mb-code lang="js">{{ schema }}</mb-code>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .friend-list {
        display: grid;
        grid: auto / repeat(auto-fill, minmax(256px, 1fr));
        grid-gap: 16px;
    }

    .friend-item {
        display: flex;
        gap: 16px;
        height: 112px;
        padding: 16px;
        border: 1px solid var(--color-border-light);
        border-radius: 16px;
        background-color: var(--color-background);
        transition: border 0.25s;

        &:hover {
            border-color: var(--color-theme-dark);

            .friend-title {
                color: var(--color-theme-text);
            }
        }
    }

    .friend-avatar {
        width: 72px;
        height: 72px;
        margin: auto;
        border-radius: 8px;
    }

    .friend-info {
        flex: 1;
        overflow: hidden;
    }

    .friend-title {
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--color-border-light);
        transition: color 0.25s;
    }

    .friend-desc {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 14px;
        line-height: 22px;
        text-overflow: ellipsis;
        color: var(--color-gray);
    }

    .novel-text {
        margin-bottom: -1em;
        font-size: 14px;
    }
</style>