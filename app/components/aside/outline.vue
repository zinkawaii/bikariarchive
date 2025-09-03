<script lang="ts" setup>
    interface HeaderInfo {
        element: HTMLHeadingElement;
        title: string;
        link: string;
        level: number;
        order: string;
        children: HeaderInfo[];
    }

    const { hooks } = useHookStore();
    const { height } = useElementSize(document?.body);

    const activeIdx = ref(0);
    const flatHeaders = shallowRef<HeaderInfo[]>([]);
    const nestedHeaders = shallowRef<HeaderInfo[]>([]);

    const activeLink = computed(() => {
        return flatHeaders.value[activeIdx.value]?.link;
    });

    const headerOffsets = computedWithControl(() => [flatHeaders.value, height.value], () => {
        return flatHeaders.value?.map(({ element, link }) => ({
            link,
            top: Math.floor(getPosition(element).top),
        })) ?? [];
    });

    //列表模板重用
    const [DefineOutlineList, OutlineList] = createReusableTemplate<{
        headers: HeaderInfo[];
    }>({
        inheritAttrs: false,
    });

    //文章渲染完成时更新标题列表
    hooks.hook("outline:update", update);
    onUnmounted(() => {
        hooks.removeHook("outline:update", update);
    });

    function update(el: HTMLElement) {
        const headingEls = el.querySelectorAll<HTMLHeadingElement>(`:where(h2, h3):not(.sr-only)`);

        flatHeaders.value = [...headingEls]
            .map((el) => ({
                element: el,
                title: el.textContent!,
                link: "#" + el.id,
                level: Number(el.tagName[1]),
                order: "",
                children: [],
            }))
            .filter((el) => el.link.length > 1 && el.level <= 3);

        nestedHeaders.value = [];
        outer: for (let i = 0; i < flatHeaders.value.length; i++) {
            const cur = flatHeaders.value[i];
            for (let j = i - 1; j >= 0; j--) {
                const prev = flatHeaders.value[j];
                if (prev.level < cur.level) {
                    cur.order = `${prev.order}.${prev.children.length + 1}`;
                    prev.children.push(cur);
                    continue outer;
                }
            }
            cur.order = `${nestedHeaders.value.length + 1}`;
            nestedHeaders.value.push(cur);
        }
    }

    //页面滚动时
    useEventListener("scroll", Zin.throttle(() => {
        const { scrollY, innerHeight } = window;

        if (!headerOffsets.value.length || scrollY < 1) {
            activeIdx.value = 0;
            return;
        }

        activeIdx.value = headerOffsets.value.length - 1;
        if (Math.abs(scrollY + innerHeight - height.value) < 1) {
            return;
        }

        for (let i = 0; i < headerOffsets.value.length; i++) {
            if (headerOffsets.value[i].top > scrollY + 80) {
                activeIdx.value = Math.max(0, i - 1);
                return;
            }
        }
    }));
</script>

<template>
    <define-outline-list v-slot="{ headers }">
        <ul class="outline-list">
            <li v-for="{ title, link, order, children } in headers" class="outline-item">
                <a
                    class="aside-anchor text-truncate"
                    :class="{ [`is-active`]: link === activeLink }"
                    :href="link"
                >
                    <span class="outline-order">{{ order }}</span>
                    <span>{{ title }}</span>
                </a>
                <outline-list v-if="children.length" :headers="children"/>
            </li>
        </ul>
    </define-outline-list>
    <aside-widget class="aside-unified" title="目录">
        <template #icon>
            <iconify name="fa7-solid:list-numeric"/>
        </template>
        <div v-if="nestedHeaders.length" class="aside-limited">
            <div class="outline-track">
                <div class="outline-thumb" :style="{ translate: `0 ${activeIdx * 30}px` }"></div>
            </div>
            <outline-list v-bind="{ headers: nestedHeaders }"/>
        </div>
        <p v-else class="outline-empty p-small">这篇文章还没有目录哦~</p>
    </aside-widget>
</template>

<style lang="scss" scoped>
    .aside-limited {
        display: grid;
        grid-template-columns: auto 1fr;
    }

    .outline-track {
        width: 3px;
        background-color: var(--color-gray-800);
    }

    .outline-thumb {
        height: 30px;
        border-radius: var(--rounded-full);
        background-color: var(--color-theme-dark);
        transition: translate 0.12s;
    }

    .outline-item {
        display: grid;
        position: relative;

        > .outline-list {
            margin-left: 14px;
        }
    }

    .aside-anchor {
        padding-left: 22px;

        &.is-active {
            color: var(--color-theme-text);
        }
    }

    .outline-order {
        position: absolute;
        opacity: 0.5;
        right: calc(100% - 16px);
        font-variant-numeric: tabular-nums;
        font-size: 12px;
    }

    .outline-empty {
        padding: 0 0 16px 16px;
        color: var(--color-info);
    }
</style>
