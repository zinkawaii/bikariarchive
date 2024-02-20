import zin from "@zinkawaii/stylelint-config";

export default {
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-html/vue"
    ],
    plugins: [
        "stylelint-order",
        "@stylistic/stylelint-plugin"
    ],
    rules: {
        ...zin.order,
        ...zin.standard,
        ...zin.stylistic
    }
};