<script setup lang="ts">
import { UCommandPalette } from "#components";
import { Group } from "@nuxthq/ui/dist/runtime/types";
import { Category, Site, Url } from "@prisma/client";
import { pinyin } from "pinyin-pro";

const emit = defineEmits<{
  (event: "select"): void;
}>();
const commandPaletteRef = ref<InstanceType<typeof UCommandPalette>>();
const colorMode = useColorMode();
const groupsData = useGroups();
const group = useGroup();
const categories = computed(() => group.value?.categories);
const route = useRoute();
const isInAdmin = computed(() => route.path.startsWith("/_admin"));

const commandsGroup = computed(() => {
  return {
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
      !isInAdmin.value
        ? {
            id: "goto-admin",
            label: "前往后台管理",
            icon: "i-heroicons-server",
            to: "/_admin",
          }
        : {
            id: "goto-front",
            label: "前往前台查看",
            icon: "i-heroicons-squares-2x2-solid",
            to: "/",
          },
    ],
  };
});

const siteGroup = computed<Group[]>(() => {
  return (
    group.value?.categories?.map(
      (v: Category & { sites: (Site & { urls: Url[] })[] }) => {
        return {
          key: `category-${v.id}`,
          label: v.name,
          commands: v.sites
            .map((site) => {
              const sitePinyin = pinyin(site.name, {
                toneType: "none",
                type: "array",
              }).join("");
              let icon: string, avatar: any;
              if (site.icon?.startsWith("http")) {
                avatar = {
                  src: site.icon,
                };
              } else {
                icon = site.icon!;
              }

              return site.urls.map((url) => {
                return {
                  site: site,
                  url: url,
                  sitePinyin: sitePinyin,
                  urlPinyin: pinyin(url.label ?? "", {
                    toneType: "none",
                    type: "array",
                  }).join(""),
                  id: `open-${site.id}-${url.id}`,
                  label: `${site.name} - ${url.label}`,
                  icon,
                  avatar,
                  chip: colorMode.value === "dark" ? "a1a1a1" : "eee",
                  suffix: url.link,
                  click: () => window.open(url.link, "_blank"),
                };
              });
            })
            .flat(),
        };
      }
    ) ?? []
  );
});
const groupGroup = computed<Group>(() => {
  return {
    key: "groups",
    label: "分组",
    commands: groupsData.value.map((v) => {
      return {
        id: `group-${v.id}`,
        label: v.name,
        icon: v.icon!,
        to: `/${v.code}`,
      };
    }),
  };
});
const categoryGroup = computed<Group>(() => {
  return {
    key: "categories",
    label: "分类",
    commands:
      categories.value?.map((category) => {
        return {
          id: `category-${category.id}`,
          label: category.name,
          icon: category.icon!,
          to: `#category-${category.id}`,
        };
      }) ?? [],
  };
});

const adminGroup = {
  key: "admin",
  label: "管理",
  commands: [
    {
      id: "group",
      label: "分组",
      icon: "i-heroicons-rectangle-group",
      to: "/_admin/group",
    },
    {
      id: "category",
      label: "分类",
      icon: "i-heroicons-queue-list",
      to: "/_admin/category",
    },
    {
      id: "site",
      label: "站点",
      icon: "i-heroicons-paper-airplane",
      to: "/_admin/site",
    },
  ],
};

const groups = computed(() => {
  const group: any[] = [commandsGroup.value];
  if (isInAdmin.value) {
    group.unshift(adminGroup);
  } else {
    group.unshift(categoryGroup.value, groupGroup.value);
    if (commandPaletteRef.value?.query) {
      return [...siteGroup.value, ...group];
    }
  }
  return group;
});

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
        base: "flex-shrink-0",
      },
    },
  },
};

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>

<template>
  <!-- @vue-ignore -->
  <DefineTemplate v-slot="{ command, active }">
    <FetchIcon
      :class="[
        ui.group.command.icon.base,
        active ? ui.group.command.icon.active : ui.group.command.icon.inactive,
      ]"
      v-if="command.icon"
      :name="command.icon"
    ></FetchIcon>
    <UAvatar
      v-else-if="command.avatar"
      v-bind="{ size: ui.group.command.avatar.size, ...command.avatar }"
      :class="ui.group.command.avatar.base"
      aria-hidden="true"
    />
  </DefineTemplate>
  <UCommandPalette
    ref="commandPaletteRef"
    :groups="groups"
    :ui="ui"
    :fuse="{
      fuseOptions: {
        ignoreLocation: true,
        includeMatches: true,
        useExtendedSearch: true,
        threshold: 0,
        keys: [
          'label',
          'suffix',
          'site.description',
          'sitePinyin',
          'urlPinyin',
        ],
      },
      resultLimit: 10,
    }"
    :autoselect="false"
    placeholder="搜索应用或命令"
    @update:model-value="onSelect"
  >
    <template #groups-icon="{ command, active }">
      <ReuseTemplate :command="command" :active="active" />
    </template>
    <template #categories-icon="{ command, active }">
      <ReuseTemplate :command="command" :active="active" />
    </template>
    <template
      v-for="item in siteGroup"
      #[`${item.key}-icon`]="{ command, active }"
    >
      <ReuseTemplate :command="command" :active="active" />
    </template>
  </UCommandPalette>
</template>
