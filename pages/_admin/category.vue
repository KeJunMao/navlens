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
  const groups = await $fetch("/api/admin/group", {
    query: { name: q },
  });

  return groups?.map((group: any) => ({
    id: group.id,
    label: group.name,
  }));
};
</script>

<template>
  <CRUD
    ref="crud"
    :search-schema="searchCategoryDtoSchema"
    :create-schema="createCategoryDtoSchema"
    model-name="category"
    api-path="/api/admin/category"
    :viewDataTransform="(data: any)=> ({
      ...data,
      group: data.groupId ? {
        id: data.groupId,
        label: data.groupName,
      } : null
    })"
    :saveDataTransform="({group={}, ...data}: any)=> ({
      ...data,
      groupId: group?.id
    })"
  >
    <template #search="{ state }">
      <UiFormGroup label="名称" path="name">
        <UInput placeholder="请输入名称" v-model="state.name" />
      </UiFormGroup>
      <UFormGroup label="所属组名称" path="groupName">
        <UInput placeholder="请输入所属组名称" v-model="state.groupName" />
      </UFormGroup>
    </template>
    <template #create="{ state, isView }">
      <UiFormGroup label="名称" path="name">
        <UInput
          placeholder="请输入名称"
          v-model="state.name"
          :readonly="isView"
        />
      </UiFormGroup>
      <UiFormGroup name="group" label="分组" path="groupId">
        <template v-if="isView">
          <UInput :value="state.groupName" readonly />
        </template>
        <USelectMenu
          v-else
          v-model="state.group"
          :searchable="search"
          placeholder="请搜索并选择分组"
          by="id"
        />
      </UiFormGroup>
      <UiFormGroup
        label="图标"
        path="icon"
        description="访问 https://icones.js.org 预览所有图标"
      >
        <UInput
          placeholder="请输入图标"
          v-model="state.icon"
          :readonly="isView"
        />
      </UiFormGroup>
    </template>
  </CRUD>
</template>
