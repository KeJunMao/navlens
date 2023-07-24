<script lang="ts" setup>
const props = defineProps<{
  site: any;
}>();
const firstUrl = computed(() => props.site.urls[0]);
const onlyOne = computed(() => props.site.urls.length === 1);
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
</script>

<template>
  <DefineTemplate>
    <div
      class="group w-full flex flex-col space-y-2 ring-1 ring-gray-200 dark:ring-gray-600 rounded-md transition-all hover:-translate-y-1 px-4 py-2 backdrop-blur bg-white/30 dark:bg-gray-800/30 relative"
    >
      <div class="flex space-x-2 items-center">
        <NavsIconOrImage :icon="site.icon" :name="site.name" />
        <p>{{ site.name }}</p>
      </div>
      <div
        class="text-sm text-gray-500 dark:text-gray-400"
        v-if="site.description"
      >
        {{ site.description }}
      </div>
      <template v-if="!onlyOne">
        <div class="flex space-x-1">
          <UTooltip v-for="item in site.urls" :text="item.link" :key="item.id">
            <UButton
              :to="item.link"
              target="_blank"
              size="sm"
              variant="ghost"
              >{{ item.label }}</UButton
            >
          </UTooltip>
        </div>
      </template>
    </div>
  </DefineTemplate>
  <template v-if="onlyOne">
    <NuxtLink :to="onlyOne ? firstUrl?.link : false" target="_blank">
      <UTooltip
        class="w-full"
        :text="`${firstUrl.label ? firstUrl.label + ':' : ''}${firstUrl.link}`"
      >
        <ReuseTemplate />
      </UTooltip>
    </NuxtLink>
  </template>
  <template v-else>
    <ReuseTemplate />
  </template>
</template>
