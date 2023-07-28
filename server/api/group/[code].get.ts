import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const code = z.coerce.string().parse(event.context.params?.code);
  return await prisma.group
    .findUnique({
      where: {
        code,
      },
      include: {
        categories: {
          include: {
            sites: {
              include: {
                site: {
                  include: {
                    urls: {},
                  },
                },
              },
              orderBy: {
                site: {
                  sort: "asc",
                },
              },
            },
          },
          orderBy: {
            sort: "asc",
          },
        },
      },
    })
    .then((result) => ({
      ...result,
      categories: result?.categories.map((category) => ({
        ...category,
        sites: category.sites.map((v) => v.site),
      })),
    }));
});
