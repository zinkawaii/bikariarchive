<script lang="ts" setup>
  const props = defineProps<{
    target: HTMLElement | null;
  }>();

  interface HeadingInfo {
    element: HTMLHeadingElement;
    title: string;
    link: string;
    level: number;
    order: string;
    children: HeadingInfo[];
  }

  const { height } = useElementSize(document?.body);

  const activeIdx = ref(0);
  const flatHeadings = shallowRef<HeadingInfo[]>([]);
  const nestedHeadings = shallowRef<HeadingInfo[]>([]);

  const activeLink = computed(() => {
    return flatHeadings.value[activeIdx.value]?.link;
  });

  const headingOffsets = computedWithControl([flatHeadings, height], () => {
    return flatHeadings.value?.map(({ element, link }) => ({
      link,
      top: Math.floor(getPosition(element).top),
    })) ?? [];
  });

  //列表模板重用
  const [DefineOutlineList, OutlineList] = createReusableTemplate<{
    headings: HeadingInfo[];
  }>({
    inheritAttrs: false,
  });

  whenever(() => props.target, (el) => {
    const headingEls = el.querySelectorAll<HTMLHeadingElement>(`:where(h2, h3):not(.sr-only)`);

    flatHeadings.value = Array.from(headingEls, (el) => ({
      element: el,
      title: el.textContent!,
      link: "#" + el.id,
      level: Number(el.tagName[1]),
      order: "",
      children: [],
    })).filter(({ link, level }) => link.length > 1 && level <= 3);

    nestedHeadings.value = [];

    for (let i = 0; i < flatHeadings.value.length; i++) {
      const curr = flatHeadings.value[i];
      if (curr.level === 2) {
        curr.order = `${nestedHeadings.value.length + 1}`;
        nestedHeadings.value.push(curr);
        continue;
      }
      for (let j = i - 1; j >= 0; j--) {
        const prev = flatHeadings.value[j];
        if (prev.level < curr.level) {
          curr.order = `${prev.order}.${prev.children.length + 1}`;
          prev.children.push(curr);
          break;
        }
      }
    }
  }, {
    immediate: true,
  });

  //页面滚动时
  useEventListener("scroll", Zin.throttle(() => {
    const { scrollY, innerHeight } = window;

    if (!headingOffsets.value.length || scrollY < 1) {
      activeIdx.value = 0;
      return;
    }

    activeIdx.value = headingOffsets.value.length - 1;
    if (Math.abs(scrollY + innerHeight - height.value) < 1) {
      return;
    }

    for (let i = 0; i < headingOffsets.value.length; i++) {
      if (headingOffsets.value[i].top > scrollY + 80) {
        activeIdx.value = Math.max(0, i - 1);
        return;
      }
    }
  }));
</script>

<template>
  <define-outline-list v-slot="{ headings }">
    <ul class="outline-list">
      <li v-for="{ title, link, order, children } in headings" class="outline-item">
        <a
          class="aside-anchor text-truncate"
          :class="{ [`is-active`]: link === activeLink }"
          :href="link"
        >
          <span class="outline-order">{{ order }}</span>
          <span>{{ title }}</span>
        </a>
        <outline-list v-if="children.length" :headings="children"/>
      </li>
    </ul>
  </define-outline-list>
  <aside-unified title="目录">
    <template #icon>
      <iconify name="fa7-solid:list-numeric"/>
    </template>
    <div v-if="nestedHeadings.length" class="aside-limited">
      <div class="outline-track">
        <div class="outline-thumb" :style="{ translate: `0 ${activeIdx * 30}px` }"></div>
      </div>
      <outline-list v-bind="{ headings: nestedHeadings }"/>
    </div>
    <p v-else class="outline-empty p-small">这篇文章还没有目录哦~</p>
  </aside-unified>
</template>

<style lang="scss" scoped>
  .aside-limited {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .outline-track {
    width: 3px;
    background-color: var(--color-gray-800);
  }

  .outline-thumb {
    height: 30px;
    border-radius: var(--rounded-full);
    background-color: var(--color-theme-dark);
    transition: translate 0.12s;
  }

  .outline-item {
    display: grid;
    position: relative;

    > .outline-list {
      margin-left: 14px;
    }
  }

  .aside-anchor {
    padding-left: 22px;

    &.is-active {
      color: var(--color-theme-text);
    }
  }

  .outline-order {
    position: absolute;
    opacity: 0.5;
    right: calc(100% - 16px);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
  }

  .outline-empty {
    padding: 0 0 16px 16px;
    color: var(--color-info);
  }
</style>
