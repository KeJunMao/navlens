<script lang="ts" setup>
const group = useGroup();
const { data: categories } = useFetch(
  `/api/category?groupId=${group.value.id}`,
  {
    key: `categoryByGroupId-${group.value.id}`,
  }
);
useSeoMeta({
  title: group.value.name,
});
</script>

<template>
  <NavsGroupHeader :group="group"></NavsGroupHeader>
  <div class="flex flex-col space-y-8">
    <NavsCategory v-for="item in categories" :category="item" :key="item.id">
      <NavsSite v-for="site in item.sites" :site="site" :key="site.id" />
    </NavsCategory>
  </div>
</template>
