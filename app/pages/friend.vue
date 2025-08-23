<script lang="ts" setup>
    import jFriend from "~/assets/json/Friend.json";

    useHead({
        title: "友情链接",
    });

    const config = useRuntimeConfig();

    const schema = `export default defineFriend({
  title: "${config.public.title}",
  link: "https://${config.public.domain}",
  icon: "https://${config.public.domain}${config.public.favicon}",
  nickname: "${config.public.author}",
  description: "${config.public.description}",
});`;
</script>

<template>
    <meow-widget title="友情链接">
        <novel-article variant="article" size="small">
            <div class="friend-list">
                <nuxt-link v-for="item in jFriend" class="friend-item" :to="item.link" rel="noopener" target="_blank">
                    <hgroup class="friend-info">
                        <nuxt-img class="friend-icon" :src="item.icon" alt="[icon]" loading="lazy"/>
                        <h3 class="friend-title text-truncate">{{ item.title }}</h3>
                        <span class="text-gray">{{ item.nickname }}</span>
                    </hgroup>
                    <p class="friend-desc text-truncate">{{ item.description }}</p>
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
        </novel-article>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .friend-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
        gap: 1rem;
    }

    .friend-item {
        padding: 1rem;
        border: 1px solid var(--color-border-lighter);
        border-radius: 1rem;
        background-color: var(--color-background);
        transition: border 0.25s;

        &:hover {
            border-color: var(--color-theme-dark);

            .friend-title {
                color: var(--color-theme-text);
            }
        }
    }

    .friend-info {
        display: grid;
        grid-template:
            "A B"
            "A C" / auto 1fr;
        column-gap: 0.75rem;
        margin-bottom: 0.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--color-border-lighter);
        font-family: var(--font-smooth);
    }

    .friend-icon {
        grid-area: A;
        width: 3rem;
        aspect-ratio: 1;
        border-radius: 0.5rem;
    }

    .friend-title {
        margin-block: 0;
        line-height: 1.25;
        transition: color 0.25s;
    }

    .friend-desc {
        line-height: 1.5;
        color: var(--color-info);
    }
</style>
