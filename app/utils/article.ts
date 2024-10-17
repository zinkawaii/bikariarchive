import { reactive, type Reactive } from "vue";
import type { ArticleCover, JArticle, JArtmap, JChapter } from "@bikari/process";

export class Article implements JChapter {
    novel = "";           //小说名
    volume = -1;          //卷序号
    order = -1;           //章序号
    orderInVol = -1;      //章序号（卷内）
    index = "";           //章文件名
    title = "";           //章节名
    excerpt?: string;     //摘要
    cover?: ArticleCover; //封面
    date?: string;        //日期
    updated?: string;     //更新日期
    refactored?: string;  //重构日期
    draft = false;        //草稿
    encrypted = false;    //加密
    ending = false;       //终章
    sticky = Infinity;    //置顶
    wordCount = 0;        //字数

    private constructor(novel: string, order: number, raw: JChapter) {
        this.assign(novel, order, raw);
    }

    assign(novel: string, order: number, raw: JChapter) {
        //合并属性
        Object.assign(this, raw);
        this.novel = novel;
        this.order = order;

        //计算卷内序号
        this.orderInVol = Article.meta[novel].chapters
            .filter((n) => n.volume === raw.volume)
            .findIndex((n) => n.index === raw.index);

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
            name: "reader",
            params: {
                novel: this.novel,
                index: this.index
            }
        };
    }

    get novelInfo() {
        return Article.meta[this.novel];
    }

    get volumeInfo() {
        return this.novelInfo.volumes[this.volume];
    }

    get prev() {
        return this.novelInfo.chapters[this.order - 1];
    }

    get next() {
        return this.novelInfo.chapters[this.order + 1];
    }

    get isFirst() {
        return this.order === 0;
    }

    get isLast() {
        return this.order === this.novelInfo.chapters.length - 1;
    }

    get isFirstInVol() {
        return (this.prev?.volume ?? Number.NEGATIVE_INFINITY) < this.volume;
    }

    get isLastInVol() {
        return (this.next?.volume ?? Number.POSITIVE_INFINITY) > this.volume;
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
            new Article(novel, order, raw)
        );
    }
}

//将元数据引用注入原型
export function enrichJArticle(original: JArticle<JChapter>) {
    for (const novel in original) {
        const { chapters } = original[novel];
        const { chapters: articles } = Article.meta[novel] ?? original[novel];

        //全量覆盖
        Reflect.set(Article.meta, novel, original[novel]);

        //名称与序号的映射
        const hashs = new Map(
            chapters.map(({ index }, i) => [index, i])
        );

        //按名称对齐章节位置
        const results: Article[] = [...new Array(chapters.length)];
        for (const art of articles) {
            const i = hashs.get(art.index);

            //不存在时相当于删除章节
            if (i !== void 0) {
                results[i] = art instanceof Article
                    ? art.assign(novel, art.order, chapters[i])
                    : Article.for(novel, chapters[i].index);
            }
        }

        //挂载章节列表
        Article.meta[novel].chapters = results.map((art, i) => {
            return art ?? Article.for(novel, chapters[i].index);
        });
    }
}

export function guideToShelf(novel: string, volume: number) {
    const shelfStore = useShelfStore();
    const router = useRouter();

    shelfStore.selectNovel(novel);
    shelfStore.selectVolume(volume);
    router.push({
        name: "shelf"
    });
}