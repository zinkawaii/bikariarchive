import { defineConfig } from "@mdzjs/config";

export default defineConfig({
    baseDir: "./content",
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
                "./intel/*",
            ],
            import: [
                "@bikari/article",
                "IntelFrontmatter",
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
