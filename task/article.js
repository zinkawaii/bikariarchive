import cheerio from "cheerio";
import chokidar from "chokidar";
import consola from "consola";
import dayjs from "dayjs";
import fm from "front-matter";
import fs from "fs-extra";
import * as glob from "glob";
import * as marked from "marked";
import * as path from "path";

const srcDir = "../data/novel";
const outDir = "../dist/novel";

(async () => {
    marked.use({
        renderer: {
            heading(text, level) {
                return `<h${level} class="content-h${level}">${text}</h${level}>\n`;
            },
            code(code, infostring) {
                return `<mb-code lang="${infostring}">${code}</mb-code>\n`;
            },
            link(href, title, text) {
                let extra;
                if (!href.startsWith("/")) {
                    extra = `target="_blank" rel="noopener noreferrer nofollow"`;
                }
                return `<a href="${href}" ${title ? `title=${title}` : ""} ${extra}>${text}</a>`;
            },
            text(text) {
                return text.replaceAll("\n", "");
            }
        },
        hooks: {
            postprocess(html) {
                return html.replaceAll(/<br(\s*)\/>/g, "<p><br /></p>");
            }
        }
    });

    //从元信息和Front Matter生成全文和Article.json
    await timer("Meta-Info", generateMetaInfo)();

    //解析函数
    const parse = timer("Markdown", simpleParse);

    //监听
    chokidar.watch([`${srcDir}/**/*.md`])
    .on("change", parse);
})();

function simpleParse(pathname, stats)
{
    const file = fs.readFileSync(pathname);
    const data = fm(String(file));
    const result = marked.parse(data.body);

    const outPath = pathname.replaceAll("\\", "/").replace(srcDir, outDir).replace(".md", ".txt");
    fs.outputFileSync(outPath, result);
}

function generateMetaInfo()
{
    const jFile = fs.readFileSync("../assets/json/Article.json");
    const jMeta = JSON.parse(jFile);

    const re = /^(.*?)\.(\d+)$/;
    const filelist = glob.globSync(`${srcDir}/**/*.md`);

    filelist.forEach((pathname) => {
        const match = path.basename(path.resolve(pathname, "..")).match(re);
        const novel = match[1].toLowerCase();
        const volume = Number(match[2]);
        const index = path.basename(pathname, ".md");
        const order = jMeta[novel].chapter.indexOf(index);

        //读取数据
        const file = fs.readFileSync(pathname);
        const {
            attributes: attr,
            body: data
        } = fm(file.toString());

        //解析内容
        const result = marked.parse(data);
        const $ = cheerio.load(result);
        const wordCount = $("p").text().length;

        //写入正文
        const outPath = pathname.replaceAll("\\", "/").replace(srcDir, outDir).replace(".md", ".txt");
        fs.outputFileSync(outPath, result);

        //日期格式化
        dateFormat(attr, ["date", "date_reco"]);

        //写入数据
        jMeta[novel].chapter[order] = {
            index,
            volume,
            wordCount,
            ...attr
        };
    });

    //输出到文件
    const result = JSON.stringify(jMeta);
    fs.outputFileSync("../dist/json/Article.json", result);

    //日期格式化
    function dateFormat(obj, keys) {
        keys.forEach((key) => {
            if (Reflect.has(obj, key)) {
                obj[key] = dayjs(obj[key]).format("YYYY-MM-DD");
            }
        });
    }
}

//统计执行时长
function timer(sign, func)
{
    return async function(...arg)
    {
        //开始标记
        performance.mark("start");

        //运行函数
        await func.call(this, ...arg);

        //结束标记
        performance.mark("end");

        //计算时长
        const measure = performance.measure("full", "start", "end");
        consola.success(`${sign} -- ${measure.duration.toFixed(0)}ms`);
    };
}