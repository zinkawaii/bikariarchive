import type { WritableComputedRef } from "vue";

export type UseSourceRefsReturns<
    T extends object,
    F extends Record<string, UseSourceRefsFieldOptions>,
> = {
    [P in keyof F]: WritableComputedRef<
        P extends keyof T
            ? F[P] extends { default: unknown }
                ? NonNullable<T[P]>
                : T[P]
            : F[P] extends { default: infer D }
                ? D
                : unknown
    >
};

export interface UseSourceRefsFieldOptions {
    default?: any;
    readonly?: MaybeRefOrGetter<boolean>;
}

export function useSourceRefs<
    T extends object,
    F extends Record<string, UseSourceRefsFieldOptions>,
>(
    source: MaybeRefOrGetter<T>,
    fields: F,
) {
    const src = toRef(source);

    const returns = {} as UseSourceRefsReturns<T, F>;

    for (const field in fields) {
        const options = fields[field];

        returns[field] = computed({
            get() {
                return src.value[field] ?? options.default;
            },
            set(val) {
                !toValue(options.readonly) && (src.value[field] = val);
            },
        });
    }

    return returns;
}
