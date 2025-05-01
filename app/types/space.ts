import type { InjectionKey } from "vue";

export interface SpaceContext {
    isMyself: ComputedRef<boolean>;
    uid: Ref<number>;
    nickname: Ref<string>;
    avatar: Ref<string>;
    sign: Ref<string>;
}

export const injectionKey: InjectionKey<SpaceContext> = Symbol();
