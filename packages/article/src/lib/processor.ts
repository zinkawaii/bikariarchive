import { resolve } from "node:path";
import { isDev, timer } from "@bikari/shared";
import chokidar from "chokidar";
import CryptoES from "crypto-es";
import fs from "fs-extra";
import { glob } from "glob";

interface ProcessorOptions<T> {
    sign: string;
    source: {
        base: string;
        dist: string;
        folders: string[];
        ext: string;
    };
    meta?: {
        src?: string;
        out: string;
    };
    map?: {
        out: string;
    };
    parse: (this: T, filename: string) => Promise<any>;
    unlink?: (this: T, cache: any) => void;
    onCacheHit?: (this: T, cache: any) => void;
    onMetaUpdate?: (this: T, newVal: any, oldVal: any) => any;
    beforeBuild?: (this: T) => void;
    beforeOutputMeta?: (this: T) => any;
}

export default class Processor {
    jCache: Record<string, any>;
    jMeta: any;
    jMap: Record<string, any>;

    cacheDir: string;
    metaSrcDir?: string;
    metaOutDir?: string;
    mapOutDir?: string;

    sourceBase: string;
    sourceDist: string;
    sourceFolders: string[];
    sourceGlob: string[];

    constructor(
        public options: ProcessorOptions<Processor>
    ) {
        this.cacheDir = resolve("dist/cache", `${this.options.sign}.json`);
        this.jCache = fs.existsSync(this.cacheDir) && fs.readJSONSync(this.cacheDir) || {};

        if (options.meta) {
            if (options.meta.src) {
                this.metaSrcDir = resolve(options.meta.src);
                this.jMeta = fs.readJSONSync(this.metaSrcDir);
            }
            else {
                this.jMeta = {};
            }
            this.metaOutDir = resolve(options.meta.out);
        }

        if (options.map) {
            this.mapOutDir = resolve(options.map.out);
            this.jMap = {};
        }

        this.sourceBase = resolve(options.source.base);
        this.sourceDist = resolve(options.source.dist);
        this.sourceFolders = options.source.folders.map((f) => resolve(this.sourceBase, f));
        this.sourceGlob = this.sourceFolders.map((p) => resolve(p, `**/*${options.source.ext}`));
    }

    async build() {
        const parse = timer(this.options.sign, async () => {
            this.options.beforeBuild?.call(this);

            //顺序处理源文件
            const filelist = await glob(this.sourceGlob, {
                windowsPathsNoEscape: true
            });
            filelist.sort((a, b) => a.localeCompare(b));

            await Promise.all(
                filelist.map((filename) => this.parse(filename))
            );

            //输出元数据文件
            this.outputMeta();
        });

        await parse();
    }

    async watch() {
        chokidar.watch(this.sourceFolders, {
            ignoreInitial: true
        })
        .on("all", timer(this.options.sign, async (event: string, filename: string) => {
            if (!filename.endsWith(this.options.source.ext)) {
                return false;
            }
            if (event === "change" && !await this.parse(filename)) {
                return false;
            }
            else if (event === "add" && !await this.add(filename)) {
                return false;
            }
            else if (event === "unlink" && !await this.unlink(filename)) {
                return false;
            }
            this.outputMeta();
        }));

        if (this.metaSrcDir) {
            chokidar.watch(this.metaSrcDir, {
                ignoreInitial: true
            })
            .on("change", timer(this.options.sign, async () => {
                const newVal = await fs.readJson(this.metaSrcDir);
                this.jMeta = this.options.onMetaUpdate?.call(this, newVal, this.jMeta);
                this.outputMeta();
            }));
        }
    }

    async parse(filename: string) {
        const stats = fs.statSync(filename);
        const hash = resolveHash(stats.size.toString());

        let cache = this.jCache[filename];

        //当在开发环境下命中缓存时
        if (isDev && cache?.hash === hash) {
            await this.options.onCacheHit?.call(this, cache);
            return false;
        }

        //重置缓存
        cache = { hash };

        //开始解析
        const data = await this.options.parse.call(this, filename);

        if (data !== null) {
            cache = {
                ...cache,
                ...data ?? {}
            };
            //执行一次命中缓存的逻辑
            await this.options.onCacheHit?.call(this, cache);
            this.jCache[filename] = cache;
        }
        else {
            //显式返回空值时清理数据
            this.unlink(filename);
        }
        return true;
    }

    async add(filename: string) {
        const cache = this.jCache[filename];

        //缓存存在时无需更新
        if (cache) {
            return false;
        }

        //开始解析
        return await this.parse(filename);
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

    outputMeta() {
        const jMeta = this.options.beforeOutputMeta?.call(this) ?? this.jMeta;

        //同步写入防止在监听时获取空字符串
        fs.outputJsonSync(this.cacheDir, this.jCache);

        if (this.options.meta) {
            fs.outputJsonSync(this.metaOutDir, jMeta);
        }

        if (this.options.map) {
            fs.outputJsonSync(this.mapOutDir, this.jMap);
        }
    }

    async outputJson(filename: string, data: unknown) {
        const path = filename.replace(this.sourceBase, this.sourceDist).replace(this.options.source.ext, ".json");
        await fs.outputJson(path, data);
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