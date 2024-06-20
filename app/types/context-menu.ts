import type { UnwrapRef } from "vue";

export interface ContextMenuGroup {
    key: string;
    when?: MaybeRefOrGetter<any>;
    items: ContextMenuItem[];
}

export interface ContextMenuItem {
    title: string;
    icon?: MaybeRef<string>;
    checked?: Ref<boolean>;
    action?: () => any;
    children?: ContextMenuItem[];
}

export type UnwrapContextMenuItem = UnwrapRef<ContextMenuItem>;