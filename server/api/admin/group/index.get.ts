export default defineApi(async (event) => {
  const prisma = usePrisma();
  return prisma.group.findMany();
});
