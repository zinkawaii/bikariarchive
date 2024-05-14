export type PickAsType<O, T> = {
    [K in keyof O as O[K] extends T ? K : never]: O[K];
};

export type WithParent<T> = T & {
    parent?: WithParent<T>;
    children: WithParent<T>[];
};

declare module "vue-router" {
    interface RouteMeta {
        breadcrumb?: RouteLocationRaw;
        comment?: boolean;
        widePage?: boolean;
        fullPage?: boolean;
        identity?: number;
    }
}