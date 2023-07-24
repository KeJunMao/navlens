export default defineApi(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const data = searchGroupDtoSchema.parse(query);

  return prisma.group.findMany({
    where: {
      ...data,
    },
  });
});
