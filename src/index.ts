import pino from 'pino';
import { Elysia } from 'elysia';

import type {
  Logger,
  ElysiaLogger,
  LoggerOptions,
  FileLoggerOptions,
  StreamLoggerOptions,
  ElysiaLoggerOptions,
  StandaloneLoggerOptions,
  ElysiaFileLoggerOptions,
  ElysiaStreamLoggerOptions,
  _INTERNAL_Writeonly,
  _INTERNAL_ElysiaLoggerPlugin,
  _INTERNAL_ElysiaLoggerPluginAutoLoggingState,
  _INTERNAL_ElysiaLoggerPluginAutoLoggingEnabledOptions,
  _INTERNAL_ElysiaLoggerPluginAutoLoggingDisabledOptions
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
export function logger(
  options?: _INTERNAL_ElysiaLoggerPluginAutoLoggingEnabledOptions<ElysiaStreamLoggerOptions>
): _INTERNAL_ElysiaLoggerPlugin<_INTERNAL_ElysiaLoggerPluginAutoLoggingState>;
export function logger(
  options?: _INTERNAL_ElysiaLoggerPluginAutoLoggingDisabledOptions<ElysiaStreamLoggerOptions>
): _INTERNAL_ElysiaLoggerPlugin;
export function logger(options: ElysiaStreamLoggerOptions = {}) {
  return plugin(options);
}

/**
 * A FileLogger lets you store log entries in a file.
 */
export function fileLogger(
  options: _INTERNAL_ElysiaLoggerPluginAutoLoggingEnabledOptions<ElysiaFileLoggerOptions>
): _INTERNAL_ElysiaLoggerPlugin<_INTERNAL_ElysiaLoggerPluginAutoLoggingState>;
export function fileLogger(
  options: _INTERNAL_ElysiaLoggerPluginAutoLoggingDisabledOptions<ElysiaFileLoggerOptions>
): _INTERNAL_ElysiaLoggerPlugin;
export function fileLogger(options: ElysiaFileLoggerOptions) {
  return plugin(options);
}

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
  options.level ??= 'info';
  options.formatters ??= formatters;
  options.serializers ??= serializers;

  const streamOptions = options as StreamLoggerOptions;

  if ('file' in options) {
    streamOptions.stream = pino.destination(options.file);
    delete (options as Partial<FileLoggerOptions>).file;
  }

  return pino(options, streamOptions.stream!);
}

function into(this: Logger, options: ElysiaLoggerOptions = {}) {
  const autoLogging = options.autoLogging ?? true;

  delete options.autoLogging;

  let log: Logger;

  let app = new Elysia({
    name: '@bogeychan/elysia-logger',
    seed: options
  }).derive((ctx) => {
    log =
      typeof options.customProps === 'function'
        ? this.child(options.customProps(ctx))
        : this;

    return { log };
  });

  if (autoLogging) {
    app = (
      app as _INTERNAL_ElysiaLoggerPlugin<
        _INTERNAL_Writeonly<_INTERNAL_ElysiaLoggerPluginAutoLoggingState>
      >
    )
      .onRequest((ctx) => {
        ctx.store = { ...ctx.store, startTime: performance.now() };
      })
      .onResponse((ctx) => {
        if (log.level == 'silent') {
          return;
        }

        if (typeof autoLogging == 'object' && autoLogging.ignore(ctx)) {
          return;
        }

        ctx.store.startTime ??= 0;
        ctx.store.endTime = performance.now();
        ctx.store.responseTime = ctx.store.endTime - ctx.store.startTime;

        log.info(ctx);
      });
    // ! log is undefined or onError called twice for custom error...
    // ? tested on elysia@0.7.17
    // .onError((ctx) => {
    //   log.error(ctx);
    // });
  }

  return app;
}

const plugin = (options: LoggerOptions) =>
  into.bind(createPinoLoggerInternal(options))(options);

export * from './config';

export type { InferContext } from './types';

export { pino } from 'pino';

