<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from "@headlessui/vue";
const route = useRoute();

const isDialogOpen = ref(false);

watch(
  () => route.fullPath,
  () => {
    isDialogOpen.value = false;
  }
);
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>
<template>
  <DefineTemplate>
    <header
      class="sticky top-0 z-50 w-full backdrop-blur flex-none border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="h-16 flex items-center justify-between gap-3">
          <div class="lg:flex-1">
            <slot name="left">
              <NuxtLink
                to="/"
                class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white"
              >
                <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />
                <span class="hidden sm:block">NavLens</span>
              </NuxtLink>
            </slot>
          </div>
          <slot name="center">
            <NavsPageSearch />
          </slot>
          <div class="flex items-center justify-end lg:flex-1 gap-1.5">
            <slot name="right" />
            <AppColorModeButton />
            <UButton
              color="gray"
              variant="ghost"
              class="lg:hidden"
              :icon="isDialogOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
              @click="isDialogOpen = !isDialogOpen"
            />
          </div>
        </div>
      </div>
    </header>
  </DefineTemplate>
  <ReuseTemplate />
  <TransitionRoot :show="isDialogOpen" as="template">
    <Dialog as="div" @close="isDialogOpen = false">
      <DialogPanel
        class="fixed inset-0 bottom-0 z-50 overflow-y-auto bg-white dark:bg-gray-900 lg:hidden"
      >
        <ReuseTemplate />
        <div class="px-4 sm:px-6 pt-3 pb-6">
          <slot name="links">
            <NavsSiteNavigation />
            <NavsCurrentNavigation />
          </slot>
        </div>
      </DialogPanel>
    </Dialog>
  </TransitionRoot>
</template>
