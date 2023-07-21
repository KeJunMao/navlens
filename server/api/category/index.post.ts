export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const data = createCategoryDtoSchema.parse(body);
  return await prisma.category.create({
    data,
  });
});
