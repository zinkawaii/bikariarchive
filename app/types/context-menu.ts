export interface ContextMenuGroup {
  title: string;
  when?: MaybeRefOrGetter<unknown>;
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
