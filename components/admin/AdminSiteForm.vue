<script setup lang="ts">
import { hash } from "ohash";
const { isOpen, setup, close, title, data, save, errors, clearError, loading } =
  useFormDialog({
    data: {
      name: "",
      icon: "",
      description: "",
      categoryIds: [] as number[],
      urls: [
        {
          id: hash(new Date()),
          link: "",
          label: "",
        },
      ],
    },
    rules: createSiteDtoSchema,
  });

async function saveHandler(body: any) {
  if (body.id) {
    await $fetch(`/api/admin/site/${body.id}`, {
      method: "PUT",
      body,
    });
  } else {
    await $fetch("/api/admin/site", {
      method: "POST",
      body,
    });
  }
  emit("refresh");
}

const search = async (q: string) => {
  const groups = await $fetch("/api/admin/category", {
    query: { q },
  });

  return groups
    ?.map((group: any) => ({
      id: group.id,
      label: group.name,
    }))
    ?.filter(Boolean);
};

const selected = ref([]);
watchEffect(
  () => (data.value.categoryIds = selected.value?.map((v: any) => v.id))
);
const emit = defineEmits<{
  (event: "refresh"): void;
}>();
defineExpose({
  setup,
  close,
});
</script>

<template>
  <div>
    <UModal v-model="isOpen">
      <UCard>
        <template #header> {{ title }} </template>
        <form
          class="flex space-y-4 flex-col"
          @submit.stop.prevent="save(saveHandler)"
          @reset="clearError"
        >
          <UFormGroup
            name="categoryId"
            label="分类"
            :error="errors.categoryIds"
          >
            <USelectMenu
              v-model="selected"
              :searchable="search"
              placeholder="搜索分类"
              multiple
              by="id"
            />
          </UFormGroup>
          <UFormGroup name="name" label="名称" :error="errors.name">
            <UInput
              v-model="data.name"
              placeholder="请输入名称"
              icon="i-heroicons-computer-desktop"
            />
          </UFormGroup>
          <UFormGroup
            name="description"
            label="简介"
            :error="errors.description"
          >
            <UInput
              v-model="data.description"
              placeholder="请输入简介"
              icon="i-heroicons-chat-bubble-left-ellipsis"
            />
          </UFormGroup>
          <UFormGroup name="icon" label="图标" :error="errors.icon">
            <UInput
              v-model="data.icon"
              placeholder="请输入图标"
              icon="i-heroicons-information-circle"
            />
          </UFormGroup>
          <div class="h-[1px] bg-gray-100 dark:bg-gray-800"></div>
          <UFormGroup :error="errors.urls" name="urls">
            <div
              class="flex space-x-2 items-end"
              v-for="(item, index) in data.urls"
              :key="item.id"
            >
              <UFormGroup class="w-1/4" name="label" label="名称">
                <UInput
                  v-model="item.label"
                  placeholder="请输入名称"
                  icon="i-heroicons-tag"
                />
              </UFormGroup>
              <UFormGroup class="flex-1" name="link" label="链接">
                <UInput
                  v-model="item.link"
                  placeholder="请输入链接"
                  icon="i-heroicons-link"
                />
              </UFormGroup>
              <div class="flex space-x-1">
                <UButton
                  color="white"
                  size="sm"
                  class="rounded-full"
                  icon="i-heroicons-plus-circle"
                  @click="
                    data.urls.push({
                      link: '',
                      label: '',
                      id: hash(new Date()),
                    })
                  "
                ></UButton>
                <UButton
                  :disabled="data.urls.length <= 1"
                  color="white"
                  size="sm"
                  class="rounded-full"
                  icon="i-heroicons-minus-circle"
                  @click="data.urls.splice(index, 1)"
                ></UButton>
              </div>
            </div>
          </UFormGroup>
          <div class="flex space-x-2 justify-end">
            <UButton color="white" type="reset" :disabled="loading">
              重置
            </UButton>
            <UButton type="submit" :loading="loading">保存</UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>
