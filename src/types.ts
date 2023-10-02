import type { pino } from 'pino';
import type { Context, DecoratorBase, Elysia } from 'elysia';

/**
 * The StreamLogger is used to write log entries to a stream such as the console output.
 */
export type StreamLoggerOptions = BaseLoggerOptions & {
  stream?: pino.DestinationStream;
};

/**
 * A FileLogger lets you store log entries in a file.
 */
export type FileLoggerOptions = BaseLoggerOptions & {
  file: PathLike;
};

/**
 * Combine all loggers into one to become even more powerful muhaha :D
 */
export type LoggerOptions = StreamLoggerOptions | FileLoggerOptions;

export type ElysiaLoggerOptions = Pick<BaseLoggerOptions, 'customProps'>;

export type StandaloneLoggerOptions = Omit<LoggerOptions, 'customProps'>;

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
  into(options?: ElysiaLoggerOptions): E;
}

type BaseLoggerOptions = Omit<pino.LoggerOptions, 'level'> & {
  /**
   * One of the supported levels or `silent` to disable logging.
   * Any other value defines a custom level and requires supplying a level value via `levelVal`. Default: 'info'.
   *
   * Improved type support:
   *
   * @extends PinoLoggerOptions
   * @see https://github.com/microsoft/TypeScript/issues/29729
   */
  level?: pino.LevelWithSilent | (string & {});
  /**
   * This function will be invoked for each `log`-method called with `context`
   * where you can pass additional properties that need to be logged
   */
  customProps?: <Instance extends Elysia>(
    ctx: InferContext<Instance>
  ) => object;
};

export type Logger<Options = StandaloneLoggerOptions> = pino.Logger<Options>;

export type InferContext<T extends Elysia> = T extends Elysia<
  infer Path,
  infer Decorators,
  infer _Definitions,
  infer _ParentSchema,
  infer Routes
>
  ? Context<Routes, DecoratorBase, Path> & Partial<Decorators['request']>
  : never;

