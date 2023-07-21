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
  <UVerticalNavigation :links="links"> </UVerticalNavigation>
</template>
