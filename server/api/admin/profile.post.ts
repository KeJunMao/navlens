import { hash } from "ohash";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const { username, password } = updateUserDtoSchema.parse(body);
  const adminUser = await prisma.user.findFirst();
  if (adminUser) {
    return await prisma.user.update({
      where: {
        id: adminUser.id,
      },
      data: {
        username,
        password: hash(password),
      },
    });
  }
});
