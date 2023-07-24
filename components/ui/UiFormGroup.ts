import { h, cloneVNode, computed, defineComponent } from "vue";
import type { PropType } from "vue";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import { FormError } from "../../types";

// TODO: Remove
// @ts-expect-error
import appConfig from "#build/app.config";


export default defineComponent({
  props: {
    name: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    help: {
      type: String,
      default: null,
    },
    error: {
      type: [String, Boolean],
      default: null,
    },
    hint: {
      type: String,
      default: null,
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.formGroup>>,
      default: () => appConfig.ui.formGroup,
    },
  },
  setup(props, { slots }) {
    // TODO: Remove
    const appConfig = useAppConfig();

    const ui = computed<Partial<typeof appConfig.ui.formGroup>>(() =>
      defu({}, props.ui, appConfig.ui.formGroup)
    );

    provide("form-path", props.path);
    const formErrors = inject<Ref<FormError[]> | null>("form-errors", null);
    const errorMessage = computed(() => {
      return props.error && typeof props.error === "string"
        ? props.error
        : formErrors?.value?.find((error) => error.path === props.path)
            ?.message;
    });

    const children = computed(() => getSlotsChildren(slots));

    const clones = computed(() =>
      children.value.map((node: any) => {
        const vProps: any = {};

        if (props.error) {
          vProps.oldColor = node.props.color;
          vProps.color = "red";
        } else if (vProps.oldColor) {
          vProps.color = vProps.oldColor;
        }

        if (props.name) {
          vProps.name = props.name;
        }

        return cloneVNode(node, vProps);
      })
    );

    return () =>
      h("div", { class: [ui.value.wrapper], "data-form-path": props.path }, [
        props.label &&
          h("div", { class: [ui.value.label?.wrapper] }, [
            h(
              "label",
              {
                for: props.name,
                class: [
                  ui.value.label?.base,
                  props.required && ui.value.label?.required,
                ],
              },
              props.label
            ),
            props.hint && h("span", { class: [ui.value.hint] }, props.hint),
          ]),
        props.description &&
          h("p", { class: [ui.value.description] }, props.description),
        h("div", { class: [!!props.label && ui.value.container] }, [
          ...clones.value,
          errorMessage.value
            ? h("p", { class: [ui.value.error] }, errorMessage.value)
            : props.help
            ? h("p", { class: [ui.value.help] }, props.help)
            : null,
        ]),
      ]);
  },
});
