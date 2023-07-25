<script lang="ts" setup>
definePageMeta({
  middleware: "group",
});
const group = useGroup();
const categories = computed(() => group.value?.categories);
useSeoMeta({
  title: group.value?.name,
});
const { updateHeadings } = useScrollspy();

watchEffect(() => {
  if (process.client && group.value) {
    nextTick(() => {
      updateHeadings([...document.querySelectorAll('[id^="site-"]')]);
      updateHeadings([...document.querySelectorAll('[id^="categories-"]')]);
    });
  }
});
</script>

<template>
  <NavsGroupHeader :group="group"></NavsGroupHeader>
  <div class="flex flex-col space-y-8">
    <template v-if="!categories?.length">
      <Empty />
    </template>
    <NavsCategory v-for="item in categories" :category="item" :key="item.id">
      <NavsSite v-for="site in item.sites" :site="site" :key="site.id" />
    </NavsCategory>
  </div>
</template>
