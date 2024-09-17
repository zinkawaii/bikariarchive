import type { WritableComputedRef } from "vue";

export interface UseSourceRefsFieldOptions {
    default?: any;
    readonly?: MaybeRefOrGetter<boolean>;
}

export default function<
    T extends object,
    F extends Record<string, UseSourceRefsFieldOptions>
>(
    source: MaybeRefOrGetter<T>,
    fields: F
) {
    const src = toRef(source);

    const returns = {} as {
        [P in keyof F]: WritableComputedRef<P extends keyof T ? T[P] : F[P] extends { default: infer D } ? D : unknown>
    };

    for (const field in fields) {
        const options = fields[field];

        returns[field] = computed({
            get() {
                return Reflect.get(src.value, field) ?? options.default;
            },
            set(val) {
                !toValue(options.readonly) && Reflect.set(src.value, field, val);
            }
        });
    }

    return returns;
}