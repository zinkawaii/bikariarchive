export type PickAsType<O, T> = {
    [K in keyof O as O[K] extends T ? K : never]: O[K];
};

export type WithParent<T> = T & {
    parent?: WithParent<T>;
    children: WithParent<T>[];
};

declare module "vue-router" {
    interface RouteMeta {
        identity?: number;
        catalog?: boolean;
        comment?: boolean;
        jumbotron?: boolean;
        sidebar?: boolean;
        widePage?: boolean;
        fullPage?: boolean;
        breadcrumb?: RouteLocationRaw;
    }
}

declare module "zhead" {
    interface HtmlAttributes {
        theme?: string;
        "z-dark"?: boolean;
    }
}