import zin from "@zinkawaii/eslint-config";

export default zin({
    rules: {
        "vue/block-tag-newline": ["warn", {
            blocks: {
                article: {
                    maxEmptyLines: 1,
                },
            },
        }],
    },
});
