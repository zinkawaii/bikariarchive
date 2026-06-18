export interface UsePaginationOptions {
  sizes?: MaybeRefOrGetter<number>;
}

export function usePagination<T>(arr: MaybeRefOrGetter<T[]>, options: UsePaginationOptions = {}) {
  const page = ref(1);

  watch(arr, () => {
    page.value = 1;
  });

  const total = computed(() => {
    return toValue(arr).length;
  });

  const sizes = computed(() => {
    return toValue(options.sizes ?? 10);
  });

  const paginatedList = computed(() => {
    const start = (page.value - 1) * sizes.value;
    const end = start + sizes.value;
    return toValue(arr).slice(start, end);
  });

  return {
    page,
    total,
    sizes,
    paginatedList,
  };
}
