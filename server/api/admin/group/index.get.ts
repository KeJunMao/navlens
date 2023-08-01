import { Prisma } from "@prisma/client";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const { take, skip, ...data } = searchGroupDtoSchema.parse(getQuery(event));

  const query: Prisma.GroupFindManyArgs = {
    where: {
      name: {
        contains: data.name,
      },
      code: {
        contains: data.code,
      },
    },
    orderBy: {
      sort: "asc",
    },
  };

  const [result, total] = await prisma.$transaction([
    prisma.group.findMany({ ...query, skip, take }),
    prisma.group.count({ where: query.where })
  ]);
  return {
    pagination: {
      total
    },
    result
  };
});
