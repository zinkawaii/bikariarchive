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
                "@bikari/process",
                "JEntry"
            ]
        },
        {
            dirs: [
                "./novel"
            ],
            import: [
                "@bikari/process",
                "ArticleFrontmatter"
            ],
            skipTemplate: true
        }
    ]
};