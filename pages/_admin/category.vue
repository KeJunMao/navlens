<script lang="ts" setup>
import { CRUD } from "#components";
import {
  searchCategoryDtoSchema,
  createCategoryDtoSchema,
} from "@/dto/category.dto";
const crud = ref<InstanceType<typeof CRUD>>();

useSeoMeta({
  title: "分类管理",
});

const search = async (q: string) => {
  const { result: groups } = await $fetch("/api/admin/group", {
    query: { name: q },
  });
  return groups?.map(({ name, id }: any) => ({
    id,
    name,
  }));
};

const groupSelect = ref();
function computedGroupName(id: any) {
  return (
    groupSelect.value?.filteredOptions?.find((v: any) => v.id === id)?.name ??
    "无效分组"
  );
}
</script>

<template>
  <CRUD
    ref="crud"
    :search-schema="searchCategoryDtoSchema"
    :create-schema="createCategoryDtoSchema"
    model-name="category"
    api-path="/api/admin/category"
    :columns="[
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: '名称',
      },
      {
        key: 'groupName',
        label: '所属组',
      },
      {
        key: 'icon',
        label: '图标',
      },
      {
        key: 'sort',
        label: '排序',
      },
    ]"
  >
    <template #search="{ state }">
      <UFormGroup label="名称" name="name">
        <UInput placeholder="请输入名称" v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="所属组名称" name="groupName">
        <UInput placeholder="请输入所属组名称" v-model="state.groupName" />
      </UFormGroup>
    </template>
    <template #create="{ state, isView }">
      <UFormGroup label="名称" name="name">
        <UInput
          placeholder="请输入名称"
          v-model="state.name"
          :readonly="isView"
        />
      </UFormGroup>
      <UFormGroup name="groupId" label="分组">
        {{ state }}
        <template v-if="isView">
          <UInput :value="state.groupName" readonly />
        </template>
        <USelectMenu
          v-else
          ref="groupSelect"
          v-model="state.groupId"
          value-attribute="id"
          option-attribute="name"
          :searchable="search"
          placeholder="请搜索并选择分组"
        >
          <template #label v-if="state.groupId !== undefined">
            {{ computedGroupName(state.groupId) }}
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup
        label="图标"
        path="icon"
        description="访问 https://icones.js.org 预览所有图标"
      >
        <UInput
          placeholder="请输入图标"
          v-model="state.icon"
          :readonly="isView"
        />
      </UFormGroup>
    </template>
  </CRUD>
</template>
