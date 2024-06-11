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

export const useToastStore = defineStore("toast", {
    state: () => ({
        map: new Map<string, ToastItem>()
    }),
    actions: {
        show(key: string, content: string, type: ToastType = "info") {
            const hash = Math.random().toString(36);
            for (const item of this.map) {
                if (item[0].startsWith(key)) {
                    this.remove(item[0]);
                    break;
                }
            }
            this.map.set(key + hash, {
                icon: iconInfos[type],
                content
            });
        },
        remove(key: string) {
            this.map.delete(key);
        },
        error(key: string, content: string) {
            this.show(key, content, "error");
        },
        info(key: string, content: string) {
            this.show(key, content, "info");
        },
        success(key: string, content: string) {
            this.show(key, content, "success");
        }
    }
});