<script setup>
    import dayjs from "dayjs";

    const emit = defineEmits(["update"]);
    const props = defineProps(["data"]);

    const commentPanelStore = useCommentPanelStore();
    const confirmStore = useConfirmStore();
    const userStore = useUserStore();

    //相对时间
    const elapsed = computed(() => {
        return dayjs(props.data.time).fromNow();
    });

    //被回复者
    const recipient = computed(() => {
        return props.data.parent?.nickname;
    });

    //回复评论
    function replyComment() {
        commentPanelStore.open({
            replyId: props.data.id,
            replyName: props.data.nickname,
            onReply() {
                emit("update");
            }
        });
    }

    //删除评论
    async function removeComment() {
        if (await confirmStore.show("是否删除这条评论？")) {
            Zjax.delete("/api/comment", {
                body: {
                    id: props.data.id
                }
            })
            .then(({ error }) => {
                if (error === 0) {
                    emit("update");
                }
            });
        }
    }
</script>

<template>
    <section class="comment-item">
        <mb-image class="comment-avatar" :src="data.avatar" placeholder="/garden/icon/default.png"/>
        <div class="comment-main">
            <div class="comment-header">
                <nuxt-link class="comment-nickname" :to="data.address" target="_blank">{{ data.nickname }}</nuxt-link>
                <template v-if="data.parent?.parent">
                    <span class="text-gray">回复</span>
                    <a class="comment-nickname">{{ recipient }}</a>
                </template>
            </div>
            <div v-marked="data.content" class="novel-text comment-content"></div>
            <div class="comment-operator">
                <span>{{ elapsed }}</span>
                <a @click="replyComment">回复</a>
                <a v-if="userStore.identity >= 9" @click="removeComment">删除</a>
            </div>
        </div>
        <div class="comment-reply">
            <comment-item v-for="item in data.children" :key="item.id" :data="item" @update="$emit(`update`)"/>
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
        &:hover .comment-operator > a {
            opacity: 1;
        }
    }

    .comment-header {
        display: flex;
        gap: 7px;
        line-height: 21px;
    }

    .comment-nickname {
        font-family: var(--font-smooth);
        color: var(--color-theme-text);
    }

    .comment-content {
        margin-block: 0.5em;
    }

    .comment-operator {
        display: flex;
        gap: 16px;
        font-size: 14px;
        color: var(--color-text-info);

        > a {
            opacity: 0;
            transition: all 0.25s;
        }
    }

    .comment-reply {
        border-bottom: 1px solid var(--color-border-lighter);

        & .comment-item:last-child & {
            border: 0;
        }

        &:not(:has(> *)) {
            margin-top: 14px;
        }
    }
</style>