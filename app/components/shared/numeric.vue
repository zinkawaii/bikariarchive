<script lang="ts" setup>
  const props = withDefaults(defineProps<{
    accuracy?: number;
    min?: number;
    max?: number;
    step?: number;
    controls?: boolean;
    readonly?: boolean;
    trim?: boolean;
  }>(), {
    accuracy: 0,
    min: -Infinity,
    max: Infinity,
    step: 1,
  });
  const modelValue = defineModel<number>({
    required: true,
  });

  const numberRE = /^([-+]?\d*)(\.\d*)?$/;
  const displayValue = ref("");
  const [isInvalid, toggleInvalid] = useToggle(false);

  //记录旧值
  let oldValue: number, oldDisplayValue: string;

  //响应源数据变化
  watchImmediate(modelValue, (val: number) => {
    if (val !== oldValue) {
      oldDisplayValue = String(val);
      oldValue = val;
      onBlur();
    }
  });

  //输入时
  function onInput() {
    const match = displayValue.value.match(numberRE);
    if (!match) {
      toggleInvalid(true);
      return;
    }

    const d = match[2] || ".";
    if (d.length > props.accuracy + 1) {
      toggleInvalid(true);
      return;
    }

    const str = match[1] + d;
    const val = Number(str) || 0;
    if (val < props.min || val > props.max) {
      toggleInvalid(true);
      return;
    }

    oldDisplayValue = str;
    modelValue.value = oldValue = val;
    toggleInvalid(false);
  }

  //失焦时
  function onBlur() {
    const match = oldDisplayValue.match(numberRE)!;
    const i = Number(match[1]) || "0";

    let d = match[2] || ".";
    if (props.accuracy) {
      d = d.padEnd(props.accuracy + 1, "0");
    }
    if (props.trim) {
      d = d.replace(/0+$/, "");
    }
    if (d === ".") {
      d = "";
    }

    //规整格式
    displayValue.value = i + d;
    toggleInvalid(false);
  }
</script>

<template>
  <div class="mb-numeric" :class="{ [`is-invalid`]: isInvalid }">
    <button
      v-if="controls"
      class="numeric-arrow"
      :class="{ [`is-disabled`]: readonly || modelValue - step < min }"
      @click="modelValue -= step"
    >
      <iconify name="fa7-solid:chevron-left"/>
    </button>
    <input
      class="numeric-entity"
      :readonly
      v-model="displayValue"
      @input="onInput"
      @blur="onBlur"
    />
    <button
      v-if="controls"
      class="numeric-arrow"
      :class="{ [`is-disabled`]: readonly || modelValue + step > max }"
      @click="modelValue += step"
    >
      <iconify name="fa7-solid:chevron-right"/>
    </button>
  </div>
</template>

<style scoped>
  .mb-numeric {
    display: flex;
    position: relative;
    height: 2rem;
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    outline: 2px solid transparent;
    outline-offset: -1px;
    background-color: var(--color-background);
    transition: outline 0.25s;

    &:focus-within {
      outline-color: var(--color-theme-dark);
    }

    &.is-invalid {
      outline-color: var(--color-danger);
    }
  }

  .numeric-arrow {
    display: grid;
    place-items: center;
    position: absolute;
    height: 100%;
    aspect-ratio: 1;
    background-color: var(--color-gray-900);
    color: var(--color-text-secondary);
    transition: color 0.25s;

    &:hover {
      color: var(--color-theme-text);
    }

    &:first-child {
      left: 0;
      border-right: 1px solid var(--color-border-light);
      border-radius: 5px 0 0 5px;
    }

    &:last-child {
      right: 0;
      border-left: 1px solid var(--color-border-light);
      border-radius: 0 5px 5px 0;
    }

    &.is-disabled {
      color: var(--color-text-disabled);
      pointer-events: none;
    }
  }

  .numeric-entity {
    width: 100%;
    text-align: center;
  }
</style>
