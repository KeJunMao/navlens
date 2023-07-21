import { any } from "zod";

const titleMap = {
  create: "创建",
  update: "修改",
  view: "查看",
};

export interface FormDialogOptions<T> {
  data?: T;
  rules?: Zod.AnyZodObject;
}

export function useFormDialog<T extends object>({
  data,
  rules,
}: FormDialogOptions<T> = {}) {
  const toast = useToast();
  const title = ref("");
  const isOpen = ref(false);
  const formData = ref<T>(data!);
  const errors = ref<{
    [key in keyof T]?: string;
  }>({});
  const loading = ref(false);

  const close = () => {
    isOpen.value = false;
  };
  const setup = (
    type: "create" | "update" | "view" = "create",
    initData?: Partial<T>
  ) => {
    title.value = titleMap[type];
    clearError();
    if (initData) {
      formData.value = { ...formData.value, ...initData };
    } else {
      formData.value = { ...formData.value, ...data };
    }
    isOpen.value = true;
  };

  const clearError = () => {
    errors.value = {} as any;
  };

  const vailidate = () => {
    if (rules) {
      const result = rules.safeParse(formData.value);
      if (!result.success) {
        const { fieldErrors } = result.error.formErrors;
        Object.keys(fieldErrors).forEach((key) => {
          // @ts-ignore
          errors.value[key] = fieldErrors[key].join(", ");
        });
        return false
      } else {
        errors.value = {} as any;
        return result.data;
      }
    }
  };

  const save = async (saveFn?: (data: T) => Promise<void> | void) => {
    const data = vailidate();
    if (!data) return
    loading.value = true;
    if (saveFn) {
      try {
        await saveFn({...formData.value, ...data as any});
        close();
        toast.add({
          title: "保存成功",
        });
      } catch (err: any) {
        toast.add({
          title: "保存失败",
          description: err.message,
          color: "red",
        });
      } finally {
        loading.value = false;
      }
    }
    return data;
  };

  return {
    setup,
    close,
    isOpen,
    data: formData,
    title,
    save,
    errors,
    vailidate,
    clearError,
    loading,
  };
}
