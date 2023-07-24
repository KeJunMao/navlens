import type { Group } from "@prisma/client";

export function useGroups() {
  return useState<Group[]>('groups', () => ([]))
}
