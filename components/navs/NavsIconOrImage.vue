<script lang="ts" setup>
defineProps<{
  icon?: string;
  name?: string
}>();
</script>

<template>
  <UAvatar
    v-if="icon?.startsWith('http')"
    :src="icon"
    :alt="name"
  />
  <Icon
    v-else-if="icon"
    class="text-gray-500 dark:text-gray-400 text-4xl"
    :name="icon"
  />
</template>
