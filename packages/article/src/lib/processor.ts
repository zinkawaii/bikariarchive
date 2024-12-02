import { isDev, timer } from "@bikari/shared";
import chokidar from "chokidar";
import CryptoES from "crypto-es";
import fs from "fs-extra";
import { resolve } from "pathe";
import { glob } from "tinyglobby";

interface ProcessorContext {
    sign: string;
    loadInfos: LoadInfo[];
    sourceInfos: SourceInfo[];
}

export type LoadInfo = UseLoadOptions & {
    name: string;
    value: any;
    output: () => void;
};

export type SourceInfo = UseSourceOptions & {
    kind: number;
    glob: string[];
    filter: (path: string) => boolean;
    output: (path: string, data: any) => Promise<void>;
};

export interface BaseCache {
    hash: string;
}

let currentContext: ProcessorContext | null = null;

export function createProcessor(sign: string, setup: (ctx: ProcessorContext) => void) {
    const ctx: ProcessorContext = {
        sign,
        loadInfos: [],
        sourceInfos: []
    };

    currentContext = ctx;
    setup(ctx);
    currentContext = null;

    ctx.sourceInfos.sort((a, b) => {
        return a.kind - b.kind;
    });

    const cachePath = resolve("dist/cache", `${sign}.json`);
    const caches: Record<string, BaseCache> = fs.existsSync(cachePath) && fs.readJsonSync(cachePath) || {};

    async function build() {
        const exec = timer(sign, async () => {
            for (const info of ctx.sourceInfos) {
                const paths = await glob(info.glob, {
                    deep: info.deep ? Infinity : 2,
                    absolute: true
                });

                await Promise.all(
                    paths
                        .map((path) => path.replaceAll("\\", "/"))
                        .filter(info.filter)
                        .sort((a, b) => a.localeCompare(b))
                        .map((path) => parse(path, info))
                    );
            }
            outputLoads();
        });

        await exec();
    }

    async function watch() {
        for (const info of ctx.sourceInfos) {
            chokidar.watch(info.folders, {
                depth: info.deep ? Infinity : 0,
                ignoreInitial: true
            })
            .on("all", timer(sign, async (event: string, filename: string) => {
                const path = filename.replaceAll("\\", "/");

                if (!path.endsWith(info.ext)) {
                    return false;
                }
                else if (!info.filter(path)) {
                    return false;
                }
                else if (event === "change" && !await parse(path, info)) {
                    return false;
                }
                else if (event === "add" && !await add(path, info)) {
                    return false;
                }
                else if (event === "unlink" && !unlink(path, info)) {
                    return false;
                }
                outputLoads();
            }));
        }

        for (const info of ctx.loadInfos) {
            if (!info.src) {
                continue;
            }

            chokidar.watch(info.src, {
                ignoreInitial: true
            })
            .on("change", timer(ctx.sign, async () => {
                const newVal = await fs.readJson(info.src);
                info.value = info.onUpdate(newVal, info.value);
                info.output();
            }));
        }
    }

    async function parse(path: string, info: SourceInfo) {
        const stats = fs.statSync(path);
        const hash = CryptoES.MD5(stats.size.toString()).toString();

        let cache = caches[path];

        //当在开发环境下命中缓存时
        if (isDev && cache?.hash === hash) {
            info.onCacheHit?.(cache);
            return false;
        }

        //重置缓存
        cache = { hash };

        //开始解析
        const data = await info.parse(path, info);

        if (data !== null) {
            cache = {
                ...cache,
                ...data ?? {}
            };
            //执行一次命中缓存的逻辑
            info.onCacheHit?.(cache);
            caches[path] = cache;
        }
        else {
            //显式返回空值时清理数据
            unlink(path, info);
        }
        return true;
    }

    async function add(path: string, info: SourceInfo) {
        const cache = caches[path];

        //缓存存在时无需更新
        if (cache) {
            return false;
        }

        //开始解析
        return await parse(path, info);
    }

    function unlink(path: string, info: SourceInfo) {
        const cache = caches[path];

        //缓存不存在时无需更新
        if (!cache) {
            return false;
        }

        //执行自定义清理逻辑
        info.unlink?.(cache);

        //清空缓存
        caches[path] = null;
        return true;
    }

    function outputLoads() {
        fs.outputJsonSync(cachePath, caches);

        for (const info of ctx.loadInfos) {
            info.output();
        }
    }

    return {
        build,
        watch
    };
}

interface UseLoadOptions {
    src?: string;
    out: string;
    onUpdate?: (newVal: any, oldVal: any) => void;
    beforeOutput?: (val: any) => any;
}

export function useLoad(name: string, options: UseLoadOptions) {
    const ctx = currentContext;

    const src = options.src ? resolve(options.src) : void 0;
    const out = resolve(options.out);

    const info: LoadInfo = {
        ...options,
        name,
        value: src ? fs.readJsonSync(src) : {},
        src,
        out,
        output() {
            const data = info.beforeOutput?.(info.value) ?? info.value;
            fs.outputJsonSync(info.out, data);
        }
    };
    ctx.loadInfos.push(info);

    return info;
}

interface UseSourceOptions<T = any> {
    base: string;
    dist?: string;
    folders: string[];
    ext: string;
    deep?: boolean;
    skip?: number;
    parse: (path: string, info: SourceInfo) => Promise<T | null | void>;
    unlink?: (cache: T) => void;
    onCacheHit?: (cache: T) => void;
}

export function useSource<C extends object>(kind: number, options: UseSourceOptions<C>) {
    const ctx = currentContext;

    const base = resolve(options.base);
    const dist = options.dist ? resolve(options.dist) : void 0;
    const folders = options.folders.map((folder) => resolve(base, folder));
    const glob = folders.map((path) => resolve(path, `**/*${options.ext}`));

    const info: SourceInfo = {
        ...options,
        kind,
        base,
        dist,
        folders,
        glob,
        deep: options.deep ?? true,
        skip: options.skip ?? 0,
        filter(path) {
            const depth = path.split("/").length - folders[0].split("/").length;
            return info.skip < depth;
        },
        async output(path, data) {
            const outPath = path.replace(base, dist).replace(info.ext, ".json");
            await fs.outputJson(outPath, data);
        }
    };
    ctx.sourceInfos.push(info);

    return info;
}