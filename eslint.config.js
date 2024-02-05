import stylistic from "@stylistic/eslint-plugin";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";
import zin from "@zinkawaii/eslint-config";

export default [
    {
        files: [
            "**/*.{js,ts,vue}"
        ],
        ignores: [
            ".nuxt/**/*"
        ],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: "@typescript-eslint/parser"
            }
        },
        plugins: {
            vue: vuePlugin,
            stylistic: stylistic
        },
        rules: {
            ...zin.stylistic,
            ...zin.vue,
            ...zin.recommended,
            ...zin.standard
        }
    }
];