<template>
  <div class="home-update content-widget">
    <meow-title>历史章节</meow-title>
    <recent-article type="novel" :sizes="10"/>
  </div>
</template>

<style scoped>
  .home-update {
    grid-area: A;
    width: 256px;
    padding: 16px var(--meow-large) var(--meow-medium);

    @media (width < 596px) {
      width: 100%;

      > .recent-article {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 16px;
      }
    }
  }
</style>
