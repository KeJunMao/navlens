export default defineApi(async (event) => {
  const prisma = usePrisma();
  return prisma.site.findMany();
});
