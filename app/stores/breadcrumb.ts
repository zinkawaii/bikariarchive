import type { RouteLocationRaw } from "vue-router";

export const useBreadcrumbStore = defineStore("breadcrumb", () => {
    const list = ref(new Set<RouteLocationRaw>());

    const route = computed(() => {
        return [...list.value].at(-1) ?? {
            name: "home",
        };
    });

    function use(route: RouteLocationRaw) {
        list.value.add(route);

        onBeforeUnmount(() => {
            list.value.delete(route);
        });
    }

    return {
        route,
        use,
    };
});

export function useBreadcrumb(route: RouteLocationRaw) {
    const breadcrumbStore = useBreadcrumbStore();
    breadcrumbStore.use(route);
}
