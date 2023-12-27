import cheerio from "cheerio";
import chokidar from "chokidar";
import consola from "consola";
import dayjs from "dayjs";
import fm from "front-matter";
import fs from "fs-extra";
import * as glob from "glob";
import * as marked from "marked";
import * as path from "path";

marked.use({
    renderer: {
        heading(text, level) {
            return `<h${level}>${text}</h${level}>\n`;
        },
        code(code, infostring) {
            return `<mb-code lang="${infostring}"><pre>${code}</pre></mb-code>\n`;
        },
        link(href, title, text) {
            let extra;
            if (!href.startsWith("/")) {
                extra = `target="_blank" rel="noopener noreferrer nofollow"`;
            }
            return `<a class="coco-link" href="${href}" ${title ? `title=${title}` : ""} ${extra}>${text}</a>`;
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

const srcDir = "../data/novel";
const outDir = "../dist/novel";

const metaSrcDir = "../assets/json/Article.json";
const metaOutDir = "../dist/json/Article.json";
const mapOutDir = "../dist/json/Artmap.json";

(async () => {
    //从元信息和Front Matter生成全文和Article.json
    await timer("Meta-Info", generateMetaInfo)();

    //解析函数
    const parse = timer("Markdown", simpleParse);

    //监听
    chokidar.watch([`${srcDir}/**/*.md`])
    .on("change", parse);
})();

//单文件解析
function simpleParse(pathname) {
    const file = fs.readFileSync(pathname);
    const data = fm(file.toString());
    const result = marked.parse(data.body);

    //写入文件
    const outPath = pathname.replaceAll("\\", "/").replace(srcDir, outDir).replace(".md", ".txt");
    fs.outputFileSync(outPath, result);

    //返回数据供进一步处理
    return data;
}

function generateMetaInfo() {
    const jFile = fs.readFileSync(metaSrcDir);
    const jMeta = JSON.parse(jFile);

    const re = /^(.*?)\.(\d+)$/;
    const filelist = glob.globSync(`${srcDir}/**/*.md`);

    //序号与文件名的映射表
    const jMap = {};
    for (const key in jMeta) {
        jMap[key] = {};

        //在元数据中按顺序填入<blog>文章
        if (jMeta[key].type === "blog") {
            jMeta[key].chapter = [];
            filelist
            .filter((pathname) => pathname.includes(key[0].toUpperCase() + key.slice(1)))
            .sort((a, b) => a.localeCompare(b))
            .forEach((pathname) => {
                const filename = path.basename(pathname, ".md");
                jMeta[key].chapter.push(filename);
            });
        }
    }

    for (const pathname of filelist) {
        const match = path.basename(path.resolve(pathname, "..")).match(re);
        const novel = match[1].toLowerCase();
        const volume = Number(match[2]);
        const filename = path.basename(pathname, ".md");
        const order = jMeta[novel].chapter.indexOf(filename);

        //将正文写入文件并读取数据
        const data = simpleParse(pathname);
        const {
            attributes,
            body
        } = data;

        //解析内容
        const result = marked.parse(body);
        const $ = cheerio.load(result);
        const runtime = [...$("*")].some((e) => e?.name?.includes("-")) || void(0);
        const wordCount = $("p").text().length;

        //日期格式化
        dateFormat(attributes, ["date", "refactored"]);

        //生成映射
        const index = {
            novel: filename,
            blog: attributes.abbrlink
        }[jMeta[novel].type];
        jMap[novel][index] = filename;

        //写入数据
        jMeta[novel].chapter[order] = {
            index,
            volume,
            runtime,
            wordCount,
            ...attributes
        };
    }

    //输出到文件
    fs.outputFileSync(metaOutDir, JSON.stringify(jMeta));
    fs.outputFileSync(mapOutDir, JSON.stringify(jMap));

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
function timer(sign, func) {
    return async function(...arg) {
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