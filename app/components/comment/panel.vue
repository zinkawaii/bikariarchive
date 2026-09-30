<script lang="ts" setup>
  import type { CommentData } from "#server/types/comment";

  interface CommentPanelPostProps {
    kind: "post";
    path: string;
  }

  interface CommentPanelModifyProps {
    kind: "modify";
    id: string;
    pending?: boolean;
  }

  const props = defineProps<(CommentPanelPostProps | CommentPanelModifyProps) & {
    parent?: CommentData;
  }>();
  const content = defineModel<string>("content", {
    required: true,
  });
  const nickname = defineModel<string>("nickname", {
    required: true,
  });
  const email = defineModel<string>("email", {
    default: "",
  });
  const address = defineModel<string>("address", {
    default: "",
  });
  const emit = defineEmits<{
    close: [];
  }>();

  const commentStore = useCommentStore();
  const signerStore = useSignerStore();

  const [isSubmitting, toggleSubmitting] = useToggle(false);

  const { errors, validate } = useValidate({
    nickname: {
      target: nickname,
      required: true,
      preset: "nickname",
    },
    email: {
      target: email,
      preset: "email",
    },
    address: {
      target: address,
      preset: "url",
    },
  });

  // 标题
  const title = computed(() => {
    return props.parent ? `回复 @${props.parent.nickname}` : "评论";
  });

  // 内容是否超长
  const isContentOverlength = computed(() => {
    const { length } = content.value.trim();
    return length === 0 || length > 512;
  });

  // 公开评论
  async function auditComment() {
    toggleSubmitting(true);
    try {
      if (props.kind === "modify") {
        await commentStore.audit({ id: props.id });
      }
      emit("close");
    }
    finally {
      toggleSubmitting(false);
    }
  }

  // 发表评论
  async function sendComment() {
    if (!validate()) {
      return;
    }

    toggleSubmitting(true);
    try {
      if (props.kind === "modify") {
        await commentStore.modify({
          id: props.id,
          content: content.value,
          nickname: nickname.value,
          email: email.value || void 0,
          address: address.value || void 0,
        });
      }
      else {
        await commentStore.post({
          path: props.path,
          parent: props.parent?.id,
          content: content.value,
          nickname: nickname.value,
          email: email.value || void 0,
          address: address.value || void 0,
        });
      }
      emit("close");
    }
    finally {
      toggleSubmitting(false);
    }
  }
</script>

<template>
  <mb-dialog class="comment-panel" @close="emit(`close`)">
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
    <div class="panel-operators">
      <mb-button
        v-if="signerStore.isAdmin"
        round
        :disabled="kind !== `modify` || !pending || isSubmitting"
        @click="auditComment"
      >
        <iconify name="fa7-solid:eye"/>
        <span>公开</span>
      </mb-button>
      <mb-button
        round
        :disabled="isContentOverlength || isSubmitting"
        @click="sendComment"
      >
        <iconify name="fa7-solid:paper-plane"/>
        <span>{{ isSubmitting ? "发送中……" : "发表评论" }}</span>
      </mb-button>
    </div>
  </mb-dialog>
</template>

<style scoped>
  .comment-panel {
    width: 512px;

    @media (width < 425px) {
      --dialog-padding: 1rem;

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

  .panel-operators {
    display: grid;
    grid-template-columns: 96px 1fr;
  }
</style>
