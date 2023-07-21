<script lang="ts" setup>
definePageMeta({ layout: false });
</script>

<template>
  <NuxtLayout name="default">
    <template #aside>
      <aside
        class="hidden py-8 overflow-y-auto lg:block lg:top-[65px] lg:max-h-[calc(100vh-65px)] lg:sticky lg:pr-8 lg:pl-[2px]"
      >
        <AdminNavigation />
      </aside>
    </template>
    <NuxtPage />
  </NuxtLayout>
</template>
