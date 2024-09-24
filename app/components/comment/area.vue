<script lang="ts" setup>
    const route = useRoute();
    const rootComp = useTemplateRef("root");
    const commentStore = useCommentStore();
    const commentPanelStore = useCommentPanelStore();

    const page = ref(1);
    const { comments, totalCount, mainCount, isEmpty } = storeToRefs(commentStore);

    //相对视口懒加载
    let stop: () => void;
    watchImmediate(() => route.path, () => {
        //清空上一页的评论
        commentStore.clear();

        //终止未触发的观测器
        stop?.(), { stop } = useIntersectionObserver(rootComp, ([{ isIntersecting }]) => {
            if (isIntersecting) {
                commentStore.update(page.value);
                stop();
            }
        });
    });

    //切换页数时立即更新
    watch(page, (val) => {
        commentStore.update(val);
    });
</script>

<template>
    <meow-widget ref="root" class="comment-area">
        <div class="comment-title">
            <h2>评论<span class="comment-count">{{ totalCount }}</span></h2>
            <mb-button @click="commentPanelStore.post()">
                <iconify name="fa6-solid:comment-dots"/>
                <span>发表评论</span>
            </mb-button>
        </div>
        <mb-skeleton v-if="isEmpty"/>
        <comment-item v-for="item in comments" :key="item.id" :data="item"/>
        <mb-pagination v-if="mainCount > 0" :total="mainCount" scroll-target=".comment-area" v-model="page"/>
    </meow-widget>
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