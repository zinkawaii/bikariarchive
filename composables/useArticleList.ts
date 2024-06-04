import type { NovelType } from "@bikari/process";

export interface UseArticleListOptions {
    type?: MaybeRefOrGetter<NovelType>;
    limit: MaybeRefOrGetter<number>;
    sortBy?: MaybeRefOrGetter<string>;
    sticky?: MaybeRefOrGetter<boolean>;
}

export default function(options: UseArticleListOptions) {
    //筛选类型
    const type = computed(() => {
        return toValue(options.type);
    });

    //单页总数
    const limit = computed(() => {
        return toValue(options.limit);
    });

    //排序字段
    const sortBy = computed(() => {
        return [toValue(options.sortBy), "date"];
    });

    //当前页数
    const page = ref(1);

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

        if (toValue(options.sticky)) {
            arr.sort((a, b) => a.sticky - b.sticky);
        }

        return arr;
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