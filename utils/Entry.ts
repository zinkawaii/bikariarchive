export function toSplit(text) {
    return text?.split("\n");
}

export function toEntry(title) {
    return {
        name: "entry",
        params: { title }
    };
}