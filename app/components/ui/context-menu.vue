<script lang="ts" setup>
    const contextMenuStore = useContextMenuStore();
    const settingStore = useSettingStore();
    const toastStore = useToastStore();
    const router = useRouter();
    const rootEl = useTemplateRef("root");
    const textSelection = useTextSelection();

    const toolItems = [
        {
            icon: "fa6-solid:chevron-left",
            action: () => {
                router.back();
            }
        },
        {
            icon: "fa6-solid:chevron-right",
            action: () => {
                router.forward();
            }
        },
        {
            icon: "fa6-solid:arrow-up",
            action: () => {
                window.scrollTo({
                    top: 0
                });
            }
        },
        {
            icon: "fa6-solid:rotate-right",
            action: () => {
                location.reload();
            }
        }
    ];

    contextMenuStore.base({
        key: "text",
        when: () => textSelection.text.value,
        items: [
            {
                title: "复制",
                icon: "fa6-solid:paste",
                action: () => {
                    navigator.clipboard.writeText(textSelection.text.value);
                    toastStore.success("[copy]", "文本已复制");
                }
            },
            {
                title: "站内词条",
                icon: "fa6-solid:sitemap",
                action: () => {
                    router.push(toEntry(textSelection.text.value));
                }
            },
            {
                title: "全文检索",
                icon: "fa6-solid:magnifying-glass",
                action: () => {
                    router.push(toSearch(textSelection.text.value));
                }
            }
        ]
    });

    contextMenuStore.base({
        key: "global",
        items: [
            {
                title: "返回主页",
                icon: "fa6-solid:house",
                action: () => {
                    router.push({ name: "home" });
                }
            },
            {
                title: "昼夜切换",
                icon: () => (settingStore.isDarkMode ? "fa6-solid:sun" : "fa6-solid:moon"),
                action: () => {
                    const value = settingStore.isDarkMode ? 1 : 2;
                    settingStore.set("dark-mode", value);
                }
            }
        ]
    });

    //捕获阶段清除附加菜单
    useEventListener("contextmenu", () => {
        contextMenuStore.clear();
    }, {
        capture: true
    });

    useEventListener("contextmenu", (event) => {
        if (event.ctrlKey) {
            return;
        }

        //显示菜单
        contextMenuStore.open();

        //阻止原生菜单
        event.preventDefault();

        nextTick(() => {
            //获取宽高
            const width = rootEl.value.offsetWidth;
            const height = rootEl.value.offsetHeight;

            //计算位置
            let { x, y } = event;
            x -= (width + x > window.innerWidth) ? width : 0;
            y -= (height + y > window.innerHeight) ? height : 0;

            rootEl.value.style.left = x + "px";
            rootEl.value.style.top = y + "px";
        });
    });

    //鼠标按下时
    useEventListener("mousedown", (event) => {
        if (contextMenuStore.isOpened && !(event.target as HTMLElement).closest(".z-context-menu")) {
            contextMenuStore.close();
        }
    });
</script>

<template>
    <transition-scale :duration="0.25">
        <div v-show="contextMenuStore.isOpened" ref="root" class="content-widget z-context-menu">
            <menu class="menu-tools">
                <li v-for="{ icon, action } in toolItems" class="menu-tool" @click="action">
                    <icon :name="icon"/>
                </li>
            </menu>
            <template v-for="{ key, when, items } in contextMenuStore.groups">
                <context-menu-group v-if="toValue(when) ?? true" :key :items root/>
            </template>
        </div>
    </transition-scale>
</template>

<style lang="scss" scoped>
    .z-context-menu {
        position: fixed;
        padding: 8px;
        backdrop-filter: blur(2px);
        font-size: 14px;
    }

    .menu-tools {
        display: flex;
        gap: 4px;
    }

    .menu-tool {
        display: grid;
        place-items: center;
        width: 28px;
        aspect-ratio: 1;
        border-radius: 8px;
        transition: all 0.25s;
        cursor: pointer;

        &:hover {
            background-color: var(--color-theme);
            color: white;
        }
    }
</style>