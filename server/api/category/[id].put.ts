import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const body = await readBody(event);
  const data = createCategoryDtoSchema.parse(body);
  const id = z.coerce.number().parse(event.context.params?.id);
  return await prisma.category.update({
    where: {
      id,
    },
    data,
  });
});
