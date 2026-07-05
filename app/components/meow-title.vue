<template>
  <h3 class="meow-title"><slot></slot></h3>
</template>

<style scoped>
  .meow-title {
    width: fit-content;
    margin-bottom: 4px;

    &::after {
      content: "";
      display: block;
      margin: -9px -4px 0;
      padding: 5px;
      background-color: var(--color-theme);
    }
  }
</style>
