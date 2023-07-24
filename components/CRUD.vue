<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { Form } from "@/types/form";

function clone(data: any = {}) {
  return JSON.parse(JSON.stringify(data));
}

const props = withDefaults(
  defineProps<{
    searchSchema: z.AnyZodObject;
    createSchema: z.AnyZodObject;
    apiPath: string;
    columns?: any[];
    defaultSearchState?: Record<string, any>;
    defaultCreateState?: Record<string, any>;
    viewDataTransform?: (data: any) => any;
    saveDataTransform?: (data: any) => any;
  }>(),
  {
    viewDataTransform: (data: any) => data,
    saveDataTransform: (data: any) => data,
  }
);

const emit = defineEmits<{
  (e: "search", data: any): void;
  (e: "create", data: any): void;
  (e: "update", data: any): void;
  (e: "view", data: any): void;
}>();

const toast = useToast();
const current = getCurrentInstance();

type searchSchema = z.output<typeof props.searchSchema>;
const searchForm = ref<Form<searchSchema>>();
const searchState = ref<Record<string, any>>({ ...props.defaultSearchState });

const {
  data: tableRows,
  refresh: searchRefresh,
  pending: searchLoading,
} = useFetch<any>(props.apiPath, {
  query: searchState.value,
  watch: false,
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
    columns = Object.keys(tableRows.value?.[0] ?? {}).map((key) => ({
      key,
      label: key.replace(/^\w/, (match) => match.toUpperCase()),
    }));
  }
  return [
    ...columns,
    {
      label: "操作",
      key: "actions",
      class: "w-5",
    },
  ];
});
const acitons = (row: any) => [
  [
    {
      label: "编辑",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        showUpdateModal(row);
      },
    },
    {
      label: "复制",
      icon: "i-heroicons-document-duplicate-20-solid",
      click: () => {
        showCreateModal(row);
      },
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
          color: "red",
          actions: [
            {
              variant: "solid",
              color: "red",
              label: "确认",
              click: async () => {
                await $fetch(`${props.apiPath}/${row.id}`, {
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

type createSchema = z.output<typeof props.searchSchema>;
const createForm = ref<Form<createSchema>>();
const createState = ref<Record<string, any>>({
  ...clone(props.defaultCreateState),
});
const saveLoading = ref(false);

async function createSubmit() {
  const body = props.saveDataTransform?.(createState.value);
  await createForm.value!.validate(body);
  const mode = createModalState.value.mode;
  emit(mode as any, searchState.value);

  try {
    saveLoading.value = true;
    if (mode === "create") {
      await $fetch(`${props.apiPath}`, {
        method: "post",
        body,
      });
    } else {
      await $fetch(`${props.apiPath}/${body.id}`, {
        method: "put",
        body,
      });
    }
    searchRefresh();
    createModalState.value.show = false;
    toast.add({
      title: "保存成功",
    });
  } catch (error: any) {
    toast.add({
      title: "保存失败",
      description: error.message,
    });
  } finally {
    saveLoading.value = false;
  }
}

const createModalState = ref<{
  show: boolean;
  mode: "create" | "update" | "view";
}>({
  show: false,
  mode: "create",
});

const createModalTitle = computed(() => {
  if (createModalState.value.mode === "create") {
    return "新增";
  } else if (createModalState.value.mode === "update") {
    return "编辑";
  }
  return "查看";
});

function showViewModal(data = {}) {
  createModalState.value.mode = "view";
  createModalState.value.show = true;
  createState.value = {
    ...clone(props.defaultCreateState),
    ...clone(data),
  };
  createState.value = props.viewDataTransform?.(createState.value);
}
function showUpdateModal(data = {}) {
  showViewModal(data);
  createModalState.value.mode = "update";
}
function showCreateModal(data = {}) {
  showViewModal(data);
  createModalState.value.mode = "create";
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
          <div class="flex space-x-2">
            <UButton
              type="submit"
              color="white"
              icon="i-heroicons-magnifying-glass"
            >
              搜索
            </UButton>
            <UButton
              color="primary"
              icon="i-heroicons-plus-20-solid"
              @click="showCreateModal"
            >
              新增
            </UButton>
          </div>
        </UFormGroup>
      </UiForm>
    </template>

    <UTable :columns="tableColumns" :rows="tableRows" :loading="searchLoading">
      <template #icon-data="{ row }">
        <FetchIcon v-if="row?.icon" :name="row.icon" class="text-xl" />
        <template v-else>无</template>
      </template>
      <template #actions-data="{ row }">
        <div class="flex space-x-2">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-eye-20-solid"
            @click="showViewModal(row)"
          >
            查看
          </UButton>
          <UDropdown :items="acitons(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </div>
      </template>
      <template v-for="(_, name) in tableSlots" #[name]="slotData">
        <slot :name="'table-' + name" v-bind="slotData" />
      </template>
    </UTable>
  </UCard>
  <UModal v-model="createModalState.show">
    <UCard>
      <template #header> {{ createModalTitle }} </template>
      <UiForm
        ref="createForm"
        :state="createState"
        :schema="createSchema"
        @submit.prevent.stop="createSubmit"
        class="flex flex-col space-y-4"
      >
        <slot
          name="create"
          :state="createState"
          :mode="createModalState.mode"
          :isView="createModalState.mode === 'view'"
        ></slot>
        <UFormGroup>
          <div class="flex space-x-2" v-if="createModalState.mode !== 'view'">
            <UButton
              color="primary"
              type="submit"
              icon="i-heroicons-check"
              :loading="saveLoading"
            >
              保存
            </UButton>
            <UButton
              :disabled="saveLoading"
              icon="i-heroicons-x-mark-solid"
              color="white"
              @click="createModalState.show = false"
            >
              取消
            </UButton>
          </div>
          <UButton
            v-else
            icon="i-heroicons-x-mark-solid"
            color="primary"
            @click="createModalState.show = false"
          >
            关闭
          </UButton>
        </UFormGroup>
      </UiForm>
    </UCard>
  </UModal>
</template>
