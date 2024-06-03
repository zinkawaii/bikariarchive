<script lang="ts" setup>
    const commentStore = useCommentStore();
    const commentPanelStore = useCommentPanelStore();

    const { mode, replyOptions, modifyOptions } = storeToRefs(commentPanelStore);
    const [isSending, toggleSending] = useToggle(false);
    const maxLength = 512;

    const isReplyMode = computed(() => {
        return mode.value === "reply";
    });

    const isModifyMode = computed(() => {
        return mode.value === "modify";
    });

    const content = computed({
        get() {
            return isModifyMode.value
                ? modifyOptions.value.content
                : commentPanelStore.content;
        },
        set(val) {
            isModifyMode.value
                ? modifyOptions.value.content = val
                : commentPanelStore.content = val;
        }
    });

    const nickname = computed({
        get() {
            return isModifyMode.value
                ? modifyOptions.value.nickname
                : commentPanelStore.nickname;
        },
        set(val) {
            isModifyMode.value
                ? modifyOptions.value.nickname = val
                : commentPanelStore.nickname = val;
        }
    });

    const email = computed({
        get() {
            return !isModifyMode.value ? commentPanelStore.email : "";
        },
        set(val) {
            !isModifyMode.value && (commentPanelStore.email = val);
        }
    });

    const address = computed({
        get() {
            return isModifyMode.value
                ? modifyOptions.value.address
                : commentPanelStore.address;
        },
        set(val) {
            isModifyMode.value
                ? modifyOptions.value.address = val
                : commentPanelStore.address = val;
        }
    });

    const checker = new Checker({
        nickname: {
            target: nickname,
            required: true,
            reg: /^[\w\u4E00-\u9FA5]*$/,
            message: "昵称不可包含非法字符",
            validate(value) {
                const count = getByteLength(value);
                if (count === 0) {
                    return "昵称不能为空";
                }
                else if (count > 24) {
                    return "昵称长度不能超过24个字符";
                }
            }
        },
        email: {
            target: email,
            reg: Zexp.email,
            message: "邮箱格式不正确"
        },
        address: {
            target: address,
            reg: Zexp.url,
            message: "网址格式不正确"
        }
    });
    const { tips } = checker;

    //标题
    const title = computed(() => {
        return isReplyMode.value
            ? `回复 @${replyOptions.value.nickname}`
            : "评论";
    });

    //内容长度
    const contentLength = computed(() => {
        return content.value.trim().length;
    });

    //发表评论
    async function sendComment() {
        if (!checker.exec()) return;

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
    <mb-dialog class="comment-panel" v-model="commentPanelStore.isOpened">
        <coco-title>{{ title }}</coco-title>
        <div class="panel-form">
            <coco-input placeholder="昵称" :warn-tip="tips.nickname" v-model="nickname" @blur="tips.nickname = ``"/>
            <p class="panel-tip">必填，用于展示评论昵称</p>
        </div>
        <div class="panel-form">
            <coco-input placeholder="邮箱" :warn-tip="tips.email" v-model="email" @blur="tips.email = ``"/>
            <p class="panel-tip">选填，用于从 Cravatar 服务获取头像与评论回复通知</p>
        </div>
        <div class="panel-form">
            <coco-input placeholder="网址" :warn-tip="tips.address" v-model="address" @blur="tips.address = ``"/>
            <p class="panel-tip">选填，用于点击昵称时链向你的个人网站</p>
        </div>
        <div class="panel-form">
            <textarea class="panel-editor" placeholder="说点什么吧~" :maxlength="maxLength" v-model="content"></textarea>
            <p class="panel-tip">支持部分 Markdown 语法</p>
            <div class="panel-count">{{ contentLength }} / {{ maxLength }}</div>
        </div>
        <mb-button
            full round
            :disabled="!contentLength || isSending"
            @click="sendComment"
            ><icon name="fa6-solid:paper-plane"/>
            <span>{{ isSending ? "发送中……" : "发表评论" }}</span>
        </mb-button>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .comment-panel {
        width: 512px;
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
        color: var(--color-text-info);

        &::before {
            content: "• ";
        }
    }

    .panel-editor {
        display: block;
        width: 100%;
        height: 180px;
        padding: 6px 8px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 4px;
        background-color: var(--color-background);
        line-height: 24px;
        transition: border-color 0.4s;

        &:focus {
            border-color: var(--color-theme-dark);
        }
    }

    .panel-count {
        position: absolute;
        right: 8px;
        bottom: 30px;
        font-size: 12px;
        color: var(--color-text-info);
    }
</style>