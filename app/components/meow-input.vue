<script lang="ts" setup>
  defineOptions({
    inheritAttrs: false,
  });
  defineProps<{
    placeholder: string;
  }>();
  const modelValue = defineModel<string>();
  const error = defineModel<boolean>("error");
</script>

<template>
  <div class="meow-input">
    <input class="input-entity" placeholder="" v-bind="$attrs" v-model="modelValue" @blur="error = false"/>
    <span class="input-underline"></span>
    <span class="input-placeholder" :class="{ [`is-error`]: error }">{{ placeholder }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .meow-input {
    display: grid;
    position: relative;
    line-height: 20px;
  }

  .input-entity {
    padding: 4px;

    &:where(:focus) {
      ~ .input-underline::before {
        scale: 1;
      }

      ~ .input-placeholder {
        color: var(--color-theme-text);
      }
    }

    &:where(:focus, :not(:placeholder-shown)) {
      ~ .input-placeholder {
        top: -1em;
        font-size: 12px;
        line-height: 1;
      }
    }
  }

  .input-underline {
    height: 1px;
    background-color: var(--color-border-lighter);

    &::before {
      content: "";
      display: block;
      height: 1px;
      background-color: var(--color-theme-dark);
      transform-origin: left;
      transition: scale 0.4s;
      scale: 0 1;
    }
  }

  .input-placeholder {
    position: absolute;
    top: 4px;
    left: 4px;
    color: var(--color-info);
    transition: all 0.25s;
    pointer-events: none;

    &.is-error {
      color: var(--color-danger);
    }
  }
</style>
