<script lang="ts" setup>
  const props = defineProps<{
    src: string;
  }>();

  const slots = defineSlots<{
    default?: () => VNode[];
  }>();

  const [isLoaded, toggleLoadded] = useToggle(false);

  const vnode = computed(() => {
    return slots.default?.()[0];
  });

  const src = computed(() => (
    isLoaded.value ? vnode.value?.props?.src : props.src
  ));

  onMounted(() => {
    const img = new Image();

    img.src = vnode.value?.props?.src;
    img.sizes = vnode.value?.props?.sizes;
    img.srcset = vnode.value?.props?.srcset;

    if (img.src || img.sizes || img.srcset) {
      img.decode().then(() => toggleLoadded(true)).catch(() => {});
    }
  });
</script>

<template>
  <component :is="vnode" :src/>
</template>
