export default defineNuxtRouteMiddleware(async ({ params }) => {
  const { group: groupCode } = params;
  if (!groupCode) {
    throw createError({
      statusCode: 404,
      statusMessage: "无效分组",
    });
  }
  const groups = useGroups();
  const { data } = await useFetch("/api/group");
  if (data.value) {
    groups.value = data.value;
  }
  const group = useGroup();
  group.value = groups.value?.find((v: any) => v.code === groupCode);
  if (!group.value) {
    if (groupCode === "public") {
      return navigateTo("/_setup");
    }
    throw createError({
      statusCode: 404,
      statusMessage: "无效分组",
    });
  }
  const { data: groupData } = await useFetch(`/api/group/${groupCode}`);
  if (groupData.value) {
    group.value = groupData.value as any;
  }
});
