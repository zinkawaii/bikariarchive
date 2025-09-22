export type PickAsType<O, T> = {
    [K in keyof O as O[K] extends T ? K : never]: O[K];
};

export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type WithParent<T> = T & {
    parent?: WithParent<T>;
    children: WithParent<T>[];
};
