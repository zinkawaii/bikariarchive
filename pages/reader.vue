<script lang="ts" setup>
    const props = defineProps<{
        novel: string;
        index: string;
    }>();
    const { novel, index } = toRefs(props);

    const toastStore = useToastStore();
    const readRecordStore = useReadRecordStore();
    const settingStore = useSettingStore();
    const { hooks } = useHookStore();
    const router = useRouter();

    //初始化
    const art = Article.for(novel.value, index.value);

    //设置元信息
    useSeoMeta({
        title: `${art.title} - ${art.volumeInfo.title}`,
        ogTitle: art.title,
        ogType: "article",
        // @ts-expect-error 自定义键值
        ogNovelAuthor: art.novelInfo.author,
        ogNovelBook_name: art.novelInfo.title,
        ogNovelCategory: art.novelInfo.tag.join(",")
    });

    //上一章
    const toPrev = art.isFirstInVol ? "上一卷" : "上一章";
    const toPrevClass = { invisible: art.isFirst };
    const toPrevRoute = art.prev?.route;

    //下一章
    const toNext = art.isLastInVol ? "下一卷" : "下一章";
    const toNextClass = { invisible: art.isLast };
    const toNextRoute = art.next?.route;

    //上下章快捷键
    useEventListener("keyup", (event) => {
        if (isFocusedEditable()) return;

        if (!art.isFirst && event.key === settingStore.get("shortcut-last")) {
            router.push(toPrevRoute);
        }
        else if (!art.isLast && event.key === settingStore.get("shortcut-next")) {
            router.push(toNextRoute);
        }
    });

    //字体系列
    const fontFamily = computed(() => {
        return {
            0: "inherit",
            1: "宋体",
            2: "楷体"
        }[settingStore.get("font-family")];
    });

    //字体大小
    const fontSize = computed(() => {
        return {
            0: 14,
            1: 16,
            2: 18
        }[settingStore.get("font-size")] + "px";
    });

    //写入阅读记录
    readRecordStore.set(art.novel, {
        index: art.index,
        title: art.title
    });

    //密码
    const password = ref();
    const decrypted = ref(false);

    //获取正文
    const { execute, pending, data: post } = useLazyFetch("/api/article", {
        query: {
            novel,
            index,
            password
        },
        immediate: !art.encrypted,
        watch: false
    });

    //添加阅读记录
    onMounted(async () => {
        await until(pending).toBe(false);

        $fetch("/api/article", {
            method: "patch",
            body: {
                token: post.value.token
            }
        });
    });

    //防抖化请求
    const debouncedExecute = Zin.debounce(async () => {
        await execute();
        switch (post.value.error) {
            case 1:
                toastStore.error("article-password-error", "密码错误");
                break;
            default:
                toastStore.success("article-password-right", "密码正确");
                decrypted.value = true;
        }
    }, {
        title: "请求"
    });
</script>

<template>
    <coco-widget>
        <header class="novel-header">
            <nuxt-link class="novel-adjacent-top" :class="toPrevClass" :to="toPrevRoute">
                <icon name="fa6-solid:chevron-left"/>
                <span>{{ toPrev }}</span>
            </nuxt-link>
            <div>
                <h1 class="novel-title">{{ art.title }}</h1>
                <ul class="novel-information">
                    <li>
                        <icon name="fa6-solid:eye"/>
                        <span>{{ post?.readCount ?? "?" }} 阅读</span>
                    </li>
                    <li>
                        <icon name="nonicons:keyword-16"/>
                        <span>{{ art.wordCount }} 字</span>
                    </li>
                    <li>
                        <icon name="fa6-solid:pen"/>
                        <time>{{ art.publishDate }}</time>
                    </li>
                    <li>
                        <icon name="fa6-solid:clock-rotate-left"/>
                        <time>{{ art.updateDate }}</time>
                    </li>
                </ul>
            </div>
            <nuxt-link class="novel-adjacent-top" :class="toNextClass" :to="toNextRoute">
                <span>{{ toNext }}</span>
                <icon name="fa6-solid:chevron-right"/>
            </nuxt-link>
        </header>
        <template v-if="art.encrypted && !decrypted">
            <p class="novel-encrypted">
                <icon name="solar:lock-password-bold"/>
                <span>文章已加密，请输入正确的密码后查看内容</span>
                <icon name="solar:lock-password-bold"/>
            </p>
            <form class="novel-decrypt" @submit.prevent="debouncedExecute">
                <coco-input type="password" placeholder="密码" v-model="password"/>
            </form>
        </template>
        <template v-else>
            <mb-skeleton v-if="pending"/>
            <novel-article v-else class="novel-text" :content="post.content" :enabled="art.runtime" @vue:mounted="hooks.callHook(`page:reader:rendered`)"/>
        </template>
        <footer class="novel-footer">
            <p v-if="art.ending" class="novel-endding">THE END</p>
            <div class="novel-copyright">
                <nuxt-img class="copyright-avatar" :src="$config.public.avatar" alt="[avatar]"/>
                <div class="right">
                    <div class="copyright-crumb">
                        <span>{{ art.novelInfo.title }}</span>
                        <icon class="text-gray" name="fa6-solid:chevron-right"/>
                        <span>{{ art.volumeInfo.title }}</span>
                        <icon class="text-gray" name="fa6-solid:chevron-right"/>
                        <span>{{ art.title }}</span>
                    </div>
                    <p class="text-gray">本网站的所有文章除特别声明外，转载均需经过作者本人同意；文章内容仅供个人交流用，禁作商业用途。</p>
                </div>
            </div>
        </footer>
    </coco-widget>
    <div class="novel-navigation">
        <nuxt-link class="novel-adjacent-bottom" :class="toPrevClass" :to="toPrevRoute">{{ toPrev }}</nuxt-link>
        <nuxt-link class="novel-adjacent-bottom" :class="toNextClass" :to="toNextRoute">{{ toNext }}</nuxt-link>
    </div>
</template>

<style lang="scss" scoped>
    .novel-header {
        display: grid;
        grid-template-columns: auto 1fr auto;
        margin-bottom: 16px;
    }

    .novel-title {
        padding-bottom: 8px;
        font-size: 24px;
        line-height: 36px;
        text-align: center;
    }

    .novel-information {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        column-gap: 18px;
        font-size: 12px;
        line-height: 20px;
        color: var(--color-text-info);

        > li {
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

    .novel-encrypted {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25em;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--color-text-info);
    }

    .novel-decrypt {
        max-width: 616px;
        margin-inline: auto;
        padding-block: 32px;
    }

    .novel-text {
        font-family: v-bind("fontFamily");
        font-size: v-bind("fontSize");
    }

    .novel-endding {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        font-size: 13px;
        line-height: 32px;
        color: var(--color-info-light-3);

        &::before, &::after {
            content: "";
            width: 20%;
            height: 1px;
            background-color: var(--color-border-light);
        }
    }

    .novel-copyright {
        display: flex;
        overflow: auto;
        margin-top: 16px;
        border: 1px solid var(--color-border-lighter);
        border-radius: var(--circle-radius);
        background-color: var(--color-background);
        font-size: 14px;
        line-height: 2em;

        &::-webkit-scrollbar {
            display: none;
        }

        .right {
            padding: 12px 16px;
            text-wrap: nowrap;
        }
    }

    .copyright-avatar {
        width: 80px;
        border-radius: var(--circle-radius);
    }

    .copyright-crumb {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .novel-adjacent-top {
        display: flex;
        align-items: center;
        font-weight: bold;
        color: var(--color-theme-text);

        > .iconify {
            width: 1em;
            font-size: 42px;
        }

        @include viewport("md") {
            font-size: 0;
        }
    }

    .novel-navigation {
        display: grid;
        grid-template-columns: 0.4fr 0.4fr;
        justify-content: space-between;
    }

    .novel-adjacent-bottom {
        padding-block: 16px;
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
        font-weight: bold;
        text-align: center;
        text-shadow: var(--text-shadow);
        color: white;
    }

    @include viewport(">md") {
        .mb-skeleton, .novel-text {
            padding-inline: var(--cw-large);
        }
    }
</style>