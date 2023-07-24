<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { Form } from "@/types/form";

const props = defineProps<{
  searchSchema: z.AnyZodObject;
  searchUrl: string;
  columns?: any;
}>();

const emit = defineEmits<{
  (e: "search", data: any): void;
}>();

type searchSchema = z.output<typeof props.searchSchema>;
const searchForm = ref<Form<searchSchema>>();
const searchState = ref<Record<string, any>>({});

const { data: rows, refresh: searchRefresh } = useFetch<any>(
  props.searchUrl,
  {
    query: searchState.value,
  }
);

async function searchSubmit() {
  if (searchForm.value) {
    await searchForm.value!.validate();
  }
  emit("search", searchState.value);
  searchRefresh();
}
defineExpose({
  searchState,
});
</script>

<template>
  <UCard>
    <template #header>
      <UiForm
        ref="searchForm"
        :state="searchState"
        :schema="searchSchema"
        @submit.prevent.stop="searchSubmit"
        class="flex space-x-2 items-end"
      >
        <slot name="search" :state="searchState"></slot>
        <UFormGroup>
          <UButton type="submit"> 搜索 </UButton>
        </UFormGroup>
      </UiForm>
    </template>
    <UTable :columns="columns" :rows="rows"> </UTable>
  </UCard>
</template>
