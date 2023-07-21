<template>
  <UContainer
    class="bg-white/75 dark:bg-gray-900/75 min-h-[calc(100vh-65px)] ring-1 ring-zinc-100 dark:ring-zinc-400/20"
  >
    <div class="grid lg:grid-cols-10 lg:gap-8">
      <div class="lg:col-span-2">
        <NavsPageAside />
      </div>
      <div class="lg:col-span-8">
        <NavsPageContent><slot /></NavsPageContent>
      </div>
    </div>
  </UContainer>
</template>
