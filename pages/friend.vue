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
                <li>网站以个人为主体，公开内容符合中国大陆的法律法规；</li>
                <li>拥有独立域名，全站 HTTPS，首屏加载时长不超过 30 秒；</li>
                <li>建站时间在 1 年以上，原创文章大于 14 篇，言之有物。</li>
            </ul>
            <blockquote>
                <p>友链展示顺序可能会凭借个人喜好进行加权，也可能单纯按照时间排布。</p>
            </blockquote>
            <h2>申请格式</h2>
            <p>按照以下 Schema，使用你擅长的编程或标记语言将结构化的站点信息进行导出，并放置在评论的底部。</p>
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