import { z } from "zod";

export default defineApi(async (event) => {
  const prisma = usePrisma();
  const modelName = z
    .enum(["group", "category", "site"])
    .parse(event.context.params?.model);
  const id = z.coerce.number().parse(event.context.params?.id);
  const type = z
    .enum(["down", "up", "top", "bottom"])
    .parse(event.context.params?.type);
  const model = prisma[modelName];

  switch (type) {
    case "down":
      return moveDown(model, id);
    case "up":
      return moveUp(model, id);
    case "top":
      return moveToTop(model, id);
    case "bottom":
      return moveToBottom(model, id);
  }
});
