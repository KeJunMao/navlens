import type { EventHandler } from "h3";
import { ZodError } from "zod";

function zodErrorToString(err: ZodError) {
  const errors = err.formErrors;
  console.log(errors)
  const fieldErrors = Object.keys(errors.fieldErrors).map(
    (key) => `${key}: ${errors.fieldErrors[key]?.join(", ")}`
  );
  const formErrors = errors.formErrors.length
    ? `formErrors: ${errors.formErrors.join(", ")}\n`
    : "";
  return `${formErrors}${fieldErrors.join("\n")}`;
}

export const defineApi = (handler: EventHandler) =>
  defineEventHandler(async (event) => {
    try {
      const response = await handler(event);
      return response;
    } catch (err) {
      if (err instanceof ZodError) {
        err = createError({
          statusCode: 400,
          statusMessage: "Bad Request",
          message: zodErrorToString(err),
        });
      }
      return err;
    }
  });
