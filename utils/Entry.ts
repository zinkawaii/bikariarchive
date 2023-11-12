export function toSplit(text: string) {
    return text?.split("\n");
}

export function toEntry(title: string) {
    return {
        name: "entry",
        params: { title }
    };
}