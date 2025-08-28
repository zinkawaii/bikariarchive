<script lang="ts" setup>
    import { parseComment } from "@bikari/article/remark";
    import { format, formatDistanceToNow } from "date-fns";
    import { LazyCommentUser } from "#components";
    import type { WithParent } from "~/types";
    import type { CommentData } from "~~/server/types/api/comment";

    const props = defineProps<{
        data: WithParent<CommentData>;
    }>();

    const commentStore = useCommentStore();
    const dialogStore = useDialogStore();
    const userStore = useUserStore();

    const body = computedAsync(() => {
        return parseComment(props.data.content);
    });

    //相对时间
    const elapsed = computed(() => {
        const date = new Date(props.data.time);
        return Date.now() - date.valueOf() >= 86400000
            ? format(date, "yyyy-MM-dd HH:mm")
            : formatDistanceToNow(date, {
                addSuffix: true,
                includeSeconds: true,
            });
    });

    //查看用户信息
    function openUserInfo(data: CommentData) {
        dialogStore.use(() => h(LazyCommentUser, {
            avatar: data.avatar,
            nickname: data.nickname,
            address: data.address,
            character: data.character,
        }), {
            immediate: true,
        });
    }

    //回复评论
    function replyComment() {
        commentStore.requirePost(props.data);
    }

    //修改评论
    function modifyComment() {
        commentStore.requireModify(props.data);
    }

    //删除评论
    async function removeComment() {
        if (await requireConfirm("是否删除这条评论？")) {
            commentStore.remove({
                id: props.data.id,
            });
        }
    }
</script>

<template>
    <section class="comment-item">
        <user-avatar class="comment-avatar" :src="data.avatar" @click="openUserInfo(data)"/>
        <div class="comment-main">
            <div class="comment-header">
                <button class="comment-nickname" @click="openUserInfo(data)">{{ data.nickname }}</button>
                <template v-if="data.parent?.parent">
                    <iconify class="text-gray" name="vaadin:chat"/>
                    <button class="comment-nickname" @click="openUserInfo(data.parent)">{{ data.parent.nickname }}</button>
                </template>
            </div>
            <novel-article :body variant="comment">
                <p class="comment-sanitized">好像说了什么，但是被清除了</p>
            </novel-article>
            <div class="comment-info">
                <time>{{ elapsed }}</time>
                <button class="comment-action" @click="replyComment">
                    <iconify name="fa7-solid:comment-dots"/>
                    <span>回复</span>
                </button>
                <template v-if="userStore.identity >= 9">
                    <button class="comment-action" @click="modifyComment">
                        <iconify name="fa7-solid:pen-to-square"/>
                        <span>修改</span>
                    </button>
                    <button class="comment-action" @click="removeComment">
                        <iconify name="fa7-solid:trash-can"/>
                        <span>删除</span>
                    </button>
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

    .comment-sanitized {
        color: var(--color-text-disabled);
        user-select: none;
    }

    .comment-info {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
        font-size: 14px;
        color: var(--color-info);
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
