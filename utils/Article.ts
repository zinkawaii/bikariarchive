import jArticle from "~/dist/json/Article.json";

class Article
{
    novel        = "";   //小说名
    volOrder     = -1;   //卷序号
    volName      = "";   //卷名
    order        = -1;   //章序号
    order_in_vol = -1;   //章序号（卷内）
    index        = "";   //章文件名
    title        = "";   //章节名
    date         = {};   //日期
    wordCount    = 0;    //总字数
    error        = true; //错误信息

    constructor(novel: string, index: string)
    {
        if (novel && index) {
            this.init(novel, index);
        }
    }

    init(novel: string, index: string)
    {
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
                        reco: c.date_reco
                    };
                    this.wordCount = c.wordCount;
                    this.error = false;
                    break;
                }
            }
        }
    }

    get novelInfo()
    {
        return jArticle[this.novel];
    }

    get isFirst()
    {
        return this.order === 0;
    }

    get isLast()
    {
        return this.order === jArticle[this.novel].chapter.length - 1;
    }

    getLastIndex()
    {
        return jArticle[this.novel].chapter[this.order - 1].index;
    }

    getNextIndex()
    {
        return jArticle[this.novel].chapter[this.order + 1].index;
    }
}

export default Article;