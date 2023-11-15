import type { WatchCallback, WatchOptions } from "vue";

export const useSettingStore = defineStore("setting", () => {
    const isOpen = ref(false);
    const setting = ref({
        "theme": 2,
        "dark-mode": 0,
        "sidebar-display": 0,
        "shortcut-last": "a",
        "shortcut-next": "d",
        "font-family": 0,
        "font-size": 1,
        "ui-collapse": false
    });

    function get(key: string) {
        return setting.value[key];
    }

    function set(key: string, value: any) {
        setting.value[key] = value;
    }

    function toggle(key: string, value?: boolean) {
        setting.value[key] = value ?? !setting.value[key];
    }

    //监听
    function listen(key: string, handler: WatchCallback, options: WatchOptions & {
        viewTransition: boolean
    }) {
        watch(() => setting.value[key], (newVal, oldVal, onCleanup) => {
            const fn = handler.bind(null, newVal, oldVal, onCleanup);

            if (//首屏加载时不应用视图转换
                oldVal !== void(0)
                && process.browser
                && options?.viewTransition
                && document.startViewTransition
            ) {
                document.startViewTransition(fn);
            }
            else fn();
        }, {
            immediate: true,
            ...options
        });
    }

    //打开设置
    function open() {
        isOpen.value = true;
    }

    //关闭设置
    function close() {
        isOpen.value = false;
    }

    return {
        setting,
        isOpen,
        get,
        set,
        toggle,
        listen,
        open,
        close
    };
}, {
    persist: {
        paths: ["setting"]
    }
});