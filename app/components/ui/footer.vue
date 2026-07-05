<script lang="ts" setup>
  import { Temporal } from "temporal-polyfill";

  const today = Temporal.Now.plainDateISO();
  const days = today.since("2022-09-30").days;

  const icps = [
    {
      title: "萌ICP备20230904号",
      to: "https://icp.gov.moe/?keyword=20230904",
    },
    {
      title: "浙ICP备2024064887号",
      to: "https://beian.miit.gov.cn",
    },
  ];
</script>

<template>
  <footer class="z-footer">
    <p>茶馆已营业 {{ days }} 天・おはびかり・</p>
    <p>
      <cite>Copyright © 2022-{{ today.year }} KazariEX</cite>
      <template v-for="{ title, to } in icps">
        <span class="footer-seperator">｜</span>
        <nuxt-link :to target="_blank">{{ title }}</nuxt-link>
      </template>
    </p>
  </footer>
</template>

<style scoped>
  .z-footer {
    padding-inline: var(--meow-large);
    font-size: 14px;
    text-align: center;

    @media (width >= 596px) {
      padding-block: 16px;
      border-radius: 16px;
      box-shadow: var(--box-shadow);
      background-image: linear-gradient(to right, var(--color-theme), var(--color-theme-dark));
      line-height: 24px;
      text-shadow: var(--text-shadow);
      color: white;
    }

    @media (width < 596px) {
      margin-top: auto;
      padding-block: 64px 32px;
      line-height: 1.8;
      color: var(--color-text-secondary);
    }
  }

  .footer-seperator:first-of-type {
    @media (width < 596px) {
      display: block;
      visibility: hidden;
      height: 0;
    }
  }
</style>
