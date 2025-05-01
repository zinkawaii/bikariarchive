import { reactive, type Reactive } from "vue";
import type { ArticleCover, ArticleVariant, Child, JArticle, JArtmap, JChapter } from "@bikari/article";
import type { PickOptional } from "~/types";

const defaults: PickOptional<JChapter> = {
    excerpt: void 0,
    date: void 0,
    updated: void 0,
    refactored: void 0,
    cover: void 0,
    variant: void 0,
    draft: false,
    encrypted: false,
    ending: false,
    sticky: Infinity,
};

export class Article implements JChapter {
    novel!: string;           //小说名
    volume!: number;          //卷序号
    order!: number;           //章序号
    orderInVol!: number;      //章序号（卷内）
    index!: string;           //章文件名
    title!: string;           //章节名
    excerpt?: Child[];        //摘要
    date?: string;            //日期
    updated?: string;         //更新日期
    refactored?: string;      //重构日期
    cover?: ArticleCover;     //封面
    variant?: ArticleVariant; //变体
    draft!: boolean;          //草稿
    encrypted!: boolean;      //加密
    ending!: boolean;         //终章
    sticky!: number;          //置顶
    wordCount!: number;       //字数

    private constructor(novel: string, order: number, raw: JChapter) {
        this.assign(novel, order, raw);
    }

    assign(novel: string, order: number, raw: JChapter) {
        //合并属性
        Object.assign(this, defaults, raw);
        this.novel = novel;
        this.order = order;

        //计算卷内序号
        this.orderInVol = Article.meta[novel].chapters
            .filter((n) => n.volume === raw.volume)
            .findIndex((n) => n.index === raw.index);

        //后备变体值
        this.variant ??= this.volumeInfo.variant;

        return this;
    }

    get publishDate() {
        return this.date ?? this.refactored ?? Article.FARAWAY;
    }

    get updateDate() {
        return this.updated ?? this.publishDate;
    }

    get route() {
        return {
            name: "article",
            params: {
                novel: this.novel,
                index: this.index,
            },
        };
    }

    get novelInfo() {
        return Article.meta[this.novel];
    }

    get volumeInfo() {
        return this.novelInfo.volumes[this.volume];
    }

    get prev(): Article | undefined {
        const prev = this.novelInfo.chapters[this.order - 1];
        if (this.novelInfo.type === "novel" || this.volume === prev?.volume) {
            return prev;
        }
        return void 0;
    }

    get next(): Article | undefined {
        const next = this.novelInfo.chapters[this.order + 1];
        if (this.novelInfo.type === "novel" || this.volume === next?.volume) {
            return next;
        }
        return void 0;
    }

    get isFirst() {
        return this.novelInfo.type === "novel"
            ? this.order === 0
            : this.isFirstInVol;
    }

    get isLast() {
        return this.novelInfo.type === "novel"
            ? this.order === this.novelInfo.chapters.length - 1
            : this.isLastInVol;
    }

    get isFirstInVol() {
        return (this.prev?.volume ?? -Infinity) < this.volume;
    }

    get isLastInVol() {
        return (this.next?.volume ?? Infinity) > this.volume;
    }

    static FARAWAY = "很久以前";

    static meta = reactive({} as JArticle<Article>);
    static map: JArtmap;

    //根据参数获取章节单例
    static for(novel: string, index: string): Reactive<Article>;
    static for(novel: MaybeRefOrGetter<string>, index: MaybeRefOrGetter<string>): ComputedRef<Article>;
    static for(novel: MaybeRefOrGetter<string>, index: MaybeRefOrGetter<string>) {
        if (typeof novel !== "string" || typeof index !== "string") {
            return computed(() => {
                const novelVal = toValue(novel) ?? "";
                const indexVal = toValue(index) ?? "";
                return Article.for(novelVal, indexVal);
            });
        }

        const jNovel = this.meta[novel];
        if (!jNovel) {
            return null;
        }

        const order = jNovel.chapters.findIndex((c) => c.index === index);
        if (order === -1) {
            return null;
        }

        const raw = jNovel.chapters[order];
        return raw instanceof Article ? raw : reactive(
            new Article(novel, order, raw),
        );
    }
}

//将元数据引用注入原型
export function enrichJArticle(original: JArticle) {
    for (const novel in original) {
        const { chapters } = original[novel];
        const { chapters: articles } = Article.meta[novel] ?? original[novel];

        //全量覆盖
        Object.assign(Article.meta[novel] ??= {} as any, original[novel]);

        //名称与序号的映射
        const hashs = new Map(
            chapters.map(({ index }, i) => [index, i]),
        );

        //按名称对齐章节位置
        const results: Article[] = [...new Array(chapters.length)];
        for (const art of articles) {
            const i = hashs.get(art.index);

            //不存在时相当于删除章节
            if (i !== void 0) {
                results[i] = art instanceof Article
                    ? art.assign(novel, i, chapters[i])
                    : Article.for(novel, chapters[i].index);
            }
        }

        //挂载章节列表
        Article.meta[novel].chapters = results.map((art, i) => {
            return art ?? Article.for(novel, chapters[i].index);
        });
    }
}
