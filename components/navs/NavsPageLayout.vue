<template>
  <div>
    <slot name="header">
      <NavsPageHeader />
    </slot>
    <UContainer
      class="bg-white/75 dark:bg-gray-900/75 min-h-[calc(100vh-65px)] ring-1 ring-gray-100 dark:ring-gray-400/20"
    >
      <div class="grid lg:grid-cols-10 lg:gap-8">
        <div class="lg:col-span-2">
          <slot name="aside">
            <NavsPageAside />
          </slot>
        </div>
        <div class="lg:col-span-8">
          <NavsPageContent><slot /></NavsPageContent>
        </div>
      </div>
    </UContainer>
  </div>
</template>
