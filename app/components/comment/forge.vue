<script lang="ts" setup>
  import type { BasicForgeProps } from "~/components/basic-forge.vue";

  const props = withDefaults(defineProps<BasicForgeProps>(), {
    lang: "js",
    meta: "",
    raw: "",
  });
</script>

<template>
  <basic-forge v-slot="{ html }" class="shiki" v-bind="props">
    ```{{ lang }}
    <pre class="edge-fades-x no-scrollbar" v-html="html"></pre>
    ```
  </basic-forge>
</template>

<style scoped>
  .shiki {
    display: grid;
    margin-block: 0.5em -0.5em;
    padding-top: 0.5em;
    font-family: var(--font-monospace);
    font-size: 14px;
    line-height: 20px;
  }
</style>
