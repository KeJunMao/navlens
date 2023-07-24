<script lang="ts" setup>
defineProps<{
  group?: any;
}>();
</script>
<template>
  <h1 class="text-2xl leading-loose mb-8 flex justify-between items-center">
    {{ group?.name }}
    <FetchIcon class="text-gray-500 dark:text-gray-400" v-if="group?.icon" :name="group.icon" />
  </h1>
</template>
