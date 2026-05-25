import type { FunctionDirective } from "vue";

declare module "vue" {
    interface GlobalDirectives {
        vOutline: FunctionDirective;
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive<HTMLElement>("outline", (el) => {
        const { hooks } = useHookStore();
        hooks.callHook("outline:update", el);
    });
});
