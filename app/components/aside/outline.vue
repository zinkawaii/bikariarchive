<script lang="ts" setup>
    import type { OutlineHeaderItem } from "~/types/outline";

    const { hooks } = useHookStore();

    let linkEl: HTMLAnchorElement = null;
    let flatHeaders: OutlineHeaderItem[] = [];
    const nestedHeaders = shallowRef<OutlineHeaderItem[]>([]);

    //列表模板重用
    const [DefineOutlineList, OutlineList] = createReusableTemplate<{
        headers: OutlineHeaderItem[];
        root?: boolean;
    }>({
        inheritAttrs: false
    });

    //文章渲染完成时更新标题列表
    hooks.hook("page:reader:rendered", () => {
        const headingEls = document.querySelectorAll<HTMLHeadingElement>(".novel-text :where(h2, h3):not(.sr-only)");

        flatHeaders = [...headingEls]
        .map((el) => ({
            element: el,
            title: el.textContent,
            link: "#" + el.id,
            level: Number(el.tagName[1]),
            children: []
        }))
        .filter((el) => el.level <= 3);

        nestedHeaders.value = [];
        outer: for (let i = 0; i < flatHeaders.length; i++) {
            const cur = flatHeaders[i];
            if (i > 0) {
                for (let j = i - 1; j >= 0; j--) {
                    const prev = flatHeaders[j];
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
        const { offsetHeight } = document.body;

        const topedHeaders = flatHeaders.map(({ element, link }) => ({
            link,
            top: getPosition(element).top
        }));

        if (!topedHeaders.length || scrollY < 1) {
            activateLink(null);
            return;
        }

        if (Math.abs(scrollY + innerHeight - offsetHeight) < 1) {
            activateLink(topedHeaders.at(-1).link);
            return;
        }

        let activeLink = null;
        for (const { link, top } of topedHeaders) {
            if (top > scrollY + 80) {
                break;
            }
            activeLink = link;
        }
        activateLink(activeLink);
    }));

    //更新激活链接
    function activateLink(hash: string) {
        linkEl?.classList.remove("is-active");
        linkEl = document.querySelector(`.aside-anchor[href="${decodeURIComponent(hash)}"]`);
        linkEl?.classList.add("is-active");
    }
</script>

<template>
    <define-outline-list v-slot="{ headers, root }">
        <ul class="outline-list" :class="{ [`aside-limited`]: root }">
            <li v-for="{ title, link, children } in headers" class="outline-item">
                <a class="text-truncate aside-anchor" :href="link">{{ title }}</a>
                <outline-list v-if="children.length" :headers="children"/>
            </li>
        </ul>
    </define-outline-list>
    <aside-widget class="aside-unified" title="目录">
        <template #icon>
            <icon name="fa6-solid:book-open"/>
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