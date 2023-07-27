import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const groupId = z.coerce.number().parse(event.context.params?.id);
  const categories = await prisma.category.findMany({
    where: {
      groupId,
    },
  });
  const sites = await prisma.site.findMany({
    where: {
      categories: {
        every: {
          categoryId: {
            in: categories.map((category) => category.id),
          },
        },
      },
    },
  });
  await prisma.categoriesOnSites.deleteMany({
    where: {
      category: {
        groupId,
      },
    },
  });
  await prisma.category.deleteMany({
    where: {
      groupId,
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

  return prisma.group.delete({
    where: {
      id: groupId,
    },
  });
});
