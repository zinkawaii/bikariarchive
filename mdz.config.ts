export default {
    baseDir: "./data",
    mappings: [
        {
            dirs: [
                "./area",
                "./character",
                "./concept"
            ],
            import: [
                "@bikari/article",
                "JEntry"
            ]
        },
        {
            dirs: [
                "./novel"
            ],
            import: [
                "@bikari/article",
                "ArticleFrontmatter"
            ]
        }
    ]
};