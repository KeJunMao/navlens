<script lang="ts" setup>
defineProps<{
  category: any;
}>();
</script>

<template>
  <div v-if="category.sites.length" class="flex flex-col space-y-4">
    <h2 class="mb-2 text-xl flex items-center space-x-2">
      <Icon
        class="text-gray-500 dark:text-gray-400"
        v-if="category.icon"
        :name="category.icon"
      />
      <div>
        {{ category.name }}
      </div>
    </h2>
    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <slot />
    </div>
  </div>
</template>
