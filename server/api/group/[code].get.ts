import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const code = z.coerce.string().parse(event.context.params?.code);
  return await prisma.group.findFirst({
    where: {
      code,
    },
  });
});
