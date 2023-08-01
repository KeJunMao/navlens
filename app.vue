<template>
  <AppLayout>
    <UNotifications />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </AppLayout>
</template>

<script lang="ts" setup>
useHead({
  titleTemplate: (title = "NavLens") =>
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

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
