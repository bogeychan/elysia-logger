import type { Context } from 'elysia';
import type { LoggerOptions } from 'pino';

import { serializeRequest } from './serializers';
import type { _INTERNAL_ElysiaLoggerPluginAutoLoggingState } from '../types';

export const formatters = {
  log(object) {
    if (isContext(object)) {
      const context = object as unknown as Context<
        {},
        {
          request: {};
          store: _INTERNAL_ElysiaLoggerPluginAutoLoggingState;
          derive: {};
          resolve: {};
        }
      >;

      const log: Record<string, any> = {
        request: context.request
      };

      if (context.store.responseTime) {
        log.responseTime = context.store.responseTime;
      }

      return log;
    } else if (isRequest(object)) {
      return serializeRequest(object as unknown as Request);
    }
    return object;
  }
} satisfies LoggerOptions['formatters'];

export function isContext(object: unknown) {
  const context = object as Context;
  return context.request && context.store;
}

export function isRequest(object: unknown) {
  const request = object as Request;
  return request.url && request.method;
}

