export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const data = createCategoryDtoSchema.parse(body);
  const { sort } = (await prisma.category.findFirst({
    select: {
      sort: true,
    },
    orderBy: {
      sort: "desc",
    },
  })) ?? {
    sort: 0,
  };
  return await prisma.category.create({
    data: {
      ...data,
      sort: sort + 1,
    },
  });
});
