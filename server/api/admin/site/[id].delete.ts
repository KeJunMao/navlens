import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const siteId = z.coerce.number().parse(event.context.params?.id);
  await prisma.categoriesOnSites.deleteMany({
    where: {
      siteId: siteId,
    },
  });
  await prisma.site.update({
    data: {
      urls: {
        deleteMany: {},
      },
    },
    where: {
      id: siteId,
    },
  });
  return prisma.site.delete({
    where: {
      id: siteId,
    },
  });
});
