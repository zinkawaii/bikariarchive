export const highlightOptions = {
    transformers: [{
        root(hast) {
            hast.children = hast.children[0]?.children[0].children ?? [];
        }
    }]
};