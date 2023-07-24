export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const data = createGroupDtoSchema.parse(body);
  return await prisma.group.create({
    data,
  });
});
