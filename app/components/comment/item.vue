<script lang="ts" setup>
    import dayjs from "dayjs";
    import { CommentUser } from "#components";
    import type { WithParent } from "~/types";
    import type { CommentData } from "~~/server/types/api/comment";

    const props = defineProps<{
        data: WithParent<CommentData>;
    }>();

    const commentStore = useCommentStore();
    const commentPanelStore = useCommentPanelStore();
    const dialogStore = useDialogStore();
    const userStore = useUserStore();

    const body = computedAsync(() => {
        return parseComment(props.data.content);
    });

    //用户信息弹窗
    const { open, close } = dialogStore.use(() => h(CommentUser, {
        avatar: props.data.avatar,
        nickname: props.data.nickname,
        address: props.data.address,
        onClose: close
    }));

    //相对时间
    const elapsed = computed(() => {
        const date = dayjs(props.data.time);
        return Date.now() - date.valueOf() >= 86400000
            ? date.format("YYYY-MM-DD HH:mm")
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
        if (!await Zin.confirm("是否删除这条评论？")) return;
        commentStore.remove({
            id: props.data.id
        });
    }
</script>

<template>
    <section class="comment-item">
        <user-avatar class="comment-avatar" :src="data.avatar" @click="open"/>
        <div class="comment-main">
            <div class="comment-header">
                <a class="comment-nickname" @click="open">{{ data.nickname }}</a>
                <template v-if="data.parent?.parent">
                    <icon class="text-gray" name="vaadin:chat"/>
                    <a class="comment-nickname">{{ recipient }}</a>
                </template>
            </div>
            <novel-article class="comment-text" :body>
                <p class="comment-sanitized">好像说了什么，但是被清除了</p>
            </novel-article>
            <div class="comment-info">
                <time>{{ elapsed }}</time>
                <a class="comment-action" @click="replyComment">
                    <icon name="fa6-solid:comment-dots"/>
                    <span>回复</span>
                </a>
                <template v-if="userStore.identity >= 9">
                    <a class="comment-action" @click="modifyComment">
                        <icon name="fa6-solid:pen-to-square"/>
                        <span>修改</span>
                    </a>
                    <a class="comment-action" @click="removeComment">
                        <icon name="fa6-solid:trash-can"/>
                        <span>删除</span>
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
        cursor: pointer;

        @include viewport("xs") {
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

    .comment-sanitized {
        color: var(--color-text-disabled);
    }

    .comment-info {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
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

        @include viewport("sm") {
            > .iconify + span {
                display: none;
            }
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