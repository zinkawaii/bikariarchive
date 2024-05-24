<script lang="ts" setup>
    import dayjs from "dayjs";
    import type { CommentData } from "~/server/types/api/comment";
    import type { WithParent } from "~/types";

    const props = defineProps<{
        data: WithParent<CommentData>;
        root?: boolean;
    }>();

    const commentStore = useCommentStore();
    const commentPanelStore = useCommentPanelStore();
    const confirmStore = useConfirmStore();
    const userStore = useUserStore();

    //相对时间
    const elapsed = computed(() => {
        const date = dayjs(props.data.time);
        return Date.now() - date.valueOf() >= 86400000
            ? date.format("YYYY-MM-DD hh:mm")
            : date.fromNow();
    });

    //被回复者
    const recipient = computed(() => {
        return props.data.parent?.nickname;
    });

    //回复评论
    function replyComment() {
        commentPanelStore.reply({
            id: props.data.id,
            nickname: props.data.nickname
        });
    }

    //修改评论
    function modifyComment() {
        commentPanelStore.modify({
            id: props.data.id,
            content: props.data.content,
            nickname: props.data.nickname,
            address: props.data.address
        });
    }

    //删除评论
    async function removeComment() {
        if (!await confirmStore.show("是否删除这条评论？")) return;
        commentStore.remove({
            id: props.data.id
        });
    }
</script>

<template>
    <section class="comment-item">
        <nuxt-img class="comment-avatar" :src="data.avatar" alt="[avatar]" placeholder="/garden/icon/default.png"/>
        <div class="comment-main">
            <div class="comment-header">
                <nuxt-link class="comment-nickname" :to="data.address" target="_blank">{{ data.nickname }}</nuxt-link>
                <template v-if="data.parent?.parent">
                    <icon class="text-gray" name="vaadin:chat"/>
                    <a class="comment-nickname">{{ recipient }}</a>
                </template>
            </div>
            <div v-marked="data.content" class="novel-text comment-text"></div>
            <div class="comment-info">
                <time>{{ elapsed }}</time>
                <a class="comment-action" @click="replyComment">
                    <icon name="fa6-regular:comment"/>回复
                </a>
                <template v-if="userStore.identity >= 9">
                    <a class="comment-action" @click="modifyComment">
                        <icon name="fa6-solid:pen-to-square"/>修改
                    </a>
                    <a class="comment-action" @click="removeComment">
                        <icon name="fa6-solid:trash-can"/>删除
                    </a>
                </template>
            </div>
        </div>
        <div class="comment-reply">
            <comment-item v-for="item in data.children" :key="item.id" :data="item"/>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    .comment-item {
        display: grid;
        grid-template:
            "A B"
            "A C" / auto 1fr;
        column-gap: 14px;
        margin-top: 21px;
    }

    .comment-avatar {
        grid-area: A;
        width: 42px;
        height: 42px;
        border-radius: 100%;
        box-shadow: var(--box-shadow);

        @media (width < 425px) {
            .comment-reply & {
                width: 0;
            }
        }
    }

    .comment-main {
        &:hover .comment-action {
            opacity: 1;
        }
    }

    .comment-header {
        display: flex;
        align-items: center;
        gap: 7px;
        line-height: 21px;
    }

    .comment-nickname {
        font-family: var(--font-smooth);
        color: var(--color-theme-text);
    }

    .comment-text {
        margin-block: 0.5em;
    }

    .comment-info {
        display: flex;
        gap: 16px;
        font-size: 14px;
        color: var(--color-text-info);
    }

    .comment-action {
        display: flex;
        align-items: center;
        gap: 4px;
        opacity: 0;
        transition: all 0.25s;

        &:hover {
            color: var(--color-theme-text);
        }
    }

    .comment-reply {
        border-bottom: 1px solid var(--color-border-lighter);

        & > .comment-item:last-child > & {
            border: 0;
        }

        &:empty {
            margin-top: 14px;
        }
    }
</style>