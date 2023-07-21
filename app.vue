<template>
  <AppLayout>
    <UNotifications />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </AppLayout>
</template>

<script lang="ts" setup>
await useFetch(`/api/group`, {
  key: `groups`,
});
useHead({
  titleTemplate: (title = 'NavLens') =>
    title && title.includes("NavLens") ? title : `${title} - NavLens`,
  bodyAttrs: {
    class:
      "antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900",
  },
  htmlAttrs: {
    lang: "zh-CN",
  },
});
</script>
