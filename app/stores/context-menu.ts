import type { ContextMenuGroup, ContextMenuItem } from "~/types/context-menu";

export const useContextMenuStore = defineStore("context-menu", () => {
    const isOpening = ref(false);
    const baseGroups = ref<ContextMenuGroup[]>([]);
    const extraGroup = ref<ContextMenuGroup>(null);

    const groups = computed(() => {
        const isExtra = extraGroup.value ? (toValue(extraGroup.value.when) ?? true) : false;
        return [
            isExtra && extraGroup.value,
            ...baseGroups.value.filter((group) => {
                return (toValue(group.when) ?? true) && (isExtra ? !extraGroup.value.shield?.includes(group.title) : true);
            })
        ].filter(Boolean);
    });

    function clear() {
        extraGroup.value = null;
    }

    function basic(group: ContextMenuGroup) {
        patchItems(group.items);
        baseGroups.value.push(group as any);
    }

    function extra(el: MaybeRef<HTMLElement>, group: ContextMenuGroup) {
        patchItems(group.items);
        useEventListener(el, "contextmenu", () => {
            extraGroup.value = group;
        });
    }

    function open() {
        isOpening.value = true;
    }

    function close() {
        isOpening.value = false;
    }

    return {
        isOpening,
        groups,
        clear,
        basic: basic,
        extra,
        open,
        close
    };

    //触发事件时关闭菜单
    function patchItems(items: ContextMenuItem[]) {
        for (const item of items) {
            const { action, children = [] } = item;
            item.action &&= () => (action(), close());
            patchItems(children);
        }
    }
});