export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const bodyData = createSiteDtoSchema.parse(body);
  const { categoryIds, urls, ...data } = bodyData;
  const { sort: siteSort } = (await prisma.site.findFirst({
    select: {
      sort: true,
    },
    orderBy: {
      sort: "desc",
    },
  })) ?? {
    sort: 0,
  };
  const { sort: urlSort } = (await prisma.url.findFirst({
    select: {
      sort: true,
    },
    orderBy: {
      sort: "desc",
    },
  })) ?? {
    sort: 0,
  };
  return await prisma.site.create({
    data: {
      ...data,
      sort: siteSort + 1,
      urls: {
        create: urls.map((v, i) => {
          return {
            ...v,
            sort: urlSort + i + 1,
          };
        }),
      },
      categories: {
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
