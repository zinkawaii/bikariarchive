import type { FunctionDirective } from "vue";

declare module "vue" {
    interface GlobalDirectives {
        vVisible: FunctionDirective<any, any>;
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("visible", (el, binding) => {
        el.style.visibility = !binding.value ? "hidden" : "";
    });
});