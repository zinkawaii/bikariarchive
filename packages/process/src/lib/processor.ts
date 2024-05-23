import { resolve } from "node:path";
import chokidar from "chokidar";
import CryptoES from "crypto-es";
import fs from "fs-extra";
import { glob } from "glob";
import { timer } from "@bikari/shared";

interface ProcessorOptions<T> {
    sign: string;
    source: {
        src: string;
        out: string;
        pattern: string;
    };
    meta: {
        src: string;
        out: string;
    };
    map: {
        out: string;
    };
    parse: (this: T, filename: string, cache: any) => Promise<void>;
    onCacheHit?: (this: T, cache: any) => void;
    beforeBuild: (this: T, filelist: string[]) => void;
    beforeOutputMeta?: (this: T) => any;
}

export default class Processor {
    jCache: any;
    jMeta: any;
    jMap: any;

    cacheDir: string;
    metaSrcDir: string;
    metaOutDir: string;
    mapOutDir: string;

    sourceSrcDir: string;
    sourceOutDir: string;
    sources: string;

    constructor(
        public options: ProcessorOptions<Processor>
    ) {
        this.cacheDir = resolve("dist/cache", `${this.options.sign}.json`);
        this.metaSrcDir = resolve(options.meta.src);
        this.metaOutDir = resolve(options.meta.out);
        this.mapOutDir = resolve(options.map.out);

        this.jCache = fs.existsSync(this.cacheDir) && fs.readJSONSync(this.cacheDir) || {};
        this.jMeta = fs.readJsonSync(this.metaSrcDir);
        this.jMap = {};

        this.sourceSrcDir = resolve(options.source.src);
        this.sourceOutDir = resolve(options.source.out);
        this.sources = resolve(this.sourceSrcDir, options.source.pattern);
    }

    build() {
        const parse = timer(this.options.sign, async (filelist: string[]) => {
            //生成处理文件列表
            this.options.beforeBuild.call(this, filelist);

            //顺序处理源文件
            await Promise.all(
                filelist.map(this.parse.bind(this))
            );

            //输出元数据文件
            await this.outputMeta();
        });

        return glob(this.sources, {
            windowsPathsNoEscape: true
        }).then(parse);
    }

    watch() {
        const parse = timer(this.options.sign, async (filename: string) => {
            await this.parse(filename) &&
            await this.outputMeta();
        });

        chokidar.watch(this.sources)
        .on("change", parse);
    }

    async parse(filename: string, order?: number) {
        const stats = await fs.stat(filename);
        const hash = resolveHash(stats.size.toString());

        //当命中缓存时
        let cache = this.jCache[filename];
        if (cache?.hash === hash) {
            await this.options.onCacheHit?.call(this, cache);
            return false;
        }

        //重置缓存
        cache = this.jCache[filename] = { hash, order };

        //开始解析
        await this.options.parse.call(this, filename, cache);
        return true;
    }

    async outputMeta() {
        const jMeta = this.options.beforeOutputMeta?.call(this) || this.jMeta;

        //同步写入防止在监听时获取空字符串
        fs.outputJsonSync(this.cacheDir, this.jCache);
        fs.outputJsonSync(this.metaOutDir, jMeta);
        fs.outputJsonSync(this.mapOutDir, this.jMap);
    }
}

//从代码文件本身生成盐
const path = resolve(__dirname, "index.js");
const file = fs.readFileSync(path);
const salt = CryptoES.MD5(file.toString());

//合成大哈希
function resolveHash(text: string) {
    const hash = CryptoES.MD5(text + salt).toString();
    return hash;
}