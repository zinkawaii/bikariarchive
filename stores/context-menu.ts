import type { ContextMenuGroup, ContextMenuItem } from "~/types/context-menu";

export const useContextMenuStore = defineStore("context-menu", () => {
    const isOpened = ref(false);
    const baseGroups = ref<ContextMenuGroup[]>([]);
    const extraGroup = ref<ContextMenuGroup>(null);

    const groups = computed(() => {
        return [
            extraGroup.value,
            ...baseGroups.value
        ].filter(Boolean);
    });

    function clear() {
        extraGroup.value = null;
    }

    function base(group: ContextMenuGroup) {
        baseGroups.value.push(group as any);
    }

    function extra(el: MaybeRef<HTMLElement>, items: ContextMenuItem[]) {
        useEventListener(el, "contextmenu", () => {
            extraGroup.value = {
                items: items as any
            };
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
});