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
