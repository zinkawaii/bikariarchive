import { resolve } from "node:path";
import chokidar from "chokidar";
import fs from "fs-extra";
import { globSync } from "glob";
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
    parse: (this: T, filename: string) => void;
    beforeGenerate: (this: T, filelist: string[]) => string[] | void;
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
        return timer(this.options.sign, () => this.generate())();
    }

    watch() {
        const parse = timer(this.options.sign, (filename) => {
            this.options.parse.call(this, filename);
            this.outputMeta();
        });

        chokidar.watch(this.sources)
        .on("change", parse);
    }

    outputMeta() {
        const jMeta = this.options.beforeOutputMeta?.call(this) || this.jMeta;

        fs.outputFileSync(this.metaOutDir, JSON.stringify(jMeta));
        fs.outputFileSync(this.mapOutDir, JSON.stringify(this.jMap));
    }

    private generate() {
        //获取文件列表
        let filelist = globSync(this.sources, {
            windowsPathsNoEscape: true
        });

        //运行元数据生成函数，返回可能经过处理的文件列表
        filelist = this.options.beforeGenerate.call(this, filelist) || filelist;

        //顺序处理源文件
        filelist.forEach((filename) => this.options.parse.call(this, filename));

        //输出元数据文件
        this.outputMeta();
    }
}