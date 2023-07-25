<script lang="ts" setup>
defineProps<{
  group?: any;
}>();
</script>
<template>
  <div class="relative border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
    <h1
      class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight dark:text-white flex justify-between items-center"
    >
      {{ group?.name }}
      <FetchIcon
        class="text-gray-500 dark:text-gray-400"
        v-if="group?.icon"
        :name="group.icon"
      />
    </h1>
    <p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
      {{ group.description ?? "暂无描述" }}
    </p>
  </div>
</template>
