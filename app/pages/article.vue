<script lang="ts" setup>
  import { toString } from "mdast-util-to-string";

  const { novel, index } = defineProps<{
    novel: string;
    index: string;
  }>();

  definePageMeta({
    path: "/book/:novel()/:index()",
    props: true,
    comment: true,
  });

  const readRecordStore = useReadRecordStore();
  const toastStore = useToastStore();
  const router = useRouter();

  //初始化
  const art = Article.for(novel, index);
  if (!art) {
    throw new Error(`Article(${novel}, ${index}) is invalid.`);
  }

  //面包屑
  useBreadcrumb({
    name: "shelf",
    params: {
      novel: art.novel,
      volume: art.volume,
    },
  });

  //上下章快捷键
  useEventListener("keyup", (event) => {
    if (isFocusedEditable()) {
      return;
    }

    if (!art.isFirst && event.key === "ArrowLeft") {
      router.push(art.prev!.route);
    }
    else if (!art.isLast && event.key === "ArrowRight") {
      router.push(art.next!.route);
    }
  });

  //写入阅读记录
  readRecordStore.set(art.novel, {
    index: art.index,
    title: art.title,
  });

  //密码
  const password = ref("");
  const decrypted = ref(false);

  //获取正文
  const { execute, status, data: post, error } = useLazyFetch("/api/article", {
    query: {
      novel,
      index,
      password,
    },
    immediate: !art.encrypted,
    watch: false,
  });

  //热重载
  watch(art, () => execute());

  //元信息
  useSeoMeta({
    title: `${art.title} - ${art.volumeInfo.title}`,
    articleAuthor: [art.novelInfo.author],
    articleSection: art.novelInfo.type,
    articleTag: art.novelInfo.tag,
    articlePublishedTime: art.publishDate,
    articleModifiedTime: art.updateDate,
    ogTitle: art.title,
    ogType: "article",
    ogImage: art.cover?.src,
    description: () => post.value?.body?.children
      .filter((node) => node.type === "element" && node.tag === "p")
      .map((p) => toString(p))
      .join("")
      .slice(0, 128),
  });

  //添加阅读记录
  const count = ref<number>();
  onMounted(async () => {
    await until(status).toBe("success");

    const res = await $fetch("/api/article", {
      method: "patch",
      body: {
        token: post.value?.token,
      },
    });

    count.value = res.count;
  });

  //防抖化请求
  const debouncedExecute = Zin.debounce(async () => {
    await execute();

    if (error.value) {
      switch (getErrorCode(error.value)) {
        case "2":
          return toastStore.error("[article]:password", "密码错误");
        default:
          return toastStore.error("[article]:password", "密码验证失败");
      }
    }
    decrypted.value = true;
  }, {
    title: "请求",
  });
</script>

<template>
  <template #aside>
    <aside-catalog v-if="art.novelInfo.type === `novel`" :art/>
    <aside-outline v-else/>
  </template>
  <meow-widget>
    <novel-header :art :count/>
    <novel-decrypt v-if="art.encrypted && !decrypted" v-model="password" @decrypt="debouncedExecute"/>
    <mb-skeleton v-else-if="status !== `success` && !post"/>
    <novel-article
      v-else-if="post"
      v-outline
      :body="post.body"
      :variant="art.variant"
    />
    <novel-footer :art/>
  </meow-widget>
</template>

<style lang="scss" scoped>
  @include viewport(">md") {
    :where(.mb-skeleton, .novel-text) {
      padding-inline: var(--meow-large);
    }
  }
</style>
