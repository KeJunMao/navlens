<script lang="ts" setup>
import { Form } from "types/form";
definePageMeta({
  layout: "setup",
});

const { data: isSetup } = await useFetch("/api/setup");
if (isSetup.value) {
  navigateTo("/public", {
    replace: true,
  });
}
const form = ref<Form<any>>();
const toast = useToast();
const loading = ref(false);
const isFinished = ref(false);
const state = ref({
  name: "",
  url: "",
});

async function setupSubmit() {
  if (loading.value) return;
  await form.value?.validate();
  try {
    loading.value = true;
    await $fetch("/api/setup", {
      method: "post",
      body: state.value,
    });
    isFinished.value = true;
    navigateTo("/public", {
      replace: true,
    });
  } catch (error) {
    toast.add({
      title: "保存失败",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="leading-loose">
    <h1 class="text-3xl flex items-center justify-between">
      欢迎
      <AppColorModeButton />
    </h1>
    <p class="text-gray-500 dark:text-gray-400">
      创建你的第一个导航应用，稍后你可以在后台随意修改
    </p>
    <UiForm
      ref="form"
      :state="state"
      class="space-y-4 max-w-lg mt-4"
      @submit.prevent.stop="setupSubmit"
      :schema="setupAppDtoSchema"
    >
      <UiFormGroup name="name" path="name" label="应用名称">
        <UInput v-model="state.name" placeholder="请输入应用名称" />
      </UiFormGroup>
      <UiFormGroup name="urlLink" path="url" label="应用网址">
        <UInput v-model="state.url" placeholder="请输入应用网址" />
      </UiFormGroup>
      <UiFormGroup>
        <UButton block v-if="isFinished" icon="i-heroicons-check" disabled>完成</UButton>
        <UButton
          v-else
          block
          :type="!loading ? 'submit' : ''"
          :loading="loading"
          >完成</UButton
        >
      </UiFormGroup>
    </UiForm>
  </div>
</template>
