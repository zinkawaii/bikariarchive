import type { JArticle, JArtmap, JChapter } from "@bikari/process";

export class Article implements JChapter {
    novel = "";        //小说名
    volume = -1;       //卷序号
    order = -1;        //章序号
    orderInVol = -1;   //章序号（卷内）
    index = "";        //章文件名
    title = "";        //章节名
    excerpt = "";      //摘要
    date = "";         //日期
    updated = "";      //更新日期
    refactored = "";   //重构日期
    cover = "";        //封面链接
    draft = false;     //草稿
    encrypted = false; //加密
    ending = false;    //终章
    runtime = false;   //运行时
    sticky = Infinity; //置顶
    wordCount = 0;     //字数

    private constructor(novel: string, order: number) {
        const jNovel = Article.meta[novel];

        //转置类型
        const jChapters = jNovel.chapters as JChapter[];

        //合并属性
        const c = jChapters[order];
        Object.assign(this, c);
        this.novel = novel;
        this.order = order;

        //计算卷内序号
        this.orderInVol = jChapters
            .filter((n) => n.volume === c.volume)
            .findIndex((n) => n.index === c.index);
    }

    get publishDate() {
        return this.date || this.refactored || Article.FARAWAY;
    }

    get updateDate() {
        return this.updated || this.publishDate;
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

    static meta: JArticle<Article>;
    static map: JArtmap;

    //根据参数获取章节单例
    static for(novel: string, index: string) {
        const jNovel = this.meta[novel];
        if (!jNovel) {
            throw new Error("[novel] is invalid.");
        }

        const order = jNovel.chapters.findIndex((c) => c.index === index);
        if (order === -1) {
            throw new Error("[index] is invalid.");
        }

        const jChapter = jNovel.chapters[order];
        return (jChapter instanceof Article) ? jChapter : new Article(novel, order);
    }
}

export function enrichJArticle(original: any) {
    //将元数据引用注入原型
    Article.meta = original;

    //类化章节项
    for (const [novel, jNovel] of Object.entries(Article.meta)) {
        jNovel.chapters = jNovel.chapters.map((item) => {
            return Article.for(novel, item.index);
        });
    }
}

export function guideToShelf(novel: string, volume: number) {
    const router = useRouter();
    const shelfStore = useShelfStore();

    shelfStore.selectNovel(novel);
    shelfStore.selectVolume(volume);
    router.push({
        name: "shelf"
    });
}