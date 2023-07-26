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
const step = ref(0);
const state = ref({
  name: "",
  url: "",
  username: "",
  password: "",
  repassword: "",
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
  <div class="leading-loose min-w-[20rem] lg:min-w-[24rem] xl:min-w-[26rem]">
    <h1 class="text-3xl flex items-center justify-between mb-4">
      <div class="flex">
        <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400 mr-1" />欢迎
      </div>
      <AppColorModeButton />
    </h1>
    <p class="text-gray-500 dark:text-gray-400">
      创建管理员用户和你的第一个导航应用
      <br />
      稍后你可以在后台随意修改
    </p>
    <UiForm
      ref="form"
      :state="state"
      class="space-y-4 max-w-lg mt-4"
      @submit.prevent.stop="setupSubmit"
      :schema="step === 0 ? setupUserDtoSchema : setupUrlDtoSchema"
    >
      <template v-if="step === 0">
        <UiFormGroup name="username" path="username" label="用户名">
          <UInput v-model="state.username" placeholder="请输入用户名" />
        </UiFormGroup>
        <UiFormGroup name="password" path="password" label="密码">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="请输入密码"
          />
        </UiFormGroup>
        <UiFormGroup name="repassword" path="repassword" label="确认密码">
          <UInput
            v-model="state.repassword"
            type="password"
            placeholder="请再次输入密码"
          />
        </UiFormGroup>
        <UiFormGroup>
          <UButton
            block
            @click="
              async () => {
                await form?.validate();
                step++;
              }
            "
            >下一步</UButton
          >
        </UiFormGroup>
      </template>
      <template v-else>
        <UiFormGroup name="name" path="name" label="应用名称">
          <UInput v-model="state.name" placeholder="请输入应用名称" />
        </UiFormGroup>
        <UiFormGroup name="urlLink" path="url" label="应用网址">
          <UInput v-model="state.url" placeholder="请输入应用网址" />
        </UiFormGroup>
        <div class="flex space-x-2">
          <UButton color="white" @click="step--">上一步</UButton>
          <UButton
            class="flex-1 justify-center"
            :type="!loading ? 'submit' : ''"
            :loading="loading"
            :icon="isFinished ? 'i-heroicons-check' : ''"
            :disabled="isFinished"
            >完成</UButton
          >
        </div>
      </template>
    </UiForm>
  </div>
</template>
