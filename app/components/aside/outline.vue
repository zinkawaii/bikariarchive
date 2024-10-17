<script lang="ts" setup>
    import type { OutlineHeaderItem } from "~/types/outline";

    const { hooks } = useHookStore();
    const { height } = useElementSize(document?.body);

    const activeLink = ref<string>();
    const flatHeaders = shallowRef<OutlineHeaderItem[]>([]);
    const nestedHeaders = shallowRef<OutlineHeaderItem[]>([]);

    const headerOffsets = computedWithControl(() => [flatHeaders.value, height.value], () => {
        return flatHeaders.value?.map(({ element, link }) => ({
            link,
            top: getPosition(element).top
        })) ?? [];
    });

    //列表模板重用
    const [DefineOutlineList, OutlineList] = createReusableTemplate<{
        headers: OutlineHeaderItem[];
        root?: boolean;
    }>({
        inheritAttrs: false
    });

    //文章渲染完成时更新标题列表
    hooks.hook("reader:rendered", () => {
        const headingEls = document.querySelectorAll<HTMLHeadingElement>(".novel-text :where(h2, h3):not(.sr-only)");

        flatHeaders.value = [...headingEls]
            .map((el) => ({
                element: el,
                title: el.textContent,
                link: "#" + el.id,
                level: Number(el.tagName[1]),
                children: []
            }))
            .filter((el) => el.level <= 3);

        nestedHeaders.value = [];
        outer: for (let i = 0; i < flatHeaders.value.length; i++) {
            const cur = flatHeaders.value[i];
            if (i > 0) {
                for (let j = i - 1; j >= 0; j--) {
                    const prev = flatHeaders.value[j];
                    if (prev.level < cur.level) {
                        prev.children.push(cur);
                        continue outer;
                    }
                }
            }
            nestedHeaders.value.push(cur);
        }
    });

    //页面滚动时
    useEventListener("scroll", Zin.throttle(() => {
        const { scrollY, innerHeight } = window;

        if (!headerOffsets.value.length || scrollY < 1) {
            activeLink.value = null;
            return;
        }

        if (Math.abs(scrollY + innerHeight - height.value) < 1) {
            activeLink.value = headerOffsets.value.at(-1).link;
            return;
        }

        for (const { link, top } of headerOffsets.value) {
            if (top > scrollY + 80) {
                break;
            }
            activeLink.value = link;
        }
    }));
</script>

<template>
    <define-outline-list v-slot="{ headers, root }">
        <ul class="outline-list" :class="{ [`aside-limited`]: root }">
            <li v-for="{ title, link, children } in headers" class="outline-item">
                <a
                    class="text-truncate aside-anchor"
                    :class="{
                        [`is-active`]: link === activeLink
                    }"
                    :href="link"
                >{{ title }}</a>
                <outline-list v-if="children.length" :headers="children"/>
            </li>
        </ul>
    </define-outline-list>
    <aside-widget class="aside-unified" title="目录">
        <template #icon>
            <iconify name="fa6-solid:book-open"/>
        </template>
        <outline-list v-if="nestedHeaders.length" v-bind="{ headers: nestedHeaders, root: true }"/>
        <p v-else class="p-small outline-empty">这篇文章还没有目录哦~</p>
    </aside-widget>
</template>

<style lang="scss" scoped>
    .outline-item {
        display: grid;

        > .outline-list {
            margin-left: 1em;
        }
    }

    .outline-empty {
        padding: 0 0 16px 16px;
        color: var(--color-text-info);
    }
</style>