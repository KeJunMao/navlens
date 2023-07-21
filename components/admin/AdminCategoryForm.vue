<script setup lang="ts">
const { isOpen, setup, close, title, data, save, errors, clearError, loading } =
  useFormDialog({
    data: {
      name: "",
      icon: "",
      groupId: "",
    },
    rules: createCategoryDtoSchema,
  });

async function saveHandler(body: any) {
  if (body.id) {
    await $fetch(`/api/category/${body.id}`, {
      method: "PUT",
      body,
    });
  } else {
    await $fetch("/api/category", {
      method: "POST",
      body,
    });
  }
  emit("refresh");
}

const search = async (q: string) => {
  const groups = await $fetch("/api/group", {
    query: { q },
  });

  return groups
    ?.map((group: any) => ({
      id: group.id,
      label: group.name,
    }))
    ?.filter(Boolean);
};

const selected = ref();
watchEffect(() => (data.value.groupId = selected.value?.id));
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
        <template #header>
          {{ title }}
        </template>
        <form
          class="flex space-y-4 flex-col"
          @submit.stop.prevent="save(saveHandler)"
          @reset="clearError"
        >
          <UFormGroup name="name" label="分组" :error="errors.groupId">
            <USelectMenu
              v-model="selected"
              :searchable="search"
              placeholder="搜索分组"
              by="id"
            />
          </UFormGroup>
          <UFormGroup name="name" label="名称" :error="errors.name">
            <UInput
              v-model="data.name"
              placeholder="请输入名称"
              icon="i-heroicons-queue-list"
            />
          </UFormGroup>

          <UFormGroup name="icon" label="图标" :error="errors.icon">
            <UInput
              v-model="data.icon"
              placeholder="请输入图标"
              icon="i-heroicons-information-circle"
            />
          </UFormGroup>
          <div class="flex space-x-2 justify-end">
            <UButton color="white" type="reset" :disabled="loading"
              >重置</UButton
            >
            <UButton type="submit" :loading="loading">保存</UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>
