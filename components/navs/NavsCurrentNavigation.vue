<script lang="ts" setup>
import { AccordionItem } from "@nuxthq/ui/dist/runtime/types/accordion";

const group = useGroup();
const categories = computed(() => group.value?.categories);
const accordionItems = computed(() => {
  return (categories.value?.map((category) => {
    return {
      label: category.name,
      icon: category.icon,
      slot: `${category.id}`,
      sites: category.sites,
    };
  }) ?? []) as AccordionItem[];
});
const appConfig = useAppConfig();

const route = useRoute();
const router = useRouter();
const { updateHeadings } = useScrollspy();

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      if (process.client) {
        updateHeadings([...document.querySelectorAll('[id^="site-"]')]);
      }
    }, 300);
  },
  { immediate: true }
);
</script>
<template>
  <div class="space-y-2">
    <UAccordion
      :items="accordionItems"
      default-open
      multiple
      :ui="{
        item: { padding: 'mb-4 lg:mb-8' },
      }"
    >
      <template #default="{ item, open }">
        <ULinkCustom
          class="flex items-center gap-2 group mb-3 w-full"
          active-class="text-primary-500 dark:text-primary-400 border-current"
          inactive-class="text-gray-900 dark:text-gray-200 border-transparent"
        >
          <FetchIcon
            v-if="item.icon"
            :name="item.icon"
            class="w-4 h-4 flex-shrink-0"
          />

          <span class="text-sm font-semibold leading-6">{{ item.label }}</span>

          <UIcon
            :name="appConfig.ui.accordion.default.openIcon"
            class="w-5 h-5 ms-auto transform transition-transform duration-200 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
            :class="[open ? 'text-gray-900 dark:text-gray-200' : '-rotate-90']"
          />
        </ULinkCustom>
      </template>
      <!-- @vue-skip -->
      <template
        v-for="{ slot } in accordionItems"
        :key="slot"
        #[slot]="{ item }"
      >
        <div
          class="space-y-2 ml-2 border-l border-gray-200 dark:border-gray-800"
        >
          <div
            v-for="site in item.sites"
            class="flex items-center gap-2 group border-l -ml-px pl-4 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 border-transparent hover:border-gray-400 dark:hover:border-gray-500"
          >
            <NuxtLink
              :to="`#site-${site.id}`"
              class="truncate text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 border-transparent hover:border-gray-400 dark:hover:border-gray-500"
            >
              {{ site.name }}
            </NuxtLink>
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
