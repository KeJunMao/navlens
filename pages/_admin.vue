<script lang="ts" setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
  auth: { guestRedirectTo: "/_login" },
});
</script>

<template>
  <NuxtPage />
</template>
