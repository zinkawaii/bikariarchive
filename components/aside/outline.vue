<script lang="ts" setup>
    import type { OutlineHeaderItem } from "~/types/outline";

    const { hooks } = useHookStore();

    let $link: HTMLAnchorElement = null;
    let headers: OutlineHeaderItem[] = [];
    const nestedHeaders = shallowRef<OutlineHeaderItem[]>([]);

    //文章渲染完成时更新标题列表
    hooks.hook("page:reader:rendered", () => {
        const $headings = document.querySelectorAll<HTMLHeadingElement>(".novel-text :where(h2, h3)");

        headers = [...$headings]
        .map((el) => ({
            element: el,
            title: el.textContent,
            link: "#" + el.id,
            level: Number(el.tagName[1]),
            children: []
        }))
        .filter((el) => el.level <= 3);

        nestedHeaders.value = [];
        outer: for (let i = 0; i < headers.length; i++) {
            const cur = headers[i];
            if (i > 0) {
                for (let j = i - 1; j >= 0; j--) {
                    const prev = headers[j];
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

        const topedHeaders = headers.map(({ element, link }) => ({
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
        $link?.classList.remove("is-active");
        $link = document.querySelector(`.aside-anchor[href="${decodeURIComponent(hash)}"]`);
        $link?.classList.add("is-active");
    }
</script>

<template>
    <aside-widget class="aside-unified" title="目录">
        <template #icon>
            <icon name="fa6-solid:book-open"/>
        </template>
        <aside-outline-list :headers="nestedHeaders" root/>
    </aside-widget>
</template>