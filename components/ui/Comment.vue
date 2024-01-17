<script setup>
    const commentPanelStore = useCommentPanelStore();
    const route = useRoute();

    const comments = ref();
    const count = ref({
        total: 0,
        main: 0
    });
    const page = ref(1);

    onMounted(() => {
        watchImmediate(() => [route.path, page.value], getComments);
    });

    //获取评论
    function getComments() {
        Zjax.get("/api/comments", {
            query: {
                path: route.path,
                page: page.value
            }
        })
        .then(({ error, totalCount, mainCount, data }) => {
            if (error !== 0) return;

            //评论数
            count.value.total = totalCount;
            count.value.main = mainCount;

            for (const x of data) {
                //子评论回归指向
                (function func(x) {
                    for (const y of x.children) {
                        y.parent = x;
                        func(y);
                    }
                })(x);

                //将嵌套子评论拍平
                for (const y of x.children) {
                    if (y.children.length > 0) {
                        x.children.push(...y.children);
                        y.children.length = 0;
                    }
                }

                //按时间排序
                x.children.sort((a, b) => a.time.localeCompare(b.time));
            }
            comments.value = data;
        });
    }

    //发表评论
    function postComment() {
        commentPanelStore.open({
            onReply: getComments
        });
    }
</script>

<template>
    <coco-widget class="z-comment">
        <div class="comment-title">
            <h2>评论<span class="text-gray">{{ count.total }}</span></h2>
            <mb-button icon="comment-dots" @click="postComment">发表评论</mb-button>
        </div>
        <comment-item v-for="item in comments" :key="item.id" :data="item" @update="getComments"/>
        <mb-pagination v-if="count.main > 0" :total="count.main" scroll-to=".z-comment" v-model="page"/>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .comment-title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
            margin-left: 0.5em;
        }
    }

    .mb-pagination {
        margin-top: 21px;
    }
</style>