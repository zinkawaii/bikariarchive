declare module "~/dist/json/Article.json" {
    export default <{
        [novel: string]: JNovel
    }> {};

    export interface JNovel {
        author: string,
        title: string,
        type: "novel" | "blog",
        tag: string[],
        synopsis: string,
        cover: string,
        volumes: JVolume[],
        chapters: jChapter[],
        $seq: string[]
    }

    export interface JVolume {
        title: string,
        ending: boolean
    }

    export interface JChapter {
        index: string,
        volume: number,
        title: string,
        date?: string,
        refactored?: string,
        updated?: string,
        ending?: boolean,
        runtime?: boolean,
        wordCount: number
    }
}