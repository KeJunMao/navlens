<script lang="ts" setup>
import { Form } from "types";

const { user, signOut } = useAuth();
const state = ref({
  // @ts-expect-error ignore
  username: user.value?.username || "",
  password: "",
  repassword: "",
});
const form = ref<Form<any>>();
const toast = useToast();

async function updateSubmit() {
  await form.value?.validate();
  try {
    await $fetch("/api/admin/profile", {
      method: "post",
      body: state.value,
    });
    await signOut();
  } catch (error: any) {
    toast.add({ title: "保存失败", color: "red", description: error.message });
  }
}
</script>

<template>
  <UCard>
    <template #header> {{ state.username }} 账户 </template>
    <UForm
      ref="form"
      :state="state"
      class="space-y-2"
      :schema="updateUserDtoSchema"
      @submit.prevent.stop="updateSubmit"
    >
      <UFormGroup label="用户名" name="username">
        <UInput type="text" placeholder="请输入名称" v-model="state.username" />
      </UFormGroup>
      <UFormGroup label="修改密码" name="password">
        <UInput type="password" placeholder="请输入密码" v-model="state.password" />
      </UFormGroup>
      <UFormGroup label="确认密码" name="repassword">
        <UInput
          type="password"
          placeholder="请再次输入密码"
          v-model="state.repassword"
        />
      </UFormGroup>
      <UButton type="submit">保存</UButton>
    </UForm>
  </UCard>
</template>
