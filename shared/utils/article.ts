import { computed, type ComputedRef, type MaybeRefOrGetter, reactive, shallowRef, toValue } from "vue";
import type { JArticle, JArtmap, JChapter, JNovel, JVolume } from "@bikari/article";
import type { RouteLocationRaw } from "vue-router";
import type { WithRequired } from "#shared/types";

export class Article {
  static meta = reactive({} as JArticle<Article>);
  static map: JArtmap;

  static FARAWAY = "很久以前";

  //根据参数获取章节单例
  static for(novel: string, index: string): Article;
  static for(novel: MaybeRefOrGetter<string>, index: MaybeRefOrGetter<string>): ComputedRef<Article>;
  static for(novel: MaybeRefOrGetter<string>, index: MaybeRefOrGetter<string>) {
    if (typeof novel !== "string" || typeof index !== "string") {
      return computed(() => {
        const novelVal = toValue(novel) ?? "";
        const indexVal = toValue(index) ?? "";
        return Article.for(novelVal, indexVal);
      });
    }
    return this.meta[novel]?.chapters.find((art) => art.index === index);
  }
}

export interface Article extends WithRequired<
  JChapter,
    "date" | "variant" | "draft" | "encrypted" | "ending" | "sticky"
> {
  raw: JChapter;
  novel: string;
  novelInfo: JNovel<Article>;
  volumeInfo: JVolume;
  order: number;
  createDate: string;
  publishDate: string;
  updateDate: string;
  prev?: Article;
  next?: Article;
  isFirstInVol: boolean;
  isLastInVol: boolean;
  isFirst: boolean;
  isLast: boolean;
  route: RouteLocationRaw;
}

function createArticle(...args: [novel: string, raw: JChapter]): Article {
  //原始数据
  const raw = shallowRef(args[1]);

  //书籍名称
  const novel = args[0];

  //书籍信息
  const novelInfo = computed(() => Article.meta[novel]);

  //卷册序号
  const volume = computed(() => raw.value.volume);

  //卷册信息
  const volumeInfo = computed(() => novelInfo.value.volumes[raw.value.volume]);

  //章节名称
  const index = computed(() => raw.value.index);

  //章节序号
  const order = computed(() => {
    return novelInfo.value.chapters.findIndex((art) => art.index === index.value);
  });

  //章节名称
  const title = computed(() => raw.value.title);

  //摘要
  const excerpt = computed(() => raw.value.excerpt);

  //日期
  const date = computed(() => raw.value.date ?? {});

  //创建日期
  const createDate = computed(() => {
    return date.value.created ?? date.value.refactored ?? Article.FARAWAY;
  });

  //发布日期
  const publishDate = computed(() => {
    return date.value.published ?? createDate.value;
  });

  //更新日期
  const updateDate = computed(() => {
    return date.value.updated ?? publishDate.value;
  });

  //封面
  const cover = computed(() => raw.value.cover);

  //变体
  const variant = computed(() => raw.value.variant ?? volumeInfo.value.variant ?? `article`);

  //草稿
  const draft = computed(() => raw.value.draft ?? false);

  //加密
  const encrypted = computed(() => raw.value.encrypted ?? false);

  //终章
  const ending = computed(() => raw.value.ending ?? false);

  //置顶
  const sticky = computed(() => raw.value.sticky ?? Infinity);

  //字数
  const wordCount = computed(() => raw.value.wordCount);

  //上一章节
  const prev = computed(() => {
    const prev = novelInfo.value.chapters[order.value - 1];
    if (novelInfo.value.type === "novel" || volume.value === prev?.volume) {
      return prev;
    }
  });

  //下一章节
  const next = computed(() => {
    const next = novelInfo.value.chapters[order.value + 1];
    if (novelInfo.value.type === "novel" || volume.value === next?.volume) {
      return next;
    }
  });

  //是否为卷内起始章节
  const isFirstInVol = computed(() => {
    return (prev.value?.volume ?? -Infinity) < volume.value;
  });

  //是否为卷内最终章节
  const isLastInVol = computed(() => {
    return (next.value?.volume ?? Infinity) > volume.value;
  });

  //是否为起始章节
  const isFirst = computed(() => {
    return novelInfo.value.type === "novel"
      ? order.value === 0
      : isFirstInVol.value;
  });

  //是否为最终章节
  const isLast = computed(() => {
    return novelInfo.value.type === "novel"
      ? order.value === novelInfo.value.chapters.length - 1
      : isLastInVol.value;
  });

  //路由
  const route = computed<RouteLocationRaw>(() => ({
    name: "article",
    params: {
      novel,
      index: index.value,
    },
  }));

  return reactive({
    raw,
    novel,
    novelInfo,
    volume,
    volumeInfo,
    index,
    order,
    title,
    excerpt,
    date,
    createDate,
    publishDate,
    updateDate,
    cover,
    variant,
    draft,
    encrypted,
    ending,
    sticky,
    wordCount,
    prev,
    next,
    isFirstInVol,
    isLastInVol,
    isFirst,
    isLast,
    route,
  });
}

//将元数据引用注入原型
export function enrichJArticle(original: JArticle) {
  for (const novel in original) {
    const articles = Object.fromEntries(
      Article.meta[novel]?.chapters.map((art) => [art.index, art]) ?? [],
    );

    Article.meta[novel] = structuredClone(original[novel]) as any;

    const { chapters } = original[novel];
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];

      let art = articles[chapter.index];
      if (art !== void 0) {
        art.raw = chapter;
      }
      else {
        art = createArticle(novel, chapter);
      }
      Article.meta[novel].chapters[i] = art;
    }
  }
}
