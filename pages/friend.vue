<script setup>
    useHead({
        title: "友情链接"
    });

    const config = useRuntimeConfig();

    const { pending, data } = useLazyFetch("/api/friend");

    const schema = `export default {
  title: "${config.public.title}",
  link: "https://${config.public.domain}",
  icon: "https://cravatar.cn/avatar/ECB2EA87C4532F007838D86D02798F89",
  description: "${config.public.description}"
};`;
</script>

<template>
    <coco-widget title="友情链接">
        <div class="novel-text text-small">
            <mb-skeleton v-if="pending"/>
            <div v-else class="friend-list">
                <nuxt-link v-for="item in data.list" class="friend-item" :to="item.link" target="_blank">
                    <nuxt-img class="friend-icon" :src="item.icon" alt="[icon]" loading="lazy"/>
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
            <mb-code lang="js" :raw="schema"/>
        </div>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .friend-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
        gap: 16px;
    }

    .friend-item {
        display: flex;
        gap: 16px;
        height: 112px;
        padding: 16px;
        border: 1px solid var(--color-border-lighter);
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

    .friend-icon {
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
        margin-bottom: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid var(--color-border-lighter);
        transition: color 0.25s;
    }

    .friend-desc {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 14px;
        line-height: 21px;
        text-overflow: ellipsis;
        color: var(--color-text-info);
    }
</style>