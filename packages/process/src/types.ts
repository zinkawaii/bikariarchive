export interface FrontMatter {
    title: string,
    abbrlink?: string,
    date?: string,
    refactored?: string,
    updated?: string,
    draft?: boolean,
    ending?: boolean,
    runtime?: boolean
}

export interface JNovel<T> {
    author: string,
    title: string,
    type: "novel" | "blog",
    tag: string[],
    synopsis: string,
    cover: string,
    volumes: JVolume[],
    chapters: T[]
}

export interface JVolume {
    title: string,
    ending: boolean
}

export interface JChapter extends FrontMatter {
    index: string,
    volume: number,
    wordCount: number
}