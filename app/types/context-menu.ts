import type { UnwrapRef } from "vue";

export interface ContextMenuGroup {
    key: string;
    when?: MaybeRefOrGetter<any>;
    shield?: string[];
    items: ContextMenuItem[];
}

export interface ContextMenuItem {
    title: string;
    icon?: MaybeRefOrGetter<string>;
    checked?: MaybeRefOrGetter<boolean>;
    action?: () => any;
    children?: ContextMenuItem[];
}

export type UnwrapContextMenuItem = UnwrapRef<ContextMenuItem>;