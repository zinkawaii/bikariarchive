import { notNullish } from "@vueuse/core";
import type { ContextMenuGroup, ContextMenuItem } from "~/types/context-menu";

export const useContextMenuStore = defineStore("context-menu", () => {
    const open = ref(false);
    const extraGroup = shallowRef<ContextMenuGroup>();
    const basicGroups = shallowReactive(new Set<ContextMenuGroup>());

    const filteredExtra = computed(() => {
        return extraGroup.value && (toValue(extraGroup.value.when) ?? true) ? extraGroup.value : void 0;
    });

    const filteredBasics = computed(() => {
        return [...basicGroups].filter((group) => {
            return (toValue(group.when) ?? true) && !filteredExtra.value?.shield?.includes(group.title);
        });
    });

    const groups = computed(() => {
        return [filteredExtra.value, ...filteredBasics.value].filter(notNullish);
    });

    function clear() {
        extraGroup.value = void 0;
    }

    function basic(group: ContextMenuGroup) {
        patchItems(group.items);
        basicGroups.add(group);

        onUnmounted(() => {
            basicGroups.delete(group);
        });
    }

    function extra(el: MaybeRefOrGetter<HTMLElement | null | undefined>, group: ContextMenuGroup) {
        patchItems(group.items);
        useEventListener(el, "contextmenu", () => {
            extraGroup.value = group;
        });
    }

    return {
        open,
        groups,
        clear,
        basic,
        extra,
    };

    //触发事件时关闭菜单
    function patchItems(items: ContextMenuItem[]) {
        for (const item of items) {
            const { action, children = [] } = item;
            item.action &&= () => (action!(), open.value = false);
            patchItems(children);
        }
    }
});
