<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { Form } from "@/types/form";

const props = withDefaults(
  defineProps<{
    searchSchema: z.AnyZodObject;
    searchUrl: string;
    columns?: any[];
  }>(),
  {}
);

const emit = defineEmits<{
  (e: "search", data: any): void;
}>();

const toast = useToast();
const current = getCurrentInstance();

type searchSchema = z.output<typeof props.searchSchema>;
const searchForm = ref<Form<searchSchema>>();
const searchState = ref<Record<string, any>>({});

const { data: rows, refresh: searchRefresh } = useFetch<any>(props.searchUrl, {
  query: searchState.value,
});

async function searchSubmit() {
  if (searchForm.value) {
    await searchForm.value!.validate();
  }
  emit("search", searchState.value);
  searchRefresh();
}

const tableColumns = computed(() => {
  let columns = props.columns;
  if (!columns) {
    columns = Object.keys(rows.value?.[0] ?? {}).map((key) => ({
      key,
      label: key.replace(/^\w/, (match) => match.toUpperCase()),
    }));
  }
  return [
    ...columns,
    {
      key: "actions",
    },
  ];
});
const acitons = (row: any) => [
  [
    {
      label: "编辑",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {},
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
          description: "删除后将无法还原！",
          actions: [
            {
              variant: "solid",
              color: "primary",
              label: "确认",
              click: async () => {
                await $fetch(`/${row.id}`, {
                  method: "DELETE",
                });
                searchRefresh();
              },
            },
          ],
        });
      },
    },
  ],
];

const tableSlots = computed(() => {
  const slots: any = {};
  Object.keys(current?.proxy?.$slots ?? {})
    .filter((key) => key.startsWith("table-"))
    .forEach((key) => {
      slots[key.replace(/^table-/, "")] = current?.slots[key];
    });
  return slots;
});

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
    <UTable :columns="tableColumns" :rows="rows">
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
      <template v-for="(_, name) in tableSlots" #[name]="slotData">
        <slot :name="'table-' + name" v-bind="slotData" />
      </template>
    </UTable>
  </UCard>
</template>
