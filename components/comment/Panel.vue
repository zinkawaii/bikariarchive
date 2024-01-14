<script setup>
    const commentPanelStore = useCommentPanelStore();

    const { nickname, email, address } = storeToRefs(commentPanelStore);
    const comment = ref("");
    const maxLength = 512;

    //添加遮罩层
    useMask({
        isOpened: () => commentPanelStore.isOpened,
        onclick: () => commentPanelStore.close()
    });

    const checker = new Checker({
        nickname: {
            target: nickname,
            required: true,
            reg: /^[\w\u4e00-\u9fa5]*$/,
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
            reg: /^[\w-]+@[\w-]+(.[\w-]+)+$/,
            message: "邮箱格式不正确"
        },
        address: {
            target: address,
            reg: /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
            message: "网址格式不正确"
        }
    });
    const { tips } = checker;

    //标题
    const title = computed(() => {
        const { replyName } = commentPanelStore;
        return replyName ? `回复 @${replyName}` : "评论";
    });

    //提交
    function submit() {
        if (checker.exec()) {
            postComment();
        }
    }

    //发表评论
    const postComment = Zin.debounce(() => {
        Zjax.post("/api/comment", {
            body: {
                path: commentPanelStore.path,
                parent: commentPanelStore.replyId,
                content: comment.value,
                nickname: nickname.value,
                email: email.value,
                address: address.value
            }
        })
        .then(() => {
            comment.value = "";
            commentPanelStore.close(true);
        });
    });
</script>

<template>
    <transition name="scale">
        <div v-if="commentPanelStore.isOpened" class="comment-panel">
            <fa-icon class="xmark" icon="xmark" @click="commentPanelStore.close()"/>
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
                <textarea class="panel-editor" placeholder="说点什么吧~" :maxlength="maxLength" v-model="comment"></textarea>
                <div class="panel-count">{{ comment.length }} / {{ maxLength }}</div>
            </div>
            <mb-button full round icon="paper-plane" :disabled="!comment.length" @click="submit">发表评论</mb-button>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
    .comment-panel {
        position: fixed;
        inset: 0;
        width: min(100%, 512px);
        height: fit-content;
        max-height: 100%;
        margin: auto;
        padding: 32px;
        border-radius: 16px;
        background-color: var(--color-background);
    }

    .scale-enter-active, .scale-leave-active {
        transition: all 0.4s;
    }

    .scale-enter-from, .scale-leave-to {
        opacity: 0;
        scale: 0.75;
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
        color: var(--color-gray);

        &::before {
            content: "• ";
        }
    }

    .panel-editor {
        display: block;
        width: 100%;
        height: 180px;
        padding: 6px 8px;
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        background-color: var(--color-background);
        line-height: 24px;
        transition: all 0.4s;

        &:focus {
            border-color: var(--color-theme-dark);
        }
    }

    .panel-count {
        position: absolute;
        right: 8px;
        bottom: 4px;
        font-size: 12px;
        color: var(--color-gray);
    }
</style>