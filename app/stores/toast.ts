import type { ToastIconInfo, ToastItem, ToastType } from "~/types/toast";

const iconInfos: Record<ToastType, ToastIconInfo> = {
    error: {
        name: "ooui:clear",
        color: "var(--color-danger)",
    },
    info: {
        name: "ooui:info-filled",
        color: "var(--color-gray-300)",
    },
    success: {
        name: "ooui:success",
        color: "var(--color-success)",
    },
};

export const useToastStore = defineStore("toast", () => {
    const toasts = shallowReactive(new Map<string, ToastItem>());

    function show(key: string, message: string, type: ToastType = "info") {
        const fullKey = `<${type}>${key}`;
        const hash = randomHash(8);
        for (const [name] of toasts) {
            if (name.startsWith(fullKey)) {
                remove(name);
                break;
            }
        }
        toasts.set(`${fullKey}(${hash})`, {
            icon: iconInfos[type],
            message,
        });
    }

    function remove(name: string) {
        toasts.delete(name);
    }

    function error(key: string, message: string) {
        show(key, message, "error");
    }

    function info(key: string, message: string) {
        show(key, message, "info");
    }

    function success(key: string, message: string) {
        show(key, message, "success");
    }

    return {
        toasts,
        remove,
        error,
        info,
        success,
    };
});
