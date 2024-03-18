import chokidar from "chokidar";
import fs from "fs-extra";
import { resolve } from "path";
import { globSync } from "glob";
import { r, timer } from "@bikari/shared";

interface ProcessorOptions<T> {
    sign: string,
    source: {
        src: string,
        out: string,
        pattern: string
    },
    meta: {
        src: string,
        out: string
    },
    map: {
        out: string
    },
    parse: (this: T, filename: string) => void,
    generate: (this: T, filelist: string[]) => string[] | void,
    beforeOutputMeta?: (this: T) => any
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
        this.metaSrcDir = r(options.meta.src);
        this.metaOutDir = r(options.meta.out);
        this.mapOutDir = r(options.map.out);

        this.jMeta = JSON.parse(fs.readFileSync(this.metaSrcDir).toString());
        this.jMap = {};

        this.sourceSrcDir = r(options.source.src);
        this.sourceOutDir = r(options.source.out);
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
        filelist = this.options.generate.call(this, filelist) || filelist;

        //顺序处理源文件
        filelist.forEach((filename) => this.options.parse.call(this, filename));

        //输出元数据文件
        this.outputMeta();
    }
}