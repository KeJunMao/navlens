<script lang="ts" setup>
import { hash } from "ohash";
import { CRUD } from "#components";
import { searchSiteDtoSchema, createSiteDtoSchema } from "@/dto/site.dto";
const crud = ref<InstanceType<typeof CRUD>>();

const search = async (q: string) => {
  const groups = await $fetch("/api/admin/category", {
    query: { name: q },
  });

  return groups?.map((group: any) => ({
    id: group.id,
    label: group.name,
  }));
};
const defaultUrl = {
  id: hash(new Date()),
  link: "",
  label: "",
};
</script>

<template>
  <CRUD
    ref="crud"
    :search-schema="searchSiteDtoSchema"
    :create-schema="createSiteDtoSchema"
    api-path="/api/admin/site"
    :viewDataTransform="(data: any)=> ({
      ...data,
      categories: data.categories ?  data.categories.map((v:any)=>({...v, label: v.name})) : [],
      urls: data.urls ?  data.urls : [defaultUrl]
    })"
    :saveDataTransform="({categories,urls, ...data}: any)=> ({
      ...data,
      categoryIds: categories.map((v:any)=>v.id),
      urls: urls.map((data:any)=> {
        const { id, ...url} = data
        if (typeof id === 'number'){
          url.id = id
        }
        return url
      })
    })"
    :columns="[
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'description',
        label: 'Description',
      },
      {
        key: 'icon',
        label: 'Icon',
      },
    ]"
  >
    <template #search="{ state }">
      <UFormGroup label="名称" path="name">
        <UInput placeholder="请输入名称" v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="简介" path="description">
        <UInput placeholder="请输入简介" v-model="state.description" />
      </UFormGroup>
      <UFormGroup label="所属类名称" path="categoryName">
        <UInput placeholder="请输入所属类名称" v-model="state.categoryName" />
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
      <UiFormGroup label="简介" path="description">
        <UInput
          placeholder="请输入简介"
          v-model="state.description"
          :readonly="isView"
        />
      </UiFormGroup>
      <UiFormGroup name="categories" label="所属类" path="categories">
        <template v-if="isView">
          <UInput
            :value="state.categories.map((v:any) => v.name).join(', ')"
            readonly
          />
        </template>
        <USelectMenu
          v-else
          v-model="state.categories"
          :searchable="search"
          placeholder="请搜索并选择类别"
          by="id"
          multiple
        />
      </UiFormGroup>
      <UiFormGroup
        label="图标"
        path="icon"
        description="访问 https://icones.js.org 预览所有图标"
      >
        <div class="flex space-x-2 items-center">
          <FetchIcon :name="state.icon" />
          <UInput
            placeholder="请输入图标"
            v-model="state.icon"
            :readonly="isView"
            :ui="{
              wrapper: 'relative flex-1',
            }"
          >
          </UInput>
        </div>
      </UiFormGroup>
      <UiFormGroup path="urls">
        <div
          class="flex space-x-2"
          v-for="(item, index) in state.urls"
          :key="item.id"
        >
          <UiFormGroup class="w-1/4" :path="`urls.${index}.label`" label="名称">
            <UInput
              v-model="item.label"
              placeholder="请输入名称"
              icon="i-heroicons-tag"
              :readonly="isView"
            />
          </UiFormGroup>
          <UiFormGroup class="flex-1" :path="`urls.${index}.link`" label="链接">
            <UInput
              v-model="item.link"
              placeholder="请输入链接"
              icon="i-heroicons-link"
              :readonly="isView"
            />
          </UiFormGroup>
          <div class="flex space-x-1 mt-6" v-if="!isView">
            <UButton
              color="white"
              size="sm"
              class="rounded-full"
              icon="i-heroicons-plus-circle"
              @click="
                state.urls.push({
                  link: '',
                  label: '',
                  id: hash(new Date()),
                })
              "
            ></UButton>
            <UButton
              :disabled="state.urls.length <= 1"
              color="white"
              size="sm"
              class="rounded-full"
              icon="i-heroicons-minus-circle"
              @click="state.urls.splice(index, 1)"
            ></UButton>
          </div>
        </div>
      </UiFormGroup>
    </template>
  </CRUD>
</template>
