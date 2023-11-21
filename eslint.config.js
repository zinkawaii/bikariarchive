import stylistic from "@stylistic/eslint-plugin";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";

const base = {
    stylistic: {
        "array-bracket-newline": ["warn", "consistent"],
        "array-bracket-spacing": ["warn", "never"],
        "arrow-parens": ["warn", "always"],
        "arrow-spacing": ["warn", {
            before: true,
            after: true
        }],
        "block-spacing": ["warn", "always"],
        "brace-style": ["warn", "stroustrup"],
        "comma-dangle": ["warn", "never"],
        "comma-spacing": ["warn", {
            before: false,
            after: true
        }],
        "comma-style": ["warn", "last"],
        "computed-property-spacing": ["warn", "never"],
        "dot-location": ["warn", "property"],
        "eol-last": ["warn", "never"],
        "function-call-argument-newline": ["warn", "consistent"],
        "function-call-spacing": ["warn", "never"],
        "function-paren-newline": ["warn", "consistent"],
        "implicit-arrow-linebreak": ["warn", "beside"],
        "jsx-quotes": ["warn", "prefer-double"],
        "generator-star-spacing": ["warn", {
            named: {
                before: false,
                after: true
            },
            anonymous: {
                before: true,
                after: false
            },
            method: {
                before: true,
                after: true
            }
        }],
        "key-spacing": ["warn", {
            beforeColon: false,
            afterColon: true,
            mode: "strict"
        }],
        "keyword-spacing": ["warn", {
            before: true,
            after: true
        }],
        "linebreak-style": ["warn", "unix"],
        "lines-between-class-members": ["warn", "always", {
            exceptAfterSingleLine: true
        }],
        "no-confusing-arrow": "warn",
        "no-floating-decimal": "warn",
        "no-extra-parens": ["warn", "functions"],
        "no-extra-semi": "warn",
        "no-mixed-spaces-and-tabs": "warn",
        "no-tabs": "warn",
        "no-trailing-spaces": "warn",
        "no-whitespace-before-property": "warn",
        "nonblock-statement-body-position": ["warn", "beside"],
        "object-curly-newline": "warn",
        "object-curly-spacing": ["warn", "always"],
        "object-property-newline": ["warn", {
            allowAllPropertiesOnSameLine: true
        }],
        "operator-linebreak": ["warn", "after"],
        "quotes": ["warn", "double", {
            allowTemplateLiterals: true
        }],
        "rest-spread-spacing": ["warn", "never"],
        "semi": ["warn", "always"],
        "semi-spacing": ["warn", {
            before: false,
            after: true
        }],
        "semi-style": ["warn", "last"],
        "space-before-blocks": ["warn", "always"],
        "space-before-function-paren": ["warn", {
            named: "never",
            anonymous: "never",
            asyncArrow: "always"
        }],
        "space-in-parens": ["warn", "never"],
        "space-infix-ops": "warn",
        "switch-colon-spacing": ["warn", {
            before: false,
            after: true
        }],
        "template-curly-spacing": ["warn", "never"],
        "template-tag-spacing": ["warn", "never"],
        "wrap-iife": ["warn", "inside", {
            functionPrototypeMethods: true
        }],
        "yield-star-spacing": ["warn", "after"]
    },
    vue: {
        "multi-word-component-names": "off",
        "require-v-for-key": "off"
    }
};

const rules = {};
for (const ns in base) {
    rules[ns] = Object.entries(base[ns]).reduce((res, [key, value]) => {
        res[`${ns}/${key}`] = value;
        return res;
    }, {});
}

export default [
    {
        files: [
            "**/*.{js,ts,vue}"
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
            ...rules.stylistic,
            ...rules.vue,
            "dot-notation": ["warn", {
                allowPattern: "^[a-z]+(_[a-z]+)+$"
            }],
            "eqeqeq": ["warn", "smart"],
            "no-constant-condition": ["warn", {
                checkLoops: false
            }],
            "no-unused-labels": "off",
            "no-useless-concat": "warn",
            "no-useless-rename": "warn",
            "no-useless-return": "warn",
            "no-var": "warn",
            "object-shorthand": ["warn", "methods"],
            "operator-assignment": ["warn", "always"],
            "prefer-const": ["warn", {
                destructuring: "all",
                ignoreReadBeforeAssign: false
            }],
            "prefer-rest-params": "warn",
            "prefer-spread": "warn",
            "yoda": ["warn", "never", {
                exceptRange: true
            }]
        }
    }
];