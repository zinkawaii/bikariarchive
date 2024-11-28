<script lang="ts" setup>
    const commentStore = useCommentStore();
    const commentPanelStore = useCommentPanelStore();

    const { mode, replyOptions, modifyOptions } = storeToRefs(commentPanelStore);
    const [isSending, toggleSending] = useToggle(false);

    const isReplyMode = computed(() => {
        return mode.value === "reply";
    });

    const isModifyMode = computed(() => {
        return mode.value === "modify";
    });

    const { content, nickname, email, address } = useSourceRefs(() => (isModifyMode.value ? modifyOptions.value : commentPanelStore), {
        content: {},
        nickname: {},
        email: {
            default: "",
            readonly: isModifyMode
        },
        address: {}
    });

    const { errors, validate } = useValidate({
        nickname: {
            target: nickname,
            required: true,
            ...nicknameValidates
        },
        email: {
            target: email,
            rule: Zexp.email,
            message: "邮箱格式不正确"
        },
        address: {
            target: address,
            rule: Zexp.url,
            message: "网址格式不正确"
        }
    });

    //标题
    const title = computed(() => {
        return isReplyMode.value
            ? `回复 @${replyOptions.value.nickname}`
            : "评论";
    });

    //内容是否超长
    const isContentOverlength = computed(() => {
        const { length } = content.value.trim();
        return length === 0 || length > 512;
    });

    //发表评论
    async function sendComment() {
        if (!validate()) return;

        toggleSending(true);
        try {
            if (isModifyMode.value) {
                await commentStore.modify({
                    id: modifyOptions.value.id,
                    content: content.value,
                    nickname: nickname.value,
                    address: address.value
                });
            }
            else {
                await commentStore.post({
                    path: commentPanelStore.path,
                    parent: isReplyMode.value ? replyOptions.value.id : void 0,
                    content: content.value,
                    nickname: nickname.value,
                    email: email.value,
                    address: address.value
                });
            }
            content.value = "";
            commentPanelStore.close();
        }
        finally {
            toggleSending(false);
        }
    }
</script>

<template>
    <mb-dialog class="comment-panel" @close="commentPanelStore.close()">
        <meow-title>{{ title }}</meow-title>
        <div class="panel-form">
            <meow-input placeholder="昵称" v-model="nickname" v-model:error="errors.nickname"/>
            <p class="panel-tip">必填，用于展示评论昵称</p>
        </div>
        <div class="panel-form">
            <meow-input placeholder="邮箱" v-model="email" v-model:error="errors.email"/>
            <p class="panel-tip">选填，用于从 WeAvatar 服务获取头像与评论回复通知</p>
        </div>
        <div class="panel-form">
            <meow-input placeholder="网址" v-model="address" v-model:error="errors.address"/>
            <p class="panel-tip">选填，用于点击昵称时链向你的个人网站</p>
        </div>
        <div class="panel-form">
            <comment-editor v-model="content"/>
            <p class="panel-tip">支持部分 Markdown 语法</p>
        </div>
        <mb-button
            full round
            :disabled="isContentOverlength || isSending"
            @click="sendComment"
        >
            <iconify name="fa6-solid:paper-plane"/>
            <span>{{ isSending ? "发送中……" : "发表评论" }}</span>
        </mb-button>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .comment-panel {
        width: 512px;

        @include viewport("xs") {
            --dialog-padding: 16px;

            height: 100dvh;
            border-radius: 0;
        }
    }

    .panel-form {
        position: relative;
        margin-block: 24px;
        font-size: 14px;

        &:first-of-type {
            margin-top: 32px;
        }
    }

    .panel-tip {
        padding: 4px;
        font-size: 12px;
        line-height: 18px;
        color: var(--color-info);

        &::before {
            content: "• ";
        }
    }
</style>