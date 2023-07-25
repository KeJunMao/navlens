export default defineApi(async (event) => {
  const prisma = usePrisma();
  const existingRecord = await prisma.group.findUnique({
    where: {
      code: "public",
    },
  });
  return !!existingRecord;
});
