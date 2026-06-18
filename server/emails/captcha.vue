<script lang="ts" setup>
  defineProps<{
    captcha: string;
  }>();
</script>

<template>
  <p>您好：</p>
  <p>您本次在微光茶馆注册的验证码为 {{ captcha }}，请在三十分钟内前往茶馆用茶。<br />如果您没有在本站注册账号，请无视这封邮件，或发送邮件至 zinkawaii@qq.com 告知情况。</p>
  <p>祝好，<br />山吹色御守</p>
  <p>https://archive.bikari.top</p>
</template>
