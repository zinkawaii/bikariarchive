import { isObject } from "@vueuse/core";

export function getErrorCode(error: unknown) {
  if (isObject(error) && "data" in error && isObject(error.data) && "message" in error.data) {
    return error.data.message;
  }
}
