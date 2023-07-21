import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const categoryId = z.coerce.number().parse(event.context.params?.id);
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
    include: {
      sites: {
        include: {
          site: {
            include: {
              urls: true,
            },
          },
        },
      },
    },
  });
});
