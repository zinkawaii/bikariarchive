<script setup>
    const commentPanelStore = useCommentPanelStore();

    const { nickname, email, address } = storeToRefs(commentPanelStore);
    const comment = ref("");
    const maxLength = 233;

    const tip = ref({
        nickname: "",
        email: "",
        address: ""
    });

    const checker = {
        nickname: {
            target: nickname,
            required: true,
            reg: /^[\w\u4e00-\u9fa5]*$/,
            message: "昵称不可包含非法字符",
            validate() {
                const count = getByteLength(this.target.value);
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
        },
        all() {
            for (const key of ["nickname", "email", "address"]) {
                const { target, required, reg, message } = this[key];
                if (required || target.value) {
                    const msg = !reg.test(target.value) ? message : this[key].validate?.();
                    if (msg?.length > 0) {
                        tip.value[key] = `* ${msg}`;
                        return false;
                    }
                }
            }
            return true;
        }
    };

    //提交
    function submit() {
        if (checker.all()) {
            postComment();
        }
    }

    //发表评论
    const postComment = Zin.debounce(() => {
        Zjax.post("/api/comment", {
            body: {
                path: location.pathname,
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
            <coco-title>评论</coco-title>
            <div class="panel-form">
                <coco-input placeholder="昵称" :warn-tip="tip.nickname" v-model="nickname" @blur="tip.nickname = ``"/>
                <p class="panel-tip">必填，用于展示评论昵称</p>
            </div>
            <div class="panel-form">
                <coco-input placeholder="邮箱" :warn-tip="tip.email" v-model="email" @blur="tip.email = ``"/>
                <p class="panel-tip">选填，用于从 Cravatar 服务获取头像与评论回复通知</p>
            </div>
            <div class="panel-form">
                <coco-input placeholder="网址" :warn-tip="tip.address" v-model="address" @blur="tip.address = ``"/>
                <p class="panel-tip">选填，用于点击昵称或头像时链向你的个人网站</p>
            </div>
            <div class="panel-form panel-editor">
                <textarea placeholder="说点什么吧~" :maxlength="maxLength" v-model="comment"></textarea>
                <div class="panel-count">{{ comment.length }} / {{ maxLength }}</div>
            </div>
            <a class="btn panel-publish" :class="{ disabled: !comment.length }" @click="submit"><fa-icon icon="paper-plane"/> 发表评论</a>
        </div>
    </transition>
    <mb-mask :when="commentPanelStore.isOpened" @click="commentPanelStore.close()"/>
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
        margin-block: 24px;
        font-size: 14px;
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
        display: grid;
        grid-template-rows: 1fr auto;
        overflow: hidden;
        height: 160px;
        border: 1px solid var(--color-border-light);
        border-radius: 4px;
        background-color: var(--color-background);

        :has(~ :focus) {
            border-color: var(--color-theme-dark);
        }

        > textarea {
            padding: 8px 8px 0;
        }
    }

    .panel-count {
        padding: 4px 8px;
        font-size: 12px;
        text-align: right;
        color: var(--color-gray);
    }

    .panel-publish {
        width: 100%;
        border-radius: var(--circle-radius);
    }
</style>