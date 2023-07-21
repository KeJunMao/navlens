<script setup lang="ts">
const emit = defineEmits<{
  (event: "select"): void;
}>();
const commandPaletteRef = ref();
const colorMode = useColorMode();

const groups = [
  {
    key: "commands",
    label: "命令",
    commands: [
      {
        id: "switch-theme",
        label: "切换颜色模式",
        icon: "i-heroicons-sun",
        click: () => {
          colorMode.value = colorMode.value === "dark" ? "light" : "dark";
        },
      },
      {
        id: "goto-admin",
        label: "前往后台管理",
        icon: "i-heroicons-server",
        to: "/_admin",
      },
      {
        id: "goto-front",
        label: "前往前台查看",
        icon: "i-heroicons-squares-2x2-solid",
        to: "/",
      },
    ],
  },
  {
    key: "todo",
    label: "代办",
    inactive: "站点",
    commands: [
      { id: "linear", label: "开发中", icon: "i-simple-icons-linear" },
    ],
  },
];

function onSelect(option: any) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    navigateTo(option.to);
  } else if (option.href) {
    window.open(option.href, "_blank");
  }
  emit("select");
}

const ui = {
  wrapper:
    "flex flex-col flex-1 min-h-0 divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800",
  container:
    "relative flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 scroll-py-2",
  input: {
    base: "w-full h-14 px-4 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none",
  },
  group: {
    label: "px-2 my-2 text-xs font-semibold text-gray-500 dark:text-gray-400",
    command: {
      base: "flex justify-between select-none cursor-default items-center rounded-md px-2 py-2 gap-2 relative",
      active: "bg-gray-200 dark:bg-gray-700/50 text-gray-900 dark:text-white",
      container: "flex items-center gap-3 min-w-0",
      icon: {
        base: "flex-shrink-0 w-5 h-5",
        active: "text-gray-900 dark:text-white",
        inactive: "text-gray-400 dark:text-gray-500",
      },
      avatar: {
        size: "2xs",
      },
    },
  },
};
</script>

<template>
  <UCommandPalette
    ref="commandPaletteRef"
    :groups="groups"
    :ui="ui"
    :autoselect="false"
    placeholder="搜索应用或命令"
    @update:model-value="onSelect"
  />
</template>
