import type { Group } from "@prisma/client";

export function useGroup() {
  return useState<Group | undefined>("group", () => undefined);
}
