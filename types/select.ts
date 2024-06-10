export interface SelectContext {
    equal: (value: any) => boolean;
    set: (value: any, title: string) => void;
}

export const injectionKey: InjectionKey<SelectContext> = Symbol();