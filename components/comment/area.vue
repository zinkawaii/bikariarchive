<script lang="ts" setup>
    const commentStore = useCommentStore();
    const commentPanelStore = useCommentPanelStore();
    const route = useRoute();

    const $self = ref();
    const page = ref(1);
    const { data: comments, totalCount, mainCount } = storeToRefs(commentStore);

    //相对视口懒加载
    let stop = null;
    watchImmediate([() => route.path, page], () => {
        //终止未触发的观测器
        stop?.(), { stop } = useIntersectionObserver($self, ([{ isIntersecting }]) => {
            if (isIntersecting) {
                commentStore.update(page.value);
                stop();
            }
        });
    });
</script>

<template>
    <coco-widget ref="$self" class="comment-area">
        <div class="comment-title">
            <h2>评论<span class="comment-count">{{ totalCount }}</span></h2>
            <mb-button @click="commentPanelStore.open()">
                <icon name="fa6-solid:comment-dots"/>
                <span>发表评论</span>
            </mb-button>
        </div>
        <mb-skeleton v-if="!comments"/>
        <comment-item v-for="item in comments" :key="item.id" :data="item" root/>
        <mb-pagination v-if="mainCount > 0" :total="mainCount" scroll-target=".z-comment" v-model="page"/>
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