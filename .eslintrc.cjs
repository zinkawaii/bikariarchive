module.exports = {
    root: true,
    env: {
        node: true,
        browser: true
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended"
    ],
    parser: "vue-eslint-parser",
    rules: {
        "vue/multi-word-component-names": "off",
        "vue/require-v-for-key": "off",
        "array-bracket-newline": ["warn", "consistent"],
        "arrow-parens": ["warn", "always"],
        "arrow-spacing": ["warn", {
            "before": true,
            "after": true
        }],
        "comma-dangle": ["warn", "never"],
        "comma-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "comma-style": ["warn", "last"],
        "computed-property-spacing": ["warn", "never"],
        "dot-location": ["warn", "property"],
        "dot-notation": ["warn", {
            "allowPattern": "^[a-z]+(_[a-z]+)+$"
        }],
        "eqeqeq": ["warn", "smart"],
        "func-call-spacing": ["warn", "never"],
        "function-call-argument-newline": ["warn", "never"],
        "key-spacing": ["warn", {
            "beforeColon": false,
            "afterColon": true,
            "mode": "strict"
        }],
        "keyword-spacing": ["warn", {
            "before": true,
            "after": true
        }],
        "lines-between-class-members": ["warn", "always", {
            "exceptAfterSingleLine": true
        }],
        "no-constant-condition": ["warn", {
            "checkLoops": false
        }],
        "no-extra-parens": ["warn", "functions"],
        "no-tabs": ["warn", {
            "allowIndentationTabs": false
        }],
        "no-trailing-spaces": ["warn", {
            "skipBlankLines": false,
            "ignoreComments": false
        }],
        "no-undef": "off",
        "no-unused-labels": "off",
        "no-unused-vars": "off",
        "no-useless-concat": "warn",
        "no-useless-rename": "warn",
        "no-useless-return": "warn",
        "no-var": "warn",
        "no-whitespace-before-property": "warn",
        "nonblock-statement-body-position": ["warn", "beside"],
        "object-curly-newline": ["warn", {
            "consistent": true
        }],
        "object-curly-spacing": ["warn", "always"],
        "object-shorthand": ["warn", "methods"],
        "operator-assignment": ["warn", "always"],
        "prefer-const": ["warn", {
            "destructuring": "all",
            "ignoreReadBeforeAssign": false
        }],
        "quotes": ["warn", "double", {
            "allowTemplateLiterals": true
        }],
        "rest-spread-spacing": ["warn", "never"],
        "semi": ["warn", "always"],
        "semi-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "semi-style": ["warn", "last"],
        "space-before-blocks": ["warn", "always"],
        "space-before-function-paren": ["warn", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "space-infix-ops": "warn",
        "space-in-parens": ["warn", "never"],
        "switch-colon-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "wrap-iife": ["warn", "inside", {
            "functionPrototypeMethods": true
        }],
        "yoda": ["warn", "never", {
            "exceptRange": true
        }]
    }
};