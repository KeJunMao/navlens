<template>
  <NavsPageLayout>
    <template #header>
      <AdminPageHeader />
    </template>
    <template #aside>
      <AdminPageNavigation />
    </template>
    <slot />
  </NavsPageLayout>
</template>
