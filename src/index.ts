import pino from 'pino';
import Elysia from 'elysia';

import type {
  LoggerOptions,
  FileLoggerOptions,
  StreamLoggerOptions
} from './types';

/**
 * If you call one of the derived methods of this plugin (such as: ctx.log.info(object)) with a request or context object,
 * these formatters and serializers ensure that not everything ends up in the log output.
 *
 * You can replace them altogether by providing your own via the plugin-options to manipulate the output.
 *
 * I highly recommend to read the [Pino documentation](https://getpino.io/#/docs/api?id=options) yourself to learn about additional options.
 */
import { formatters, serializers } from './config';

/**
 * The StreamLogger is used to write log entries to a stream such as the console output (default behavior).
 */
export const logger = <ContextKeyName extends string = 'log'>(
  options: StreamLoggerOptions<ContextKeyName> = {}
) => plugin(options);

/**
 * A FileLogger lets you store log entries in a file.
 */
export const fileLogger = <ContextKeyName extends string = 'log'>(
  options: FileLoggerOptions<ContextKeyName>
) => plugin(options);

/**
 * Create a logger instance like the plugin.
 */
export function createPinoLogger<ContextKeyName extends string = string>(
  options: Omit<
    LoggerOptions<ContextKeyName>,
    'customProps' | 'contextKeyName'
  > = {}
) {
  if (!options.level) {
    options.level = 'info';
  }

  if (!options.formatters) {
    options.formatters = formatters;
  }

  if (!options.serializers) {
    options.serializers = serializers;
  }

  const streamOptions = options as StreamLoggerOptions<ContextKeyName>;

  if ('file' in options) {
    // @ts-ignore options.file
    streamOptions.stream = pino.destination(options.file);
    delete (options as Partial<FileLoggerOptions<ContextKeyName>>).file;
  }

  return pino(options, streamOptions.stream!);
}

function plugin<ContextKeyName extends string>(
  options: LoggerOptions<ContextKeyName>
) {
  if (!options.contextKeyName) {
    options.contextKeyName = 'log' as ContextKeyName;
  }

  const { contextKeyName, ...loggerOptions } = options;

  type DeriveReturned = {
    [K in ContextKeyName]: ReturnType<typeof createPinoLogger<ContextKeyName>>;
  };

  return new Elysia({
    name: '@bogeychan/elysia-logger'
  }).derive<DeriveReturned>(
    // @ts-ignore
    (ctx) => {
      let log = createPinoLogger(loggerOptions);

      if (typeof options.customProps === 'function') {
        // @ts-ignore
        log = log.child(options.customProps(ctx));
      }

      return {
        [contextKeyName]: log
      };
    }
  );
}

export * from './config';

export type { ElysiaContextForInstance, InferElysiaInstance } from './types';

