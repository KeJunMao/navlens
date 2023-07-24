import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const query = getQuery(event);
  const groupId = z.coerce.number().optional().parse(query.groupId);
  return await prisma.category
    .findMany({
      where: {
        groupId,
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
    })
    .then((result) =>
      result.map((v) => ({
        ...v,
        sites: v.sites.map((v) => v.site),
      }))
    );
});
