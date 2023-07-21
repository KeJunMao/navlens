<script lang="ts" setup>
const { metaSymbol } = useShortcuts();
const isOpen = ref(false);

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value;
    },
  },
});
</script>

<template>
  <button
    class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center flex-1 ml-1.5 flg:w-64 xl:w-96"
  >
    <span
      class="i-heroicons-magnifying-glass-20-solid flex-shrink-0 h-5 w-5"
      aria-hidden="true"
    ></span>
    <span class="text-left break-all line-clamp-1">搜索...</span>
    <div
      class="hidden lg:flex items-center gap-0.5 ml-auto -my-1 flex-shrink-0"
    >
      <UKbd>{{ metaSymbol }}</UKbd>
      <UKbd>K</UKbd>
    </div>
  </button>
</template>
