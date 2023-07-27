<script lang="ts" setup>
import { Form } from "types/form";
const { signIn } = useAuth();

definePageMeta({
  layout: "setup",
  middleware: "guest-only",
  auth: { authenticatedRedirectTo: "/_admin" },
});

const form = ref<Form<any>>();
const toast = useToast();
const loading = ref(false);
const isFinished = ref(false);
const state = ref({
  username: "",
  password: "",
});

async function loginSubmit() {
  try {
    loading.value = true;
    await signIn("credentials", state.value);
    isFinished.value = true;
  } catch (error: any) {
    toast.add({ title: "登录失败", color: "red", description: error.message });
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="leading-loose min-w-[20rem] lg:min-w-[24rem] xl:min-w-[26rem]">
    <h1 class="text-3xl flex items-center justify-between mb-4">
      <div class="flex items-center">
        <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400 mr-2" />登录
      </div>
      <AppColorModeButton />
    </h1>
    <p class="text-gray-500 dark:text-gray-400">
      可以在后台管理导航应用
    </p>
    <UiForm
      ref="form"
      :state="state"
      class="space-y-4 max-w-lg mt-4"
      @submit.prevent.stop="loginSubmit"
    >
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
      <UButton
        class="flex-1 justify-center"
        block
        :type="!loading ? 'submit' : ''"
        :loading="loading"
        :icon="isFinished ? 'i-heroicons-check' : ''"
        :disabled="isFinished"
        >登录</UButton
      >
    </UiForm>
  </div>
</template>
