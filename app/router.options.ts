import type { RouterConfig } from "@nuxt/schema";
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  scrollBehavior(to, _form, savedPosition) {
    if (history.state.stop) {
      return;
    }

    if (history.state.smooth) {
      return {
        el: history.state.smooth,
        behavior: "smooth",
      };
    }

    if (to.hash) {
      const el = document.querySelector(to.hash) as HTMLElement;

      if (!el) {
        return;
      }
      const offset = el.getBoundingClientRect().y + window.scrollY;
      el.classList.add("pulse-highlight");
      el.addEventListener(
        "animationend",
        () => {
          el.classList.remove("pulse-highlight");
        },
        {
          once: true,
        }
      );

      return {
        top: offset - 70,
        behavior: "smooth",
      };
    }

    // Scroll to top of window
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
};
