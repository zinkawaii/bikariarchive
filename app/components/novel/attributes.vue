<script lang="ts" setup>
  type Attr = "volume" | "read-count" | "word-count" | "publish-date" | "update-date";

  const props = withDefaults(defineProps<{
    art: Article;
    count?: number;
    attrs: Attr[];
    wrap?: boolean;
  }>(), {
    wrap: true,
  });

  const infos: {
    attr: Attr;
    icon: string;
    tag?: string;
    content: MaybeRefOrGetter<unknown>;
  }[] = [
    {
      attr: "volume",
      icon: "fa7-solid:scroll",
      content: () => props.art.volumeInfo.title,
    },
    {
      attr: "read-count",
      icon: "fa7-solid:eye",
      content: () => `${props.count ?? "?"} 阅读`,
    },
    {
      attr: "word-count",
      icon: "fa7-solid:outdent",
      content: () => `${props.art.wordCount} 字`,
    },
    {
      attr: "publish-date",
      icon: "fa7-solid:pen",
      tag: "time",
      content: () => props.art.publishDate,
    },
    {
      attr: "update-date",
      icon: "fa7-solid:clock-rotate-left",
      tag: "time",
      content: () => props.art.updateDate,
    },
  ];

  const filterred = computed(() => {
    return infos.filter(({ attr }) => props.attrs.includes(attr));
  });
</script>

<template>
  <ul
    class="novel-attributes"
    :class="{
      [`is-wrap`]: wrap,
      [`edge-fades-x no-scrollbar`]: !wrap,
    }"
  >
    <li v-for="{ icon, tag, content } in filterred" class="novel-attr">
      <iconify :name="icon"/>
      <component :is="tag ?? `span`">{{ toValue(content) }}</component>
    </li>
  </ul>
</template>

<style scoped>
  .novel-attributes {
    display: flex;
    column-gap: 18px;
    font-size: 12px;
    line-height: 20px;
    text-wrap: nowrap;
    color: var(--color-info);

    &.is-wrap {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .novel-attr {
    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
