import jArticle from "~/dist/json/Article.json";

class Article {
    novel        = "";    //小说名
    volOrder     = -1;    //卷序号
    volName      = "";    //卷名
    order        = -1;    //章序号
    order_in_vol = -1;    //章序号（卷内）
    index        = "";    //章文件名
    title        = "";    //章节名
    date         = {};    //日期
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
        if (jArticle[novel]) {
            const jNovel = jArticle[novel];
            const jVolume = jNovel.volume;
            const jChapter = jNovel.chapter;

            //用于计算卷内章序号
            const temp = {
                vol: 0,
                order: -1
            };

            for (let i = 0; i < jChapter.length; i++) {
                const c = jChapter[i];

                if (c.volume !== temp.vol) {
                    temp.vol++, temp.order = 0;
                }
                else {
                    temp.order++;
                }
                if (c.index === index) {
                    this.volOrder = c.volume;
                    this.volName = jVolume[this.volOrder].title;
                    this.order = i;
                    this.order_in_vol = temp.order;
                    this.title = c.title;
                    this.date = {
                        publish: c.date,
                        refactor: c.refactor
                    };
                    this.ending = c.ending;
                    this.runtime = c.runtime;
                    this.wordCount = c.wordCount;
                    this.error = false;
                    break;
                }
            }
        }
    }

    get novelInfo() {
        return jArticle[this.novel];
    }

    get isFirst() {
        return this.order === 0;
    }

    get isLast() {
        return this.order === this.novelInfo.chapter.length - 1;
    }

    get isFirstInVol() {
        return (this.novelInfo.chapter[this.order - 1]?.volume ?? -Infinity) < this.volOrder;
    }

    get isLastInVol() {
        return (this.novelInfo.chapter[this.order + 1]?.volume ?? Infinity) > this.volOrder;
    }

    get lastIndex() {
        return this.novelInfo.chapter[this.order - 1].index;
    }

    get nextIndex() {
        return this.novelInfo.chapter[this.order + 1].index;
    }
}

export default Article;