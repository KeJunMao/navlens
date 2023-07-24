<script lang="ts" setup>
import { CRUD } from "#components";
import { searchGroupDtoSchema } from "@/dto/group.dto";
const crud = ref<InstanceType<typeof CRUD>>();
</script>

<template>
  <CRUD ref="crud" :search-schema="searchGroupDtoSchema" search-url="/api/admin/group">
    <template #search="{ state }">
      <UFormGroup label="Name" path="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Code" path="code">
        <UInput v-model="state.code" />
      </UFormGroup>
    </template>
  </CRUD>
</template>
