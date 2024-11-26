export default {
    baseDir: "./data",
    mappings: [
        {
            patterns: [
                "./area/*",
                "./character/*",
                "./concept/*"
            ],
            import: [
                "@bikari/article",
                "JEntry"
            ]
        },
        {
            patterns: [
                "./novel/*"
            ],
            import: [
                "@bikari/article",
                "NovelFrontmatter"
            ]
        },
        {
            patterns: [
                "./novel/*/*"
            ],
            import: [
                "@bikari/article",
                "ArticleFrontmatter"
            ]
        }
    ]
};