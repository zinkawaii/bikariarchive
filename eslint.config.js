import gitignore from "eslint-config-flat-gitignore";
import stylistic from "@stylistic/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";
import zin from "@zinkawaii/eslint-config";

export default [
    gitignore(),
    {
        files: [
            "**/*.?([cm])[jt]s?(x)",
            "**/*.vue"
        ],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser
            }
        },
        plugins: {
            vue: vuePlugin,
            stylistic: stylistic
        },
        rules: {
            ...zin.standard,
            ...zin.recommended,
            ...zin.stylistic,
            ...zin.vue
        }
    }
];