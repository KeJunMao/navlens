<script lang="ts" setup>
import { AdminCategoryForm } from "#components";

useSeoMeta({
  title: "Category",
});
const q = ref("");
const toast = useToast();

const form = ref<InstanceType<typeof AdminCategoryForm> | null>();
const { data: category, pending, refresh } = useFetch(`/api/category?q=${q.value}`);
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
          description: "删除分类将删除该分类下的所有数据",
          actions: [
            {
              variant: "solid",
              color: "primary",
              label: "确认",
              click: async () => {
                await $fetch(`/api/category/${row.id}`, {
                  method: "DELETE",
                });
                refresh()
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
  <AdminCategoryForm ref="form" @refresh="refresh" />
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

    <UTable :rows="category" :columns="columns" :loading="pending">
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
