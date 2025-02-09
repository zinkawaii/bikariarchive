import { notNullish } from "@vueuse/core";
import type { ContextMenuGroup, ContextMenuItem } from "~/types/context-menu";

export const useContextMenuStore = defineStore("context-menu", () => {
    const isOpening = ref(false);
    const baseGroups = ref<ContextMenuGroup[]>([]);
    const extraGroup = ref<ContextMenuGroup>();

    const displayExtra = computed(() => {
        return extraGroup.value && (toValue(extraGroup.value.when) ?? true) ? extraGroup.value : void 0;
    });

    const displayBasics = computed(() => {
        return baseGroups.value.filter((group) => {
            return (toValue(group.when) ?? true) && (!displayExtra.value?.shield?.includes(group.title));
        });
    });

    const groups = computed(() => {
        return [displayExtra.value, ...displayBasics.value].filter(notNullish);
    });

    function clear() {
        extraGroup.value = void 0;
    }

    function basic(group: ContextMenuGroup) {
        patchItems(group.items);
        baseGroups.value.push(group as any);
    }

    function extra(el: MaybeRefOrGetter<HTMLElement | null | undefined>, group: ContextMenuGroup) {
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
        basic,
        extra,
        open,
        close
    };

    //触发事件时关闭菜单
    function patchItems(items: ContextMenuItem[]) {
        for (const item of items) {
            const { action, children = [] } = item;
            item.action &&= () => (action!(), close());
            patchItems(children);
        }
    }
});