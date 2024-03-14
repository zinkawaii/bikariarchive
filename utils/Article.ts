import ArticleJson from "~/dist/json/Article.json";

const jArticle: {
    [novel: string]: JNovel
} = ArticleJson as any;

export interface JNovel {
    author: string,
    title: string,
    type: "novel" | "blog",
    tag: string[],
    synopsis: string,
    cover: string,
    volumes: JVolume[],
    chapters: Article[]
}

export interface JVolume {
    title: string,
    ending: boolean
}

export interface JChapter {
    index: string,
    volume: number,
    title: string,
    date?: string,
    refactored?: string,
    updated?: string,
    draft?: boolean,
    ending?: boolean,
    runtime?: boolean,
    wordCount: number
}

class Article implements JChapter {
    novel      = "";    //小说名
    volume     = -1;    //卷序号
    order      = -1;    //章序号
    orderInVol = -1;    //章序号（卷内）
    index      = "";    //章文件名
    title      = "";    //章节名
    date       = "";    //日期
    updated    = "";    //更新日期
    refactored = "";    //重构日期
    draft      = false; //草稿
    ending     = false; //终章
    runtime    = false; //运行时
    wordCount  = 0;     //字数

    private constructor(novel: string, order: number) {
        const jNovel = jArticle[novel];

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
        return jArticle[this.novel];
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
        return (this.prev?.volume ?? -Infinity) < this.volume;
    }

    get isLastInVol() {
        return (this.next?.volume ?? Infinity) > this.volume;
    }

    static FARAWAY = "很久以前";

    //根据参数获取章节单例
    static for(novel: string, index: string) {
        const jNovel = jArticle[novel];
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

//类化章节项
for (const novel in jArticle) {
    const jNovel = jArticle[novel];

    jNovel.chapters = jNovel.chapters.map((item) => {
        return Article.for(novel, item.index);
    });
}

export default Article;
export {
    Article,
    jArticle
};