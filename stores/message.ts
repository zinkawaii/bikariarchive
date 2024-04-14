type MessageType = "error" | "info" | "success";

const iconInfos: Record<MessageType, {
    name: string,
    color: string
}> = {
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

export const useMessageStore = defineStore("message", {
    state: () => ({
        map: new Map()
    }),
    actions: {
        show(key: string, content: string, type: MessageType = "info") {
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
        }
    }
});