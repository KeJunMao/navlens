<script setup>
const groups = useGroups()

const links = computed(() =>
  groups.value?.map((v) => ({
    label: v.name,
    to: `/${v.code}`,
    ...v,
  }))
);
</script>

<template>
  <UVerticalNavigation
    :links="links"
    :ui="{
      size: 'text-md',

    }"
    class="mb-4 lg:mb-8"
  >
    <template #icon="{ link }">
      <div class="z-[1]">
        <FetchIcon :name="link.icon" />
      </div>
    </template>
  </UVerticalNavigation>
</template>
