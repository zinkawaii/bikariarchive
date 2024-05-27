import type { NovelType } from "@bikari/process";

export interface UseArticleListOptions {
    type: MaybeRefOrGetter<NovelType>;
    limit: MaybeRefOrGetter<number>;
    sortBy?: MaybeRefOrGetter<string>;
}

export default function(options: UseArticleListOptions) {
    //单页总数
    const limit = computed(() => {
        return toValue(options.limit);
    });

    //当前页数
    const page = ref(1);

    //是否按更新日期排序
    const sortBy = computed(() => {
        return [toValue(options.sortBy), "date"];
    });

    //总列表
    const jFull = computed(() => {
        return Object.values(Article.meta)
        .filter(({ type }) => type === toValue(options.type))
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
    });

    //显示列表
    const jLimited = computed(() => {
        const start = (page.value - 1) * limit.value;
        const end = start + limit.value;
        return jFull.value.slice(start, end);
    });

    return {
        jFull,
        jLimited,
        page
    };
}