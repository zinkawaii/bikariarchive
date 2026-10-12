import { createHash } from "node:crypto";
import { stat } from "node:fs/promises";
import chokidar, { type FSWatcher } from "chokidar";
import consola from "consola";
import { glob } from "tinyglobby";
import { createStorage, type Storage } from "unstorage";
import db0 from "unstorage/drivers/db0";
import { createSqliteContext, type SqliteContext } from "./sqlite.ts";
import { capitalize } from "./utils.ts";
import type { LoadInfo } from "./useLoad.ts";
import type { SourceInfo } from "./useSource.ts";

interface Cache {
  hash: string;
}

export interface ProcessorOptions {
  base: string;
  caches: Storage<Cache>;
  sqlite: SqliteContext;
}

export interface ProcessorContext {
  base: string;
  dev: boolean;
  sqlite: SqliteContext;
  loadInfos: LoadInfo[];
  sourceInfos: SourceInfo[];
}

export interface ProcessorInstance {
  build: () => Promise<void>;
  watch: () => () => Promise<void[]>;
}

let currentContext: ProcessorContext | null = null;

export function useCurrentContext() {
  return currentContext!;
}

export function createKerria(base: string, processors: ReturnType<typeof defineProcessor>[]) {
  const sqlite = createSqliteContext(base);
  const caches = createStorage<Cache>({
    driver: db0({
      database: sqlite.database,
      tableName: "cache",
    }),
  });

  const instances: ProcessorInstance[] = [];
  const options: ProcessorOptions = {
    base,
    sqlite,
    caches,
  };

  for (const processor of processors) {
    const instance = processor(options);
    instances.push(instance);
  }

  async function build() {
    for (const instance of instances) {
      await instance.build();
    }
  }

  function watch() {
    const disposables: (() => Promise<unknown>)[] = [];
    for (const instance of instances) {
      const dispose = instance.watch();
      disposables.push(dispose);
    }

    return async () => {
      for (const dispose of disposables) {
        await dispose();
      }
    };
  }

  return {
    build,
    watch,
  };
}

export function defineProcessor(sign: string, setup: (ctx: ProcessorContext) => void) {
  return (options: ProcessorOptions): ProcessorInstance => {
    const { base, caches, sqlite } = options;

    const ctx: ProcessorContext = {
      base,
      dev: process.env.NODE_ENV === "development",
      sqlite,
      loadInfos: [],
      sourceInfos: [],
    };

    currentContext = ctx;
    setup(ctx);
    currentContext = null;

    ctx.sourceInfos.sort((a, b) => a.kind - b.kind);

    async function build() {
      for (const info of ctx.sourceInfos) {
        const paths = await glob(info.patterns, {
          absolute: true,
        });

        await Promise.all(
          paths
            .map((path) => path.replaceAll("\\", "/"))
            .filter(info.filter)
            .sort((a, b) => a.localeCompare(b))
            .map((path) => parse(path, info)),
        );
      }
      outputLoads();
      consola.success(`[${sign}] Build`);
    }

    function watch() {
      const watchers: FSWatcher[] = [];

      for (const info of ctx.sourceInfos) {
        const watcher = chokidar.watch(info.folders, {
          depth: info.deep ? Infinity : 0,
          ignoreInitial: true,
        });
        watchers.push(watcher);

        watcher.on("all", async (event, filename) => {
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
          else if (event === "unlink" && !await unlink(path, info)) {
            return false;
          }
          outputLoads();
          consola.success(`[${sign}] ${capitalize(event)} "${path}"`);
        });
      }

      return () => Promise.all(
        watchers.map((watcher) => watcher.close()),
      );
    }

    async function parse(path: string, info: SourceInfo) {
      const stats = await stat(path);
      const hash = createHash("md5").update(stats.mtimeMs.toString()).digest("hex");

      let cache = await caches.get(path);

      // 当在开发环境下命中缓存时
      if (ctx.dev && cache?.hash === hash) {
        info.cache?.(cache);
        return false;
      }

      // 开始解析
      const data = await info.parse(path, info);

      if (data !== null) {
        // 重置缓存
        cache = {
          hash,
          ...data,
        };
        // 执行一次命中缓存的逻辑
        info.cache?.(cache);
        await caches.set(path, cache!);
      }
      else {
        // 显式返回空值时清理数据
        await unlink(path, info);
      }
      return true;
    }

    async function add(path: string, info: SourceInfo) {
      // 缓存存在时无需更新
      if (await caches.has(path)) {
        return false;
      }

      // 开始解析
      return parse(path, info);
    }

    async function unlink(path: string, info: SourceInfo) {
      const cache = await caches.get(path);

      // 缓存不存在时无需更新
      if (!cache) {
        return false;
      }

      // 执行自定义清理逻辑
      await info.unlink?.(cache);

      // 清空缓存
      await caches.remove(path);
      return true;
    }

    function outputLoads() {
      for (const info of ctx.loadInfos) {
        info.output();
      }
    }

    return {
      build,
      watch,
    };
  };
}
