<script setup>
    const router = useRouter();
    const settingStore = useSettingStore();
    const textSelection = useTextSelection();

    const toolItems = [
        {
            icon: "fa6-solid:chevron-left",
            action: createAction(() => {
                router.back();
            })
        },
        {
            icon: "fa6-solid:chevron-right",
            action: createAction(() => {
                router.forward();
            })
        },
        {
            icon: "fa6-solid:arrow-up",
            action: createAction(() => {
                window.scrollTo({
                    top: 0
                });
            })
        },
        {
            icon: "fa6-solid:rotate-right",
            action: createAction(() => {
                location.reload();
            })
        }
    ];

    const textItems = [
        {
            title: "复制",
            icon: "fa6-solid:paste",
            action: createAction(() => {
                navigator.clipboard.writeText(textSelection.text.value);
            })
        },
        {
            title: "站内词条",
            icon: "fa6-solid:sitemap",
            action: createAction(() => {
                router.push(toEntry(textSelection.text.value));
            })
        },
        {
            title: "全文检索",
            icon: "fa-solid:search",
            action: createAction(() => {
                router.push(toSearch(textSelection.text.value));
            })
        }
    ];

    const menuItems = ref([
        {
            title: "返回主页",
            icon: "fa6-solid:house",
            action: createAction(() => {
                router.push({ name: "home" });
            })
        },
        {
            title: "昼夜切换",
            icon: computed(() => (settingStore.isDarkMode ? "fa6-solid:sun" : "fa6-solid:moon")),
            action: createAction(() => {
                const value = settingStore.isDarkMode ? 1 : 2;
                settingStore.set("dark-mode", value);
            })
        }
    ]);

    //显示状态
    const state = ref(false);
    const $Menu = ref();

    useEventListener("contextmenu", (event) => {
        //显示菜单
        state.value = true;

        //阻止原生菜单
        event.preventDefault();

        nextTick(() => {
            //获取宽高
            const width = $Menu.value.offsetWidth;
            const height = $Menu.value.offsetHeight;

            //计算位置
            let { x, y } = event;
            x -= (width + x > window.innerWidth) ? width : 0;
            y -= (height + y > window.innerHeight) ? height : 0;

            $Menu.value.style.left = x + "px";
            $Menu.value.style.top = y + "px";
        });
    });

    //鼠标按下时
    useEventListener("mousedown", (event) => {
        if (state.value && !event.target.closest(".z-context-menu")) {
            state.value = false;
        }
    });

    //创建菜单行为
    function createAction(handler) {
        return function() {
            handler.call(this);
            state.value = false;
        };
    }
</script>

<template>
    <transition-scale :duration="0.25">
        <div v-if="state" ref="$Menu" class="content-widget z-context-menu">
            <menu class="menu-tool-bar">
                <li v-for="{ icon, action } in toolItems" class="menu-tool" @click="action">
                    <icon :name="icon"/>
                </li>
            </menu>
            <menu v-if="textSelection.text.value" class="menu-list">
                <li v-for="{ title, icon, action } in textItems" class="menu-item" @click="action">
                    <icon :name="icon"/>
                    <span>{{ title }}</span>
                </li>
            </menu>
            <menu class="menu-list">
                <li v-for="{ title, icon, action } in menuItems" class="menu-item" @click="action">
                    <icon :name="icon"/>
                    <span>{{ title }}</span>
                </li>
            </menu>
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

    .menu-tool-bar {
        display: flex;
        justify-content: space-between;
        gap: 4px;
    }

    .menu-tool, .menu-item {
        border-radius: 8px;
        line-height: 28px;
        transition: all 0.25s;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--color-theme);
            color: white;
        }
    }

    .menu-tool {
        width: 28px;
        text-align: center;
    }

    .menu-list {
        display: grid;
        gap: 4px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid var(--color-border-lighter);
    }

    .menu-item {
        padding-inline: 8px;

        > svg {
            width: 16px;
            margin-right: 8px;
        }
    }
</style>