export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("visible", (el, binding) => {
        el.style.visibility = !binding.value ? "hidden" : "";
    });
});