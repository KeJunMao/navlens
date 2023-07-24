<template>
  <AdminPageLayout>
    <slot />
    <template #aside>
      <slot name="aside" />
    </template>
  </AdminPageLayout>
</template>
