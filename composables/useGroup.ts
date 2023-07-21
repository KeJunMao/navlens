export const useGroup = (userCode?: MaybeRef<string>) => {
  const { data: groups } = useNuxtData("groups");
  const route = useRoute();
  const code = computed(() => unref(userCode) || route.params.group);
  return computed(() => groups.value.find((v: any) => v.code === code.value));
};
