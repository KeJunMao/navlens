<script lang="ts" setup>
const props = defineProps<{
  site: any;
}>();
const firstUrl = computed(() => props.site.urls[0]);
const onlyOne = computed(() => props.site.urls.length === 1);
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
const { view } = uselastVisitedLinks();
</script>

<template>
  <DefineTemplate>
    <div
      class="animate-twice animate-duration-300 group w-full h-full flex justify-between flex-col space-y-2 transition-all px-4 py-2 relative border border-gray-200/75 hover:border-gray-400 dark:border-gray-700 hover:dark:border-gray-600 hover:dark:bg-white/5 hover:bg-gray-300/5 rounded-lg"
    >
      <div class="flex space-x-2 items-center">
        <NavsIconOrImage :icon="site.icon" :name="site.name" />
        <p>{{ site.name }}</p>
      </div>
      <div
        class="text-sm text-gray-500 dark:text-gray-400 truncate"

      >
      <template v-if="site.description">
        {{ site.description }}
      </template>
      <template v-else>
        {{ firstUrl.link }}
      </template>
      </div>
      <template v-if="!onlyOne">
        <div class="flex space-x-1">
          <UTooltip v-for="item in site.urls" :text="item.link" :key="item.id">
            <UButton
              @click="view(item)"
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
    <NuxtLink
      @click="view(firstUrl)"
      :id="`site-${site.id}`"
      :to="onlyOne ? firstUrl?.link : false"
      target="_blank"
      class="h-full"
    >
      <UTooltip
        class="w-full h-full"
        :text="`${firstUrl.label ? firstUrl.label + ':' : ''}${firstUrl.link}`"
      >
        <ReuseTemplate />
      </UTooltip>
    </NuxtLink>
  </template>
  <template v-else>
    <div :id="`site-${site.id}`">
      <ReuseTemplate />
    </div>
  </template>
</template>

<style lang="postcss">
.pulse-highlight {
  @apply animate-pulse animate-twice animate-duration-300;
}
</style>
