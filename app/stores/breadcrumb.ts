import type { RouteLocationRaw } from "vue-router";

export const useBreadcrumbStore = defineStore("breadcrumb", () => {
    const routes = shallowReactive(new Set<RouteLocationRaw>());

    const route = computed<RouteLocationRaw>(() => {
        return [...routes].pop() ?? {
            name: "home",
        };
    });

    function use(route: RouteLocationRaw) {
        routes.add(route);

        onBeforeUnmount(() => {
            routes.delete(route);
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
