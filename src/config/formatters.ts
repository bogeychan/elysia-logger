import type { Context } from 'elysia';
import type { LoggerOptions } from 'pino';

import { serializeRequest } from './serializers';

export const formatters: LoggerOptions['formatters'] = {
  log(object) {
    if (isContext(object)) {
      const context = object as unknown as Context;
      return { request: context.request };
    } else if (isRequest(object)) {
      return serializeRequest(object as unknown as Request);
    }
    return object;
  }
};

function isContext(object: unknown) {
  const context = object as Context;
  return context.request && context.store;
}

function isRequest(object: unknown) {
  const request = object as Request;
  return request.url && request.method;
}
