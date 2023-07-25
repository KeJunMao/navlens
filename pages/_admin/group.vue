<script lang="ts" setup>
import { CRUD } from "#components";
import { searchGroupDtoSchema, createGroupDtoSchema } from "@/dto/group.dto";
useSeoMeta({
  title: "分组管理",
});

const crud = ref<InstanceType<typeof CRUD>>();
</script>

<template>
  <CRUD
    ref="crud"
    :search-schema="searchGroupDtoSchema"
    :create-schema="createGroupDtoSchema"
    api-path="/api/admin/group"
  >
    <template #search="{ state }">
      <UFormGroup label="名称" path="name">
        <UInput placeholder="请输入名称" v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="编码" path="code">
        <UInput placeholder="请输入编码" v-model="state.code" />
      </UFormGroup>
    </template>
    <template #create="{ state, isView }">
      <UFormGroup label="名称" path="name">
        <UInput
          placeholder="请输入名称"
          v-model="state.name"
          :readonly="isView"
        />
      </UFormGroup>
      <UFormGroup label="编码" path="code">
        <UInput
          placeholder="请输入编码"
          v-model="state.code"
          :readonly="isView"
        />
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
