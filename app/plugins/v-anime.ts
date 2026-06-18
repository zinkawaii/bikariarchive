import { animate, type AnimationParams } from "animejs";
import type { FunctionDirective } from "vue";

declare module "vue" {
  interface GlobalDirectives {
    vAnime: FunctionDirective<any, AnimationParams>;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<any, AnimationParams>("anime", (el, binding) => {
    animate(el, binding.value);
  });
});
