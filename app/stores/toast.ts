import type { ToastIconInfo, ToastItem, ToastType } from "~/types/toast";

const iconInfos: Record<ToastType, ToastIconInfo> = {
    error: {
        name: "ooui:clear",
        color: "var(--color-danger)"
    },
    info: {
        name: "ooui:info-filled",
        color: "var(--color-info-light-3)"
    },
    success: {
        name: "ooui:success",
        color: "var(--color-success)"
    }
};

export const useToastStore = defineStore("toast", () => {
    const map = ref(new Map<string, ToastItem>());

    function show(key: string, content: string, type: ToastType = "info") {
        const fullKey = `<${type}>${key}`;
        const hash = Math.random().toString(36);
        for (const item of map.value) {
            if (item[0].startsWith(fullKey)) {
                remove(item[0]);
                break;
            }
        }
        map.value.set(fullKey + hash, {
            icon: iconInfos[type],
            content
        });
    }

    function remove(key: string) {
        map.value.delete(key);
    }

    function error(key: string, content: string) {
        show(key, content, "error");
    }

    function info(key: string, content: string) {
        show(key, content, "info");
    }

    function success(key: string, content: string) {
        show(key, content, "success");
    }

    return {
        map,
        remove,
        error,
        info,
        success
    };
});