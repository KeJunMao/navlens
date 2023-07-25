<template>
  <NavsPageLayout>
    <template #header>
      <AdminPageHeader />
    </template>
    <template #aside>
      <AdminPageAside />
    </template>
    <slot />
  </NavsPageLayout>
</template>
