import { Url } from "@prisma/client";

export function useLastVisitedLinks() {
  const group = useGroup();
  const sites = computed(() =>
    group.value?.categories
      ?.flat()
      .map((v) => v.sites)
      .flat()
  );
  const links = useLocalStorage<
    {
      siteId: number;
      id: number;
    }[]
  >(`${group.value?.code ?? "public"}-navLensLinkIds`, []);

  function view(url?: Url) {
    if (!url) return;
    links.value = links.value.filter((v) => v.id !== url.id);
    links.value.unshift(url);
    links.value = links.value.slice(0, 5);
  }

  const lastVisitedLinks = computed(() =>
    links.value
      .map((v) => {
        const site = sites.value?.find((site) => site.id === v.siteId);
        if (site) {
          const { urls, ...data } = site;
          const link = site.urls.find((link) => link.id === v.id);
          return {
            ...data,
            url: link,
          };
        }
        return site;
      })
      .filter((v) => v?.url)
  );
  return {
    links: lastVisitedLinks,
    view,
  };
}
