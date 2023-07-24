import type { Group, Category, Site, Url } from "@prisma/client";

export function useGroup() {
  return useState<
    | (Group & {
        categories?: (Category & {
          sites: (Site & {
            urls: Url[];
          })[];
        })[];
      })
    | undefined
  >("group", () => undefined);
}
