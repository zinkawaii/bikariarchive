import { createHooks } from "hookable";
import type { BikariHooks } from "~/types/hooks";

export const useHookStore = defineStore("hooks", () => {
    const hooks = createHooks<BikariHooks>();
    return {
       hooks
    };
});