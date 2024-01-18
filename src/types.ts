import type { pino } from 'pino';
import type { Context, DecoratorBase, Elysia } from 'elysia';

/**
 * The StreamLogger is used to write log entries to a stream such as the console output.
 */
export interface StreamLoggerOptions extends BaseLoggerOptions {
  stream?: pino.DestinationStream;
}
export interface ElysiaStreamLoggerOptions
  extends StreamLoggerOptions,
    ElysiaLoggerOptions {}

/**
 * A FileLogger lets you store log entries in a file.
 */
export interface FileLoggerOptions extends BaseLoggerOptions {
  file: string | number | pino.DestinationStream | NodeJS.WritableStream;
}
export interface ElysiaFileLoggerOptions
  extends FileLoggerOptions,
    ElysiaLoggerOptions {}

export type StandaloneLoggerOptions = StreamLoggerOptions | FileLoggerOptions;

export type LoggerOptions = StandaloneLoggerOptions & ElysiaLoggerOptions;

export type ElysiaLoggerOptions = {
  /**
   * This function will be invoked for each `log`-method called with `context`
   * where you can pass additional properties that need to be logged
   */
  customProps?: <Instance extends Elysia>(
    ctx: InferContext<Instance>
  ) => object;
  /**
   * Disable the automatic "onResponse" logging
   *
   * @default true
   */
  autoLogging?: boolean | { ignore: (ctx: Context) => boolean };
};

export interface ElysiaLogger<E extends Elysia = Elysia> extends Logger {
  /**
   * Call `into` to use the logger instance in both `ctx` and standalone
   *
   * @example
   * const log = createPinoLogger(...);
   * app
   *  .use(log.into())
   *  .onError((ctx) => {
   *     log.error(ctx, ctx.error.name);
   *     return 'onError';
   *  })
   *  .get('/', (ctx) => {
   *     ctx.log.info(ctx, 'Context');
   *     throw { message: '1234', name: 'MyError' };
   *  })
   */
  into(
    options?: _INTERNAL_ElysiaLoggerPluginAutoLoggingEnabledOptions<ElysiaLoggerOptions>
  ): _INTERNAL_ElysiaLoggerPlugin<_INTERNAL_ElysiaLoggerPluginAutoLoggingState>;
  into(
    options?: _INTERNAL_ElysiaLoggerPluginAutoLoggingDisabledOptions<ElysiaLoggerOptions>
  ): _INTERNAL_ElysiaLoggerPlugin;
  into(options?: ElysiaLoggerOptions): E;
}

interface BaseLoggerOptions extends pino.LoggerOptions {}

export type Logger = pino.Logger & BaseLoggerOptions;

export type InferContext<T extends Elysia> = T extends Elysia<
  infer Path,
  infer Decorators,
  infer _Definitions,
  infer _ParentSchema,
  infer Routes
>
  ? Context<Routes, DecoratorBase, Path> & Partial<Decorators['request']>
  : never;

/**
 * Make all properties in T NOT readonly
 *
 * based on @see Readonly
 */
export type _INTERNAL_Writeonly<T> = {
  -readonly [P in keyof T]: T[P];
};

export type _INTERNAL_ElysiaLoggerPluginAutoLoggingState = {
  readonly startTime?: number;
  readonly endTime?: number;
  readonly responseTime?: number;
};

export type _INTERNAL_ElysiaLoggerPlugin<
  Store extends Elysia['store'] = Elysia['store']
> = Elysia<
  '',
  {
    request: {};
    store: Store;
    derive: { log: Logger };
    resolve: {};
  }
>;

export type _INTERNAL_ElysiaLoggerPluginAutoLoggingEnabledOptions<
  Options extends BaseLoggerOptions & ElysiaLoggerOptions
> = Omit<Options, 'autoLogging'> & {
  autoLogging?: true | { ignore: (ctx: Context) => boolean };
};

export type _INTERNAL_ElysiaLoggerPluginAutoLoggingDisabledOptions<
  Options extends BaseLoggerOptions & ElysiaLoggerOptions
> = Omit<Options, 'autoLogging'> & { autoLogging: false };

