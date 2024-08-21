<script lang="ts" setup>
    import type { Article } from "~/utils/Article";

    defineProps<{
        art: Article;
    }>();
</script>

<template>
    <footer class="novel-footer">
        <p v-if="art.ending" class="novel-endding">THE END</p>
        <div class="novel-copyright">
            <nuxt-img class="copyright-avatar" :src="$config.public.avatar" alt="[avatar]"/>
            <div class="right">
                <div class="copyright-crumb">
                    <span>{{ art.novelInfo.title }}</span>
                    <icon class="text-gray" name="fa6-solid:chevron-right"/>
                    <span>{{ art.volumeInfo.title }}</span>
                    <icon class="text-gray" name="fa6-solid:chevron-right"/>
                    <span>{{ art.title }}</span>
                </div>
                <p class="text-gray">本网站的所有文章除特别声明外，转载均需经过作者本人同意；文章内容仅供个人交流用，禁作商业用途。</p>
            </div>
        </div>
        <div class="novel-adjacents">
            <novel-adjacent v-if="art.prev" :art="art.prev" type="prev"/>
            <novel-adjacent v-if="art.next" :art="art.next" type="next"/>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
    .novel-endding {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        font-size: 13px;
        line-height: 32px;
        color: var(--color-info-light-3);

        &::before, &::after {
            content: "";
            width: 20%;
            height: 1px;
            background-color: var(--color-border-light);
        }
    }

    .novel-copyright {
        display: flex;
        overflow: auto;
        margin-top: 16px;
        border: 1px solid var(--color-border-lighter);
        border-radius: var(--bounded-full);
        background-color: var(--color-background);
        font-size: 14px;
        line-height: 2em;

        &::-webkit-scrollbar {
            display: none;
        }

        > .right {
            padding: 12px 16px;
            text-wrap: nowrap;
        }
    }

    .copyright-avatar {
        width: 80px;
        border-radius: var(--bounded-full);
    }

    .copyright-crumb {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .novel-adjacents {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-top: 16px;
    }
</style>