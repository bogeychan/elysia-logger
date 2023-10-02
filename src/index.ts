import pino from 'pino';
import Elysia from 'elysia';

import type {
  Logger,
  ElysiaLogger,
  LoggerOptions,
  FileLoggerOptions,
  StreamLoggerOptions,
  ElysiaLoggerOptions,
  StandaloneLoggerOptions
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
export const logger = (options: StreamLoggerOptions = {}) => plugin(options);

/**
 * A FileLogger lets you store log entries in a file.
 */
export const fileLogger = (options: FileLoggerOptions) => plugin(options);

/**
 * Create a logger instance like the plugin.
 */
export function createPinoLogger(
  options: StandaloneLoggerOptions = {}
): ElysiaLogger<ReturnType<typeof into>> {
  const log = createPinoLoggerInternal(options);
  (log as unknown as ElysiaLogger).into = into.bind(log);
  return log as unknown as ElysiaLogger<ReturnType<typeof into>>;
}

function createPinoLoggerInternal(options: StandaloneLoggerOptions) {
  if (!options.level) {
    options.level = 'info';
  }

  if (!options.formatters) {
    options.formatters = formatters;
  }

  if (!options.serializers) {
    options.serializers = serializers;
  }

  const streamOptions = options as StreamLoggerOptions;

  if ('file' in options) {
    streamOptions.stream = pino.destination(options.file);
    delete (options as Partial<FileLoggerOptions>).file;
  }

  return pino(options, streamOptions.stream!);
}

function into(this: Logger, options: ElysiaLoggerOptions = {}) {
  return new Elysia({
    name: '@bogeychan/elysia-logger'
  }).derive((ctx) => ({
    log:
      typeof options.customProps === 'function'
        ? this.child(options.customProps(ctx))
        : this
  }));
}

const plugin = (options: LoggerOptions) =>
  into.bind(createPinoLoggerInternal(options))(options);

export * from './config';

export type { InferContext } from './types';

