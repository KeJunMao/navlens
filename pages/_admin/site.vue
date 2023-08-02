<script lang="ts" setup>
import { hash } from "ohash";
import { CRUD } from "#components";
import { searchSiteDtoSchema, createSiteDtoSchema } from "@/dto/site.dto";

useSeoMeta({
  title: "站点管理",
});

const crud = ref<InstanceType<typeof CRUD>>();

const search = async (q: string) => {
  const { result } = await $fetch("/api/admin/category", {
    query: { name: q },
  });
  return result?.map(({ id, name }: any) => ({
    id,
    name,
  }));
};
const defaultUrl = () => ({
  id: hash(new Date()),
  link: "",
  label: "",
});
</script>

<template>
  <CRUD
    model-name="site"
    ref="crud"
    :search-schema="searchSiteDtoSchema"
    :create-schema="createSiteDtoSchema"
    api-path="/api/admin/site"
    :viewDataTransform="(data: any)=> ({
      ...data,
      categoryIds: data.categories ?  data.categories.map((v:any)=>v.id) : [],
      urls: data.urls ?  data.urls : [defaultUrl]
    })"
    :copyDataTransform="(data: any)=> ({
      ...data,
      urls: data.urls ?  data.urls.map(({id, ...url}: any)=> ({...url})) : [defaultUrl()]
    })"
    :saveDataTransform="({categories,urls, ...data}: any)=> ({
      ...data,
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
        label: '名称',
      },
      {
        key: 'description',
        label: '简介',
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
      <UFormGroup label="简介" name="description">
        <UInput placeholder="请输入简介" v-model="state.description" />
      </UFormGroup>
      <UFormGroup label="所属类名称" name="categoryName">
        <UInput placeholder="请输入所属类名称" v-model="state.categoryName" />
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
      <UFormGroup label="简介" name="description">
        <UInput
          placeholder="请输入简介"
          v-model="state.description"
          :readonly="isView"
        />
      </UFormGroup>
      <UFormGroup label="所属类" name="categoryIds">
        <template v-if="isView">
          <UInput
            :value="state.categories.map((v:any) => v.name).join(', ')"
            readonly
          />
        </template>
        <USelectMenu
          v-else
          v-model="state.categoryIds"
          :searchable="search"
          value-attribute="id"
          option-attribute="name"
          placeholder="请搜索并选择类别"
          multiple
        />
      </UFormGroup>
      <UFormGroup
        label="图标"
        name="icon"
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
      </UFormGroup>
      <UFormGroup paht="showQrcode" name="showQrcode">
        <UCheckbox
          label="悬停显示二维码而非链接"
          v-model="state.showQrcode"
          :disabled="isView"
        />
      </UFormGroup>
      <UFormGroup name="urls">
        <div
          class="flex space-x-2"
          v-for="(item, index) in state.urls"
          :key="item.id"
        >
          <UFormGroup class="w-1/4" :name="`urls.${index}.label`" label="名称">
            <UInput
              v-model="item.label"
              placeholder="请输入名称"
              icon="i-heroicons-tag"
              :readonly="isView"
            />
          </UFormGroup>
          <UFormGroup class="flex-1" :name="`urls.${index}.link`" label="链接">
            <UInput
              v-model="item.link"
              placeholder="请输入链接"
              icon="i-heroicons-link"
              :readonly="isView"
            />
          </UFormGroup>
          <div class="flex space-x-1 mt-6" v-if="!isView">
            <UButton
              color="white"
              size="sm"
              class="rounded-full"
              icon="i-heroicons-plus-circle"
              @click="
                state.urls.splice(index + 1, 0, {
                  id: hash(new Date()),
                  label: '',
                  link: '',
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
      </UFormGroup>
    </template>
    <template #table-description-data="{ row }">
      {{ row.description || "暂无简介" }}
    </template>
  </CRUD>
</template>
