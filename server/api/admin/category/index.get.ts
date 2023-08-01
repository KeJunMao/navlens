import { Prisma } from "@prisma/client";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const data = searchCategoryDtoSchema.parse(getQuery(event));

  const query: Prisma.CategoryFindManyArgs = {
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
    },
  };

  const [result, total] = await prisma.$transaction([
    prisma.category.findMany(query),
    prisma.category.count({ where: query.where }),
  ]);

  return {
    pagination: {
      total,
    },
    // @ts-expect-error ignore
    result: result.map(({ group, ...category }) => {
      return {
        ...category,
        groupName: group.name,
      };
    }),
  };
});
