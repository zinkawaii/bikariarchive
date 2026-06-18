<script lang="ts" setup>
  import { Temporal } from "temporal-polyfill";
  import type { FetchResult } from "#app";

  useHead({
    title: "阅读记录",
  });

  const page = ref(1);

  const { execute, data } = useLazyFetch("/api/read-record", {
    query: {
      page,
    },
  });

  const records = ref<FetchResult<"/api/read-record", "get">["list"]>([]);
  watchImmediate(data, (val) => {
    records.value = val?.list ?? [];
  });

  async function remove(id: string, i: number) {
    await $fetch("/api/read-record", {
      method: "delete",
      body: {
        id,
      },
    });

    records.value.splice(i, 1);
    if (records.value.length) {
      return;
    }

    const { total, sizes } = data.value!;
    const totalPages = Math.max(1, Math.ceil(total / sizes));
    if (page.value === totalPages && page.value > 1) {
      page.value -= 1;
    }
    else {
      execute();
    }
  }

  function formatTime(time: string) {
    return Temporal.Instant.from(time).toLocaleString("sv");
  }
</script>

<template>
  <meow-widget title="阅读记录">
    <meow-table class="manage-table">
      <tbody>
        <tr>
          <th width="60">序号</th>
          <th>IP</th>
          <th width="176">时间</th>
          <th width="96">小说</th>
          <th width="96">章节</th>
          <th width="96">用户</th>
          <th width="1%">操作</th>
        </tr>
        <tr v-for="(item, i) in records" :key="item._id">
          <th>{{ i + 1 }}</th>
          <td>{{ item.ip }}</td>
          <td>{{ formatTime(item.time) }}</td>
          <td>{{ item.novel }}</td>
          <td>{{ item.index }}</td>
          <td>{{ item.user?.uid || "--" }}</td>
          <td class="manage-operators">
            <mb-button>
              <iconify name="fa7-solid:pencil"/>
            </mb-button>
            <mb-button @click="remove(item._id, i)">
              <iconify name="fa7-solid:trash-can"/>
            </mb-button>
          </td>
        </tr>
      </tbody>
    </meow-table>
    <mb-pagination class="manage-pagination" :total="data?.total ?? 0" :sizes="data?.sizes" v-model="page"/>
  </meow-widget>
</template>

<style lang="scss" scoped>
  .manage-table {
    --font-size-td: 14px;

    text-align: center;
    text-wrap: nowrap;
  }

  .manage-operators {
    > .mb-button {
      width: 24px;
      aspect-ratio: 1;
      padding: 0;
    }
  }

  .manage-pagination {
    margin-top: var(--meow-medium);
  }
</style>
