import { isDev, timer } from "@bikari/shared";
import chokidar from "chokidar";
import CryptoES from "crypto-es";
import fs from "fs-extra";
import { resolve } from "pathe";
import { glob } from "tinyglobby";

interface ProcessorOptions<T, K> {
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
    resolveSourceKind?: (path: string) => K;
    parse: (this: T, kind: K, path: string) => Promise<any>;
    unlink?: (this: T, kind: K, cache: any) => void;
    onCacheHit?: (this: T, kind: K, cache: any) => void;
    onMetaUpdate?: (this: T, newVal: any, oldVal: any) => any;
    beforeBuild?: (this: T) => void;
    beforeOutputMeta?: (this: T) => any;
}

export default class Processor<K = number> {
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
        private options: ProcessorOptions<Processor, K>
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
            const paths = await glob(this.sourceGlob, {
                absolute: true
            });
            paths.sort((a, b) => a.localeCompare(b));

            //对源文件进行分类
            const sources = new Map<K, string[]>();
            for (const path of paths) {
                const kind = this.options.resolveSourceKind?.(path);
                if (!sources.has(kind)) {
                    sources.set(kind, []);
                }
                sources.get(kind).push(path);
            }

            for (const [kind, names] of sources) {
                await Promise.all(
                    names.map((name) => this.parse(kind, name))
                );
            }

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
            const path = filename.replaceAll("\\", "/");
            const kind = this.options.resolveSourceKind?.(path);

            if (!path.endsWith(this.options.source.ext)) {
                return false;
            }
            if (event === "change" && !await this.parse(kind, path)) {
                return false;
            }
            else if (event === "add" && !await this.add(kind, path)) {
                return false;
            }
            else if (event === "unlink" && !await this.unlink(kind, path)) {
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

    async parse(kind: K, path: string) {
        const stats = fs.statSync(path);
        const hash = CryptoES.MD5(stats.size.toString()).toString();

        let cache = this.jCache[path];

        //当在开发环境下命中缓存时
        if (isDev && cache?.hash === hash) {
            await this.options.onCacheHit?.call(this, kind, cache);
            return false;
        }

        //重置缓存
        cache = { hash };

        //开始解析
        const data = await this.options.parse.call(this, kind, path);

        if (data !== null) {
            cache = {
                ...cache,
                ...data ?? {}
            };
            //执行一次命中缓存的逻辑
            await this.options.onCacheHit?.call(this, kind, cache);
            this.jCache[path] = cache;
        }
        else {
            //显式返回空值时清理数据
            this.unlink(kind, path);
        }
        return true;
    }

    async add(kind: K, path: string) {
        const cache = this.jCache[path];

        //缓存存在时无需更新
        if (cache) {
            return false;
        }

        //开始解析
        return await this.parse(kind, path);
    }

    async unlink(kind: K, path: string) {
        const cache = this.jCache[path];

        //缓存不存在时无需更新
        if (!cache) {
            return false;
        }

        //执行自定义清理逻辑
        this.options.unlink?.call(this, kind, cache);

        //清空缓存
        this.jCache[path] = null;
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

    async outputJson(path: string, data: unknown) {
        const outPath = path.replace(this.sourceBase, this.sourceDist).replace(this.options.source.ext, ".json");
        await fs.outputJson(outPath, data);
    }
}