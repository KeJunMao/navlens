import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const categoryId = z.coerce.number().parse(event.context.params?.id);
  const sites = await prisma.site.findMany({
    where: {
      categories: {
        some: {
          categoryId,
        },
      },
    },
  });
  await prisma.categoriesOnSites.deleteMany({
    where: {
      categoryId,
    },
  });

  await prisma.url.deleteMany({
    where: {
      siteId: {
        in: sites.map((site) => site.id),
      },
    },
  });
  await prisma.site.deleteMany({
    where: {
      id: {
        in: sites.map((site) => site.id),
      },
    },
  });
  return await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
});
