<template>
  <div class="app-layout">
    <NuxtLoadingIndicator />
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
  <AppGridBG />
</template>
