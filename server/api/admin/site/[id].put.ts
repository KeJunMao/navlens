import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const parseData = createSiteDtoSchema.parse(body);
  const { categoryIds, urls, ...data } = parseData;
  const siteId = z.coerce.number().parse(event.context.params?.id);
  return await prisma.site.update({
    where: {
      id: siteId,
    },
    data: {
      ...data,
      urls: {
        deleteMany: {
          id: {
            notIn: urls.map(({ id }) => Number(id)).filter((v) => v),
          },
        },
        upsert: urls.map(({ id, ...url }) => ({
          where: {
            id: id ? id : -1,
          },
          update: {
            ...url,
          },
          create: {
            ...url,
          },
        })),
      },
      categories: {
        deleteMany: {},
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
