import { notNullish } from "@vueuse/core";
import type { NovelType } from "@bikari/article";

export interface UseArticleListOptions {
  type?: MaybeRefOrGetter<NovelType>;
  sizes?: MaybeRefOrGetter<number>;
  sortBy?: MaybeRefOrGetter<string>;
  sticky?: MaybeRefOrGetter<boolean>;
}

export function useArticleList(options: UseArticleListOptions) {
  // 筛选类型
  const type = toRef(options.type);

  // 排序字段
  const sortBy = computed(() => {
    return [toValue(options.sortBy), "published", "created"].filter(notNullish);
  });

  // 是否显示置顶
  const sticky = toRef(options.sticky);

  // 总列表
  const totals = computed(() => {
    const arr = Object.values(Article.meta)
      .filter((item) => !type.value || item.type === type.value)
      .flatMap(({ chapters }) => chapters)
      .sort((a, b) => {
        const x = sortBy.value.reduce((x, prop) => x ?? Reflect.get(a.date, prop), void 0);
        const y = sortBy.value.reduce((y, prop) => y ?? Reflect.get(b.date, prop), void 0);
        return x && y ? y.localeCompare(x) : x ? -1 : 1;
      });

    if (sticky.value) {
      arr.sort((a, b) => a.sticky - b.sticky);
    }

    return arr;
  });

  const { page, total, sizes, paginatedList: articles } = usePagination(totals, {
    sizes: options.sizes,
  });

  return {
    page,
    total,
    sizes,
    articles,
  };
}
