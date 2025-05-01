export type PickAsType<O, T> = {
    [K in keyof O as O[K] extends T ? K : never]: O[K];
};

type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T];

export type PickOptional<T> = Pick<T, OptionalKeys<T>>;

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
    }
}

declare module "@unhead/vue" {
    interface HtmlAttr {
        theme?: string;
        "z-dark"?: boolean;
    }
}
