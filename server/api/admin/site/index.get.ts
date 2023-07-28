export default defineApi(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const data = searchSiteDtoSchema.parse(query);

  return prisma.site
    .findMany({
      where: {
        name: {
          contains: data.name,
        },
        description: {
          contains: data.description,
        },
        categories: {
          some: {
            category: {
              name: {
                contains: data.categoryName,
              },
            },
          },
        },
      },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        urls: {},
      },
      orderBy: {
        sort: "asc",
      }
    })
    .then((result) =>
      result.map(({ categories, ...site }) => ({
        ...site,
        categories: categories.map(({ category }) => ({
          ...category,
        })),
      }))
    );
});
