import { resolve } from "node:path";
import chokidar from "chokidar";
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
    parse: (this: T, filename: string) => Promise<void>;
    beforeBuild: (this: T, filelist: string[]) => void;
    beforeOutputMeta?: (this: T) => any;
}

export default class Processor {
    jMeta: any;
    jMap: any;

    metaSrcDir: string;
    metaOutDir: string;
    mapOutDir: string;

    sourceSrcDir: string;
    sourceOutDir: string;
    sources: string;

    constructor(
        public options: ProcessorOptions<Processor>
    ) {
        this.metaSrcDir = resolve(options.meta.src);
        this.metaOutDir = resolve(options.meta.out);
        this.mapOutDir = resolve(options.map.out);

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
                filelist.map((filename) => this.options.parse.call(this, filename))
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
            await this.options.parse.call(this, filename);
            await this.outputMeta();
        });

        chokidar.watch(this.sources)
        .on("change", parse);
    }

    async outputMeta() {
        const jMeta = this.options.beforeOutputMeta?.call(this) || this.jMeta;

        await Promise.all([
            fs.outputJson(this.metaOutDir, jMeta),
            fs.outputJson(this.mapOutDir, this.jMap)
        ]);
    }
}