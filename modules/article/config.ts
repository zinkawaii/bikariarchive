import { defineConfig } from "@bikari/article";

export default defineConfig({
  components: [
    "CommentForge",
    "Iconify",
    "MbForge",
    "MbImage",
    "MbMath",
    "MbVideo",
    "PlainLink",
    "StoryHeading",
  ],
  macros: {
    /**
     * 草稿组件，用于提供 Yaml 节点以获取多 Frontmatter 的能力
     */
    Draft: {},
    /**
     * 简介组件，用于为文章卡片的简介渲染提供富文本数据
     */
    Excerpt: {},
  },
  mappings: [
    {
      name: "entry",
      patterns: [
        "../content/area/*",
        "../content/character/*",
        "../content/concept/*",
      ],
      components: [
        "LazyEntryKnownAbility",
        "LazyEntryStarredAbility",
      ],
    },
    {
      name: "intel",
      patterns: [
        "../content/intel/*",
      ],
    },
    {
      name: "novel",
      patterns: [
        "../content/novel/*",
      ],
    },
    {
      name: "article",
      patterns: [
        "../content/novel/*/*",
      ],
    },
  ],
});
