import { defineConfig } from "@mdzjs/config";

export default defineConfig({
    baseDir: "./data",
    mappings: [
        {
            patterns: [
                "./area/*",
                "./character/*",
                "./concept/*",
            ],
            import: [
                "@bikari/article",
                "JEntry",
            ],
        },
        {
            patterns: [
                "./novel/*",
            ],
            import: [
                "@bikari/article",
                "NovelFrontmatter",
            ],
        },
        {
            patterns: [
                "./novel/*/*",
            ],
            import: [
                "@bikari/article",
                "ArticleFrontmatter",
            ],
        },
    ],
});
