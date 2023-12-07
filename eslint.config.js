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
        "attribute-hyphenation": "warn",
        "attributes-order": ["warn", {
            order: [
                "DEFINITION",
                "LIST_RENDERING",
                "CONDITIONALS",
                "RENDER_MODIFIERS",
                "SLOT",
                "OTHER_DIRECTIVES",
                "UNIQUE",
                "GLOBAL",
                ["ATTR_DYNAMIC", "ATTR_STATIC", "ATTR_SHORTHAND_BOOL"],
                "TWO_WAY_BINDING",
                "EVENTS",
                "CONTENT"
            ]
        }],
        "component-definition-name-casing": ["warn", "kebab-case"],
        "first-attribute-linebreak": ["warn", {
            singleline: "beside",
            multiline: "below"
        }],
        "html-closing-bracket-newline": ["warn", {
            singleline: "never",
            multiline: "always"
        }],
        "html-quotes": ["warn", "double"],
        "html-self-closing": ["warn", {
            html: {
                void: "always",
                normal: "never",
                component: "always"
            },
            svg: "always",
            math: "always"
        }],
        "mustache-interpolation-spacing": ["warn", "always"],
        "no-dupe-keys": "warn",
        "no-dupe-v-else-if": "warn",
        "no-duplicate-attributes": "warn",
        "no-export-in-script-setup": "warn",
        "no-expose-after-await": "warn",
        "no-lifecycle-after-await": "warn",
        "no-lone-template": "warn",
        "no-mutating-props": "warn",
        "no-multiple-slot-args": "warn",
        "no-multi-spaces": "warn",
        "no-ref-as-operand": "warn",
        "no-reserved-component-names": "warn",
        "no-reserved-keys": "warn",
        "no-reserved-props": "warn",
        "no-side-effects-in-computed-properties": "warn",
        "no-spaces-around-equal-signs-in-attribute": "warn",
        "no-template-key": "warn",
        "no-template-shadow": "warn",
        "no-textarea-mustache": "warn",
        "no-unused-vars": "warn",
        "no-use-computed-property-like-method": "warn",
        "no-use-v-if-with-v-for": "warn",
        "no-useless-template-attributes": "warn",
        "no-v-for-template-key-on-child": "warn",
        "no-v-text-v-html-on-component": "warn",
        "no-watch-after-await": "warn",
        "one-component-per-file": "warn",
        "prefer-import-from-vue": "warn",
        "prop-name-casing": ["warn", "camelCase"],
        "require-component-is": "warn",
        "require-default-prop": "warn",
        "require-explicit-emits": "warn",
        "require-prop-type-constructor": "warn",
        "require-render-return": "warn",
        "require-slots-as-functions": "warn",
        "require-toggle-inside-transition": "warn",
        "require-valid-default-prop": "warn",
        "return-in-computed-property": "warn",
        "return-in-emits-validator": "warn",
        "this-in-template": ["warn", "never"],
        "use-v-on-exact": "warn",
        "valid-attribute-name": "warn",
        "valid-define-emits": "warn",
        "valid-define-props": "warn",
        "valid-next-tick": "warn",
        "valid-v-bind": "warn",
        "valid-v-cloak": "warn",
        "valid-v-else-if": "warn",
        "valid-v-else": "warn",
        "valid-v-html": "warn",
        "valid-v-if": "warn",
        "valid-v-memo": "warn",
        "valid-v-model": "warn",
        "valid-v-on": "warn",
        "valid-v-once": "warn",
        "valid-v-pre": "warn",
        "valid-v-show": "warn",
        "valid-v-slot": "warn",
        "valid-v-text": "warn",
        "v-bind-style": ["warn", "shorthand"],
        "v-on-style": ["warn", "shorthand"]
    }
};

const rules = {
    recommended: {
        "constructor-super": "warn",
        "for-direction": "warn",
        "getter-return": "warn",
        "no-async-promise-executor": "warn",
        "no-class-assign": "warn",
        "no-compare-neg-zero": "warn",
        "no-const-assign": "warn",
        "no-constant-condition": ["warn", {
            checkLoops: false
        }],
        "no-control-regex": "warn",
        "no-debugger": "warn",
        "no-dupe-args": "warn",
        "no-dupe-class-members": "warn",
        "no-dupe-else-if": "warn",
        "no-dupe-keys": "warn",
        "no-duplicate-case": "warn",
        "no-empty-character-class": "warn",
        "no-empty-pattern": "warn",
        "no-ex-assign": "warn",
        "no-func-assign": "warn",
        "no-import-assign": "warn",
        "no-invalid-regexp": "warn",
        "no-irregular-whitespace": "warn",
        "no-loss-of-precision": "warn",
        "no-misleading-character-class": "warn",
        "no-new-symbol": "warn",
        "no-obj-calls": "warn",
        "no-prototype-builtins": "warn",
        "no-self-assign": "warn",
        "no-setter-return": "warn",
        "no-sparse-arrays": "warn",
        "no-this-before-super": "warn",
        "no-unexpected-multiline": "warn",
        "no-unreachable": "warn",
        "no-unsafe-finally": "warn",
        "no-unsafe-negation": ["warn", {
            enforceForOrderingRelations: true
        }],
        "no-unsafe-optional-chaining": "warn",
        "no-useless-backreference": "warn",
        "use-isnan": ["warn", {
            enforceForIndexOf: true
        }],
        "valid-typeof": "warn"
    }
};

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
            ...rules.stylistic,
            ...rules.vue,
            ...rules.recommended,
            "array-callback-return": "warn",
            "dot-notation": ["warn", {
                allowPattern: "^[a-z]+(_[a-z]+)+$"
            }],
            "eqeqeq": ["warn", "smart"],
            "no-constant-binary-expression": "warn",
            "no-constructor-return": "warn",
            "no-duplicate-imports": "warn",
            "no-promise-executor-return": "warn",
            "no-self-compare": "warn",
            "no-unreachable-loop": "warn",
            "no-unused-private-class-members": "warn",
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