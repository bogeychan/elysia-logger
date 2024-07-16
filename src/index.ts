import pino from "pino";
import { Elysia } from "elysia";

import type {
  Logger,
  ElysiaLogger,
  LoggerOptions,
  FileLoggerOptions,
  StreamLoggerOptions,
  ElysiaLoggerContext,
  ElysiaLoggerOptions,
  StandaloneLoggerOptions,
  ElysiaFileLoggerOptions,
  ElysiaStreamLoggerOptions,
  _INTERNAL_Writeonly,
  _INTERNAL_ElysiaLoggerPlugin,
  _INTERNAL_ElysiaLoggerPluginAutoLoggingState,
  _INTERNAL_ElysiaLoggerPluginAutoLoggingEnabledOptions,
  _INTERNAL_ElysiaLoggerPluginAutoLoggingDisabledOptions,
} from "./types";

/**
 * If you call one of the derived methods of this plugin (such as: ctx.log.info(object)) with a request or context object,
 * these formatters and serializers ensure that not everything ends up in the log output.
 *
 * You can replace them altogether by providing your own via the plugin-options to manipulate the output.
 *
 * I highly recommend to read the [Pino documentation](https://getpino.io/#/docs/api?id=options) yourself to learn about additional options.
 */
import { formatters, serializers } from "./config";

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
export function createPinoLogger(options: StandaloneLoggerOptions = {}) {
  type ElysiaLoggerInstance = ElysiaLogger<ReturnType<typeof into>>;

  const log = createPinoLoggerInternal(options);
  // @ts-ignore
  (log as unknown as ElysiaLoggerInstance).into = into.bind(log);
  return log as unknown as ElysiaLoggerInstance;
}

function createPinoLoggerInternal(options: StandaloneLoggerOptions) {
  options.level ??= "info";
  options.formatters ??= formatters;
  options.serializers ??= serializers;

  const streamOptions = options as StreamLoggerOptions;

  if ("file" in options) {
    streamOptions.stream = pino.destination(options.file);
    delete (options as Partial<FileLoggerOptions>).file;
  }

  return pino(options, streamOptions.stream!);
}

function into(this: Logger, options: ElysiaLoggerOptions = {}) {
  const autoLogging = options.autoLogging ?? true;

  delete options.autoLogging;

  const getLog = (ctx: ElysiaLoggerContext) => {
    return typeof options.customProps === "function"
      ? this.child(options.customProps(ctx))
      : this;
  };

  let app = new Elysia({
    name: "@bogeychan/elysia-logger",
    seed: options,
  }).derive({ as: "global" }, (ctx) => {
    const loggerCtx = ctx as unknown as ElysiaLoggerContext;
    loggerCtx.isError = false;
    return { log: getLog(loggerCtx) };
  });

  if (autoLogging) {
    return (
      app as unknown as _INTERNAL_ElysiaLoggerPlugin<
        _INTERNAL_Writeonly<_INTERNAL_ElysiaLoggerPluginAutoLoggingState>
      >
    )
      .onRequest((ctx) => {
        ctx.store = { ...ctx.store, startTime: performance.now() };
      })
      .onAfterResponse({ as: "global" }, (ctx) => {
        const loggerCtx = ctx as unknown as ElysiaLoggerContext;
        loggerCtx.isError = false;

        const log = getLog(loggerCtx);

        if (log.level == "silent") {
          return;
        }

        if (typeof autoLogging == "object" && autoLogging.ignore(loggerCtx)) {
          return;
        }

        ctx.store.startTime ??= 0;
        ctx.store.endTime = performance.now();
        ctx.store.responseTime = ctx.store.endTime - ctx.store.startTime;

        log.info(ctx);
      })
      .onError({ as: "global" }, (ctx) => {
        const loggerCtx = ctx as ElysiaLoggerContext;
        loggerCtx.isError = true;

        const log = getLog(loggerCtx);

        if (log.level == "silent") {
          return;
        }

        if (typeof autoLogging == "object" && autoLogging.ignore(loggerCtx)) {
          return;
        }

        if (ctx.code === "NOT_FOUND") {
          log.info(ctx);
        } else {
          log.error(ctx);
        }
      });
  }

  return app;
}

const plugin = (options: LoggerOptions) =>
  into.bind(createPinoLoggerInternal(options))(options);

export * from "./config";

export type { InferContext } from "./types";

export { pino } from "pino";
