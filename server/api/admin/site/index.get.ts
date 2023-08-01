import { Prisma } from "@prisma/client";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const { take, skip, ...data } = searchSiteDtoSchema.parse(getQuery(event));
  const query: Prisma.SiteFindManyArgs = {
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
    },
  };

  const [result, total] = await prisma.$transaction([
    prisma.site.findMany({ ...query, skip, take }),
    prisma.site.count({ where: query.where }),
  ]);

  return {
    pagination: {
      total,
    },
    // @ts-expect-error ignore
    result: result.map(({ categories, ...site }) => ({
      ...site,
      categories: categories.map(({ category }: any) => ({
        ...category,
      })),
    })),
  };
});
