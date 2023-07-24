<script lang="ts" setup>
import { AdminSiteForm } from "#components";

useSeoMeta({
  title: "Site",
});
const q = ref("");
const toast = useToast();

const form = ref<InstanceType<typeof AdminSiteForm> | null>();
const { data: sites, pending, refresh } = useFetch(`/api/admin/site?q=${q.value}`);
const columns = [
  {
    key: "id",
    label: "ID",
    class: "w-6",
  },
  {
    key: "name",
    label: "名称",
  },
  {
    key: "description",
    label: "简介",
  },
  {
    key: "icon",
    label: "图标",
    class: "w-1/6",
  },
  {
    key: "actions",
    class: "w-5",
  },
];
const acitons = (row: any) => [
  [
    {
      label: "编辑",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => form.value?.setup("update", row),
    },
    {
      label: "复制",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "删除",
      icon: "i-heroicons-trash-20-solid",
      slot: "delete",
      click: () => {
        toast.add({
          title: "确认要删除吗？",
          actions: [
            {
              variant: "solid",
              color: "primary",
              label: "确认",
              click: async () => {
                await $fetch(`/api/admin/site/${row.id}`, {
                  method: "DELETE",
                });
                refresh();
              },
            },
          ],
        });
      },
    },
  ],
];
</script>

<template>
  <AdminSiteForm ref="form" @refresh="refresh" />
  <UCard>
    <template #header>
      <div class="flex space-x-2 justify-between">
        <div class="flex space-x-2">
          <UInput v-model="q" placeholder="关键词搜索" />
        </div>
        <UButton
          icon="i-heroicons-plus-circle"
          color="gray"
          @click="form?.setup()"
          >新增</UButton
        >
      </div>
    </template>

    <UTable :rows="sites" :columns="columns" :loading="pending">
      <template #icon-data="{ row }">
        <FetchIcon v-if="row?.icon" :name="row.icon" class="text-xl" />
        <template v-else>无</template>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="acitons(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>
  </UCard>
</template>
