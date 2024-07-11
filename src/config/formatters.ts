import type { RouteSchema } from "elysia";
import type { LoggerOptions } from "pino";

import { serializeRequest } from "./serializers";
import type {
  ElysiaLoggerContext,
  _INTERNAL_ElysiaLoggerPluginAutoLoggingState,
} from "../types";

export const formatters = {
  log(object) {
    if (isContext(object)) {
      const log: Record<string, any> = {
        request: object.request,
      };

      if (object.isError) {
        log.code = object.code;
        log.message = object.error.message;
      } else {
        if (object.store.responseTime) {
          log.responseTime = object.store.responseTime;
        }
      }

      return log;
    } else if (isRequest(object)) {
      return serializeRequest(object);
    }
    return object;
  },
} satisfies LoggerOptions["formatters"];

export function isContext(object: unknown): object is ElysiaLoggerContext<
  RouteSchema,
  {
    request: {};
    store: _INTERNAL_ElysiaLoggerPluginAutoLoggingState;
    derive: {};
    resolve: {};
    decorator: {};
  }
> {
  const context = object as Partial<ElysiaLoggerContext>;
  switch (undefined) {
    case context.request:
    case context.store:
    case context.isError:
      return false;
  }
  return true;
}

export function isRequest(object: unknown): object is Request {
  const request = object as Partial<Request>;
  switch (undefined) {
    case request.url:
    case request.method:
      return false;
  }
  return true;
}
