<script lang="ts" setup>
  const settingStore = useSettingStore();
</script>

<template>
  <mb-dialog class="z-setting" @close="settingStore.close()">
    <meow-title>全局设置</meow-title>
    <setting-form title="主题颜色" desc="仅在非夜间模式下生效">
      <setting-select :options="[`初空`, `菖蒲`, `早樱`]" v-model="settingStore.settings.theme"/>
    </setting-form>
    <setting-form title="夜间模式" desc="每天早晚 6 点自动切换">
      <setting-select :options="[`自动`, `白昼`, `暗夜`]" v-model="settingStore.settings[`dark-mode`]"/>
    </setting-form>
    <setting-form title="侧栏显隐" desc="侧边栏是否跟随其他 UI 折叠">
      <setting-select :options="[`默认`, `显现`, `隐匿`]" v-model="settingStore.settings[`aside-display`]"/>
    </setting-form>
    <setting-form title="右键菜单" :desc="`按住 Ctrl 键唤起${settingStore.get(`contextmenu`) ? `原生` : `自定义`}菜单`">
      <setting-switch v-model="settingStore.settings.contextmenu"/>
    </setting-form>
    <setting-form title="交互模块" desc="是否开启评论区等交互功能">
      <setting-switch v-model="settingStore.settings.interaction"/>
    </setting-form>
  </mb-dialog>
</template>

<style scoped>
  .z-setting {
    width: 556px;

    @media (width < 425px) {
      --dialog-padding: 1rem;

      height: 100dvh;
      border-radius: 0;
    }
  }

  .setting-form {
    margin-top: 16px;

    + .meow-title {
      margin-top: 32px;
    }
  }

  .setting-input {
    display: flex;
    gap: 16px;
  }
</style>
