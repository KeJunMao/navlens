export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const bodyData = createSiteDtoSchema.parse(body);
  const { categoryIds, urls, ...data } = bodyData;
  return await prisma.site.create({
    data: {
      ...data,
      urls: {
        create: urls,
      },
      categories: {
        create: categoryIds.map((id) => ({
          category: {
            connect: {
              id: id,
            },
          },
        })),
      },
    },
  });
});
