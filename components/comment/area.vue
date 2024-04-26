<script setup>
    const commentPanelStore = useCommentPanelStore();
    const route = useRoute();

    const $self = ref();
    const comments = ref(null);
    const count = ref({
        total: 0,
        main: 0
    });
    const page = ref(1);

    //相对视口懒加载
    let stop = null;
    watchImmediate([() => route.path, page], () => {
        comments.value = null;

        //终止未触发的观测器
        stop?.(), { stop } = useIntersectionObserver($self, ([{ isIntersecting }]) => {
            if (isIntersecting) {
                getComments();
                stop();
            }
        });
    });

    //获取评论
    async function getComments() {
        const { error, totalCount, mainCount, data } = await Zjax.get("/api/comment", {
            query: {
                path: route.path,
                page: page.value
            }
        });
        if (error !== 0) return;

        //评论数
        count.value.total = totalCount;
        count.value.main = mainCount;

        for (const item of data) {
            //子评论回归指向
            (function func(parent) {
                for (const child of parent.children) {
                    child.parent = parent;
                    func(child);
                }
            })(item);

            //将嵌套子评论拍平
            for (const child of item.children) {
                if (child.children.length > 0) {
                    item.children.push(...child.children);
                    child.children.length = 0;
                }
            }

            //按时间排序
            item.children.sort((a, b) => a.time.localeCompare(b.time));
        }
        comments.value = data;
    }

    //发表评论
    function postComment() {
        commentPanelStore.open({
            onReply: getComments
        });
    }
</script>

<template>
    <coco-widget ref="$self" class="comment-area">
        <div class="comment-title">
            <h2>评论<span class="comment-count">{{ count.total }}</span></h2>
            <mb-button @click="postComment">
                <icon name="fa6-solid:comment-dots"/>
                <span>发表评论</span>
            </mb-button>
        </div>
        <mb-skeleton v-if="!comments"/>
        <comment-item v-for="item in comments" :key="item.id" :data="item" @update="getComments"/>
        <mb-pagination v-if="count.main > 0" :total="count.main" scroll-target=".z-comment" v-model="page"/>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .comment-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .comment-count {
        margin-left: 0.5em;
        color: var(--color-text-info);
    }

    .mb-skeleton, .mb-pagination {
        margin-top: 21px;
    }
</style>