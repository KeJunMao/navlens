export default defineNuxtRouteMiddleware(async ({ params }) => {
  const { group: groupCode } = params;
  if (!groupCode) {
    throw createError({
      statusCode: 400,
      statusMessage: "无效分组",
    });
  }
  const groups = useGroups();
  const { data } = await useFetch("/api/group");
  if (data.value) {
    groups.value = data.value;
  }
  const group = useGroup();
  group.value = groups.value?.find((v: any) => v.code === groupCode)
});
