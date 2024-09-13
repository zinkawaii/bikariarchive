import { resolve } from "node:path";
import chokidar from "chokidar";
import CryptoES from "crypto-es";
import fs from "fs-extra";
import { glob } from "glob";
import { isDev, timer } from "@bikari/shared";

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
    parse: (this: T, filename: string, cache: any, insert: boolean) => Promise<any>;
    unlink: (this: T, cache: any) => void;
    onCacheHit: (this: T, cache: any) => void;
    resolveFilelist?: (this: T, filelist: string[]) => string[];
    beforeBuild: (this: T) => void;
    beforeOutputMeta: (this: T) => any;
}

export default class Processor {
    jCache: Record<string, any>;
    jMeta: any;
    jMap: Record<string, any>;

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

    async build() {
        const parse = timer(this.options.sign, async () => {
            this.options.beforeBuild.call(this);

            //顺序处理源文件
            const filelist = await this.resolveFilelist();
            await Promise.all(
                filelist.map((filename, order) => this.parse(filename, order))
            );

            //输出元数据文件
            await this.outputMeta();
        });

        await parse();
    }

    async watch() {
        const parse = timer(this.options.sign, async (event: string, filename: string) => {
            if (event === "change" && !await this.parse(filename)) {
                return false;
            }
            else if (event === "add" && !await this.add(filename)) {
                return false;
            }
            else if (event === "unlink" && !await this.unlink(filename)) {
                return false;
            }
            await this.outputMeta();
        });

        const filelist = await this.resolveFilelist();
        const watcher = chokidar.watch(filelist, {});
        watcher.on("all", parse);
    }

    async parse(filename: string, order?: number, insert?: boolean) {
        const stats = await fs.stat(filename);
        const hash = resolveHash(stats.size.toString());

        let cache = this.jCache[filename];

        //当在开发环境下命中缓存时
        if (isDev && cache?.hash === hash) {
            await this.options.onCacheHit?.call(this, cache);
            return false;
        }

        //继承序号
        order ??= cache?.order;

        //重置缓存
        cache = { hash, order };

        //开始解析
        const data = await this.options.parse.call(this, filename, cache, insert);

        //显式返回空值时清空缓存
        this.jCache[filename] = data === null ? null : {
            ...cache,
            ...data || {}
        };
        return true;
    }

    async add(filename: string) {
        const cache = this.jCache[filename];

        //缓存存在时无需更新
        if (cache) {
            return false;
        }

        const filelist = await this.resolveFilelist();
        const order = filelist.indexOf(filename);

        //开始解析
        return await this.parse(filename, order, true);
    }

    async unlink(filename: string) {
        const cache = this.jCache[filename];

        //缓存不存在时无需更新
        if (!cache) {
            return false;
        }

        //执行自定义清理逻辑
        this.options.unlink?.call(this, cache);

        //清空缓存
        this.jCache[filename] = null;
        return true;
    }

    async resolveFilelist() {
        const filelist = await glob(this.sources, {
            windowsPathsNoEscape: true
        });
        return this.options.resolveFilelist?.call(this, filelist) as string[] ?? filelist;
    }

    async outputMeta() {
        const jMeta = this.options.beforeOutputMeta.call(this);

        //同步写入防止在监听时获取空字符串
        fs.outputJsonSync(this.cacheDir, this.jCache);
        fs.outputJsonSync(this.metaOutDir, jMeta);
        fs.outputJsonSync(this.mapOutDir, this.jMap);
    }
}

//从构建时间戳生成盐
declare const __TIME__: string;
const salt = CryptoES.MD5(__TIME__);

//合成大哈希
function resolveHash(text: string) {
    const hash = CryptoES.MD5(text + salt).toString();
    return hash;
}