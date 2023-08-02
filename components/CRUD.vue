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
    modelName: string;
    columns?: any[];
    defaultSearchState?: Record<string, any>;
    defaultCreateState?: Record<string, any>;
    viewDataTransform?: (data: any) => any;
    saveDataTransform?: (data: any) => any;
    copyDataTransform?: (data: any) => any;
  }>(),
  {
    viewDataTransform: (data: any) => data,
    saveDataTransform: (data: any) => data,
    copyDataTransform: (data: any) => data,
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
const page = ref(1);
const pageSize = 10;
const searchQuery = computed(() => ({
  ...searchState.value,
  take: pageSize,
  skip: page.value - 1,
}));
const {
  data: searchData,
  refresh: searchRefresh,
  pending: searchLoading,
} = useFetch<any>(props.apiPath, {
  query: searchQuery,
  watch: false,
});

watch(page, () => searchRefresh());

const total = computed(() => searchData.value?.pagination.total ?? 0);
const tableRows = computed(() => searchData.value?.result);

async function searchSubmit() {
  if (searchForm.value) {
    await searchForm.value!.validate();
  }
  page.value = 1
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
      label: "查看",
      icon: "i-heroicons-eye-20-solid",
      click: () => {
        showViewModal(row);
      },
    },
    {
      label: "复制",
      icon: "i-heroicons-document-duplicate-20-solid",
      click: () => {
        const { id, ...data } = row;
        showCreateModal(props.copyDataTransform(data));
      },
    },
  ],
  [
    {
      label: "上移一层",
      icon: "i-heroicons-arrow-up-20-solid",
      click: async () => {
        await $fetch(`/api/admin/sort/${props.modelName}/${row.id}/up`, {
          method: "put",
        });
        searchRefresh();
      },
    },
    {
      label: "下移一层",
      icon: "i-heroicons-arrow-down-20-solid",
      click: async () => {
        await $fetch(`/api/admin/sort/${props.modelName}/${row.id}/down`, {
          method: "put",
        });
        searchRefresh();
      },
    },
    {
      label: "移到顶层",
      icon: "i-heroicons-arrow-up-tray",
      click: async () => {
        await $fetch(`/api/admin/sort/${props.modelName}/${row.id}/top`, {
          method: "put",
        });
        searchRefresh();
      },
    },
    {
      label: "移到底层",
      icon: "i-heroicons-arrow-down-tray",
      click: async () => {
        await $fetch(`/api/admin/sort/${props.modelName}/${row.id}/bottom`, {
          method: "put",
        });
        searchRefresh();
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
  <UCard class="max-w-[calc(100vw-32px)]">
    <template #header>
      <UForm
        ref="searchForm"
        :state="searchState"
        :schema="searchSchema"
        @submit.prevent.stop="searchSubmit"
        class="grid gap-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <slot name="search" :state="searchState"></slot>
        <div class="flex items-end">
          <div class="flex space-x-2">
            <UButton
              type="submit"
              color="white"
              icon="i-heroicons-magnifying-glass"
            >
              搜索
            </UButton>
            <UButton
              color="gray"
              icon="i-heroicons-plus-20-solid"
              @click="showCreateModal"
            >
              新增
            </UButton>
          </div>
        </div>
      </UForm>
    </template>

    <UTable
      :columns="tableColumns"
      :rows="tableRows"
      :loading="searchLoading"
      class="overflow-auto"
    >
      <template #icon-data="{ row }">
        <FetchIcon v-if="row?.icon" :name="row.icon" class="text-xl" />
        <template v-else>无</template>
      </template>
      <template #actions-data="{ row }">
        <div class="flex space-x-2">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-pencil-square-20-solid"
            @click="showUpdateModal(row)"
          >
            编辑
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
    <template #footer>
      <UPagination v-model="page" :page-count="pageSize" :total="total" />
    </template>
  </UCard>
  <UModal v-model="createModalState.show">
    <UCard>
      <template #header> {{ createModalTitle }} </template>
      <UForm
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
      </UForm>
    </UCard>
  </UModal>
</template>
