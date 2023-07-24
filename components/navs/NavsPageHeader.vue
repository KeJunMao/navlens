<template>
  <header
    class="sticky top-0 z-50 w-full backdrop-blur flex-none border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75"
  >
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="h-16 flex items-center justify-between gap-3">
        <div class="lg:flex-1"></div>
        <NavsPageSearch />
        <div class="flex items-center justify-end lg:flex-1 gap-1.5">
          <AppColorModeButton />
        </div>
      </div>
    </div>
  </header>
</template>
