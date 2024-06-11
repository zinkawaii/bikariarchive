import type { ModelRef } from "vue";

export interface SelectContext {
    modelValue: ModelRef<unknown, string>;
    bind: (title: MaybeRefOrGetter<string>) => void;
}

export const injectionKey: InjectionKey<SelectContext> = Symbol();