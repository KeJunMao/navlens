export const getSlotsChildren = (slots: any) => {
  let children = slots.default?.();
  if (children.length) {
    children = children
      .flatMap((c: any) => {
        if (typeof c.type === "symbol") {
          if (typeof c.children === "string") {
            // `v-if="false"` or commented node
            return;
          }
          return c.children;
        } else if (c.type.name === "ContentSlot") {
          return c.ctx.slots.default?.();
        }
        return c;
      })
      .filter(Boolean);
  }
  return children;
};
