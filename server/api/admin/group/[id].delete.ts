import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const groupId = z.coerce.number().parse(event.context.params?.id);

  await prisma.$transaction(async (tx) => {
    await tx.category.deleteMany({
      where: {
        groupId,
      },
    });
    const siteIds = await tx.site.findMany({
      where: {
        categories: {
          some: {
            category: {
              groupId,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
    await tx.url.deleteMany({
      where: {
        siteId: {
          in: siteIds.map((v) => v.id),
        },
      },
    });
    await tx.site.deleteMany({
      where: {
        id: {
          in: siteIds.map((v) => v.id),
        },
      },
    });
  });
  return prisma.group.delete({
    where: {
      id: groupId,
    },
  });
});
