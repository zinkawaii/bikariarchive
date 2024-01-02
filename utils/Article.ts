import jArticle from "~/dist/json/Article.json";

type WithMetaAttrs = Partial<{
    volume: number,
    index: string,
    title: string,
    date: string,
    updated: string,
    refactored: string,
    ending: boolean,
    runtime: boolean,
    wordCount: number
}>;

class Article implements WithMetaAttrs {
    novel        = "";    //小说名
    volume       = -1;    //卷序号
    order        = -1;    //章序号
    orderInVol   = -1;    //章序号（卷内）
    index        = "";    //章文件名
    title        = "";    //章节名
    date         = null;  //日期
    updated      = null;  //更新日期
    refactored   = null;  //重构日期
    ending       = false; //终章标记
    runtime      = false; //运行时
    wordCount    = 0;     //字数
    error        = true;  //错误信息

    constructor(novel: string, index: string) {
        if (novel && index) {
            this.init(novel, index);
        }
    }

    init(novel: string, index: string) {
        this.novel = novel;
        this.index = index;
        this.error = true;

        //参数检测
        if (novel in jArticle) {
            const jNovel = jArticle[novel];
            const jChapter = jNovel.chapters;

            const order = jNovel.$map.indexOf(index);
            if (order === -1) {
                return;
            }

            const c = jChapter[order];
            Object.assign(this, c);
            this.order = order;
            this.error = false;

            //计算卷内序号
            const jChapterInVol = jChapter.filter((n) => n.volume === c.volume);
            for (const item of jChapterInVol) {
                this.orderInVol++;
                if (item.index === index) break;
            }
        }
    }

    get novelInfo() {
        return jArticle[this.novel];
    }

    get volumeInfo() {
        return this.novelInfo.volumes[this.volume];
    }

    get isFirst() {
        return this.order === 0;
    }

    get isLast() {
        return this.order === this.novelInfo.chapters.length - 1;
    }

    get isFirstInVol() {
        return (this.novelInfo.chapters[this.order - 1]?.volume ?? -Infinity) < this.volume;
    }

    get isLastInVol() {
        return (this.novelInfo.chapters[this.order + 1]?.volume ?? Infinity) > this.volume;
    }

    get lastIndex() {
        return this.novelInfo.chapters[this.order - 1].index;
    }

    get nextIndex() {
        return this.novelInfo.chapters[this.order + 1].index;
    }

    get publishDate() {
        return this.date ?? this.refactored ?? "很久以前";
    }

    get updateDate() {
        return this.updated ?? this.publishDate;
    }
}

export default Article;