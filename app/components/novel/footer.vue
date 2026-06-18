<script lang="ts" setup>
  defineProps<{
    art: Article;
  }>();
</script>

<template>
  <footer class="novel-footer">
    <p v-if="art.ending" class="novel-endding">THE END</p>
    <div class="novel-copyright p-small">
      <div class="copyright-wrapper">
        <div class="copyright-crumb">
          <span>{{ art.novelInfo.title }}</span>
          <iconify class="text-gray" name="fa7-solid:chevron-right"/>
          <span>{{ art.volumeInfo.title }}</span>
          <iconify class="text-gray" name="fa7-solid:chevron-right"/>
          <span>{{ art.title }}</span>
        </div>
        <p class="text-gray">本网站的所有文章除特别声明外，转载均需经过作者本人同意；文章内容仅供个人交流用，禁作商业用途。</p>
      </div>
    </div>
    <div class="novel-adjacents">
      <novel-adjacent v-if="art.prev" :art="art.prev" type="prev"/>
      <novel-adjacent v-if="art.next" :art="art.next" type="next"/>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
  .novel-endding {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    margin-top: 16px;
    font-size: 13px;
    color: var(--color-gray-300);

    &::before, &::after {
      content: "";
      width: 20%;
      height: 1px;
      background-color: var(--color-border-light);
    }
  }

  .novel-copyright {
    margin-top: 24px;
    padding: 4px;
    border: 1px solid var(--color-border-lighter);
    border-radius: 16px;
    background-color: var(--color-background);
    text-align: center;
  }

  .copyright-wrapper {
    padding: 1em;
    border: 4px dashed var(--color-border-lighter);
    border-radius: 12px;
  }

  .copyright-crumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    column-gap: 6px;
    margin-bottom: 4px;
  }

  .novel-adjacents {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;

    &:empty {
      display: none;
    }
  }
</style>
