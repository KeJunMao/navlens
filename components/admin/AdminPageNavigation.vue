<script setup>
const links = [
  {
    label: "分组",
    icon: "i-heroicons-rectangle-group",
    to: "/_admin/group",
  },
  {
    label: "分类",
    icon: "i-heroicons-queue-list",
    to: "/_admin/category",
  },
  {
    label: "站点",
    icon: "i-heroicons-paper-airplane",
    to: "/_admin/site",
  },
];
</script>

<template>
  <div
    class="hidden py-8 overflow-y-auto lg:block lg:top-[65px] lg:max-h-[calc(100vh-65px)] lg:sticky lg:pr-8 lg:pl-[2px]"
  >
    <UVerticalNavigation :links="links"> </UVerticalNavigation>
  </div>
</template>
