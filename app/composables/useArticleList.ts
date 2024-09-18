import type { NovelType } from "@bikari/process";

export interface UseArticleListOptions {
    type?: MaybeRefOrGetter<NovelType>;
    sizes?: MaybeRefOrGetter<number>;
    sortBy?: MaybeRefOrGetter<string>;
    sticky?: MaybeRefOrGetter<boolean>;
}

export default function(options: UseArticleListOptions) {
    //筛选类型
    const type = toRef(options.type);

    //排序字段
    const sortBy = computed(() => {
        return [toValue(options.sortBy), "date"];
    });

    //是否显示置顶
    const sticky = toRef(options.sticky);

    //总列表
    const jFull = computed(() => {
        const arr = Object.values(Article.meta)
            .filter((item) => !type.value || item.type === type.value)
            .flatMap(({ chapters }) => chapters)
            .sort((a, b) => {
                const [x, y] = sortBy.value.reduce(([x, y], prop) => {
                    return [
                        x || a[prop],
                        y || b[prop]
                    ];
                }, [null, null]);
                return y?.localeCompare?.(x);
            });

        if (sticky.value) {
            arr.sort((a, b) => a.sticky - b.sticky);
        }

        return arr;
    });

    const { page, total, sizes, filteredArr: jLimited } = usePagination(jFull, {
        sizes: options.sizes
    });

    return {
        page,
        total,
        sizes,
        jLimited
    };
}