export default defineApi(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const data = searchCategoryDtoSchema.parse(query);

  return await prisma.category
    .findMany({
      where: {
        group: {
          name: {
            contains: data.groupName,
          },
        },
        name: {
          contains: data.name,
        },
      },
      include: {
        group: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        sort: "asc",
      }
    })
    .then((v) =>
      v.map(({ group, ...category }) => {
        return {
          ...category,
          groupName: group.name,
        };
      })
    );
});
