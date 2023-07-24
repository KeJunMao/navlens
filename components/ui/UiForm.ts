import { provide, ref, PropType, h } from "vue";
import { FormError, FormEvent } from "../../types";
import { useEventBus } from "@vueuse/core";

import type { ZodSchema, ZodError } from "zod";

function findAncestorWithFormDataPath(el: any) {
  let ancestor = el.parentElement;

  while (ancestor !== null) {
    if (ancestor.hasAttribute("data-form-path")) {
      return ancestor;
    }
    ancestor = ancestor.parentElement;
  }

  return null;
}

function isZodSchema(schema: any): schema is ZodSchema {
  return schema.parse !== undefined;
}

function isZodError(error: any): error is ZodError {
  return error.issues !== undefined;
}

async function getZodErrors(
  state: any,
  schema: ZodSchema
): Promise<FormError[]> {
  try {
    schema.parse(state);
    return [];
  } catch (error) {
    if (isZodError(error)) {
      return error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
    } else {
      throw error;
    }
  }
}

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<ZodSchema>,
      default: undefined,
    },

    state: {
      type: Object,
      required: true,
    },

    validate: {
      type: Function as PropType<(state: any) => Promise<FormError[]>>,
      default: () => [],
    },
  },

  setup(props, { slots, expose }) {
    const seed = Math.random().toString(36).substring(7);
    const bus = useEventBus<FormEvent>(`form-${seed}`);

    bus.on(async (event) => {
      if (event.type === "blur") {
        const otherErrors = errors.value.filter(
          (error) => error.path !== event.path
        );
        const pathErrors = (await getErrors()).filter(
          (error) => error.path === event.path
        );
        errors.value = otherErrors.concat(pathErrors);
      }
    });

    const errors = ref<FormError[]>([]);
    provide("form-errors", errors);
    provide("form-events", bus);

    async function getErrors(): Promise<FormError[]> {
      let errs = await props.validate(props.state);

      if (props.schema) {
        if (isZodSchema(props.schema)) {
          errs = errs.concat(await getZodErrors(props.state, props.schema));
        } else {
          throw new Error("Form validation failed: Unsupported form schema");
        }
      }

      return errs;
    }

    async function validate() {
      errors.value = await getErrors();
      if (errors.value.length > 0) {
        throw new Error(
          `Form validation failed: ${JSON.stringify(errors.value, null, 2)}`
        );
      }
    }

    expose({
      validate,
    });

    return () =>
      h(
        "form",
        {
          onBlurCapture(event: any) {
            const parent = findAncestorWithFormDataPath(event?.target);
            if (parent && parent.dataset.formPath) {
              bus.emit({
                type: "blur",
                path: parent.dataset.formPath,
              });
            }
          },
        },
        slots.default?.()
      );
  },
});
