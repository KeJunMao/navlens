// https://github.com/Hebilicious/authjs-nuxt/pull/48

export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth();
  if (status.value === "authenticated") {
    // @ts-ignore
    return navigateTo(
      to?.meta?.auth?.authenticatedRedirectTo ??
        useRuntimeConfig()?.public?.authJs?.authenticatedRedirectTo ??
        "/"
    );
  }
});
