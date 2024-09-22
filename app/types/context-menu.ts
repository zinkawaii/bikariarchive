import type { UnwrapRef } from "vue";

export interface ContextMenuGroup {
    title: string;
    when?: MaybeRefOrGetter<any>;
    shield?: string[];
    items: ContextMenuItem[];
}

export interface ContextMenuItem {
    title: string;
    icon?: MaybeRefOrGetter<string>;
    checked?: MaybeRefOrGetter<boolean>;
    disabled?: MaybeRefOrGetter<boolean>;
    action?: () => any;
    children?: ContextMenuItem[];
}

export type UnwrapContextMenuItem = UnwrapRef<ContextMenuItem>;