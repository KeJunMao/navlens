<script lang="ts" setup>
defineProps<{
  category: any;
}>();
</script>

<template>
  <div class="flex flex-col space-y-4">
    <h2 class="mb-6 text-2xl font-bold leading-relaxed flex items-center space-x-2" :id="`category-${category.id}`">
      <FetchIcon
        class="text-gray-500 dark:text-gray-400"
        v-if="category.icon"
        :name="category.icon"
      />
      <div>
        {{ category.name }}
      </div>
    </h2>
    <template v-if="!category.sites?.length">
      <Empty />
    </template>
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <slot />
    </div>
  </div>
</template>
