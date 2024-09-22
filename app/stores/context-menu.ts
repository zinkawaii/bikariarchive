import type { ContextMenuGroup, ContextMenuItem } from "~/types/context-menu";

export const useContextMenuStore = defineStore("context-menu", () => {
    const isOpened = ref(false);
    const baseGroups = ref<ContextMenuGroup[]>([]);
    const extraGroup = ref<ContextMenuGroup>(null);

    const groups = computed(() => {
        return [
            extraGroup.value,
            ...baseGroups.value.filter((group) => {
                return !extraGroup.value?.shield?.includes(group.title);
            })
        ].filter(Boolean);
    });

    function clear() {
        extraGroup.value = null;
    }

    function base(group: ContextMenuGroup) {
        patchActions(group.items);
        baseGroups.value.push(group as any);
    }

    function extra(el: MaybeRef<HTMLElement>, group: ContextMenuGroup) {
        patchActions(group.items);
        useEventListener(el, "contextmenu", () => {
            extraGroup.value = group;
        });
    }

    function open() {
        isOpened.value = true;
    }

    function close() {
        isOpened.value = false;
    }

    return {
        isOpened,
        groups,
        clear,
        base,
        extra,
        open,
        close
    };

    //触发事件时关闭菜单
    function patchActions(items: ContextMenuItem[]) {
        for (const item of items) {
            const { action, children = [] } = item;
            item.action &&= () => (action(), close());
            patchActions(children);
        }
    }
});