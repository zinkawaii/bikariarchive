export interface SearchContext {
    searchWord: Ref<string>;
}

export const injectionKey: InjectionKey<SearchContext> = Symbol();