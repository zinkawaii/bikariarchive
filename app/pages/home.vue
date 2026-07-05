<script lang="ts" setup>
  definePageMeta({
    path: "/",
    jumbotron: true,
  });

  const config = useRuntimeConfig();

  useHead({
    title: config.public.subtitle,
    titleTemplate: "%site.name ~ %s ~",
  });
</script>

<template>
  <meow-widget class="home-brief">
    <home-welcome />
    <home-introduction />
    <home-profile />
  </meow-widget>
  <div class="home-complex">
    <home-update />
    <home-calendar />
    <home-blank />
  </div>
  <home-tabulars />
</template>

<style scoped>
  .home-brief {
    display: grid;
    grid-template:
      "A A"
      "B C" / 1fr 40%;
    gap: var(--meow-medium);

    @container main (width < 768px) {
      grid-template: "A" "B" "C";
    }
  }

  .home-complex {
    display: grid;
    grid-template:
      "A B" auto
      "A C" 1fr / auto 1fr;
    gap: 16px;

    @media (width < 596px) {
      grid-template: "A" "B" "C";

      > .content-widget {
        padding: 0 var(--meow-medium);
      }
    }
  }
</style>
