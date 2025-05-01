import antfu from "@antfu/eslint-config";
import zin from "@zinkawaii/eslint-config";

export default antfu({
    ignores: [
        "data/json/Bangumi.json",
    ],
    pnpm: true,
    rules: {
        ...zin.standard,
        ...zin.recommended,
        ...zin.stylistic,
        ...zin.vue,
        ...zin.patch,
    },
});
