import type { pino } from 'pino';
import type { Context, Elysia, ElysiaInstance } from 'elysia';

/**
 * The StreamLogger is used to write log entries to a stream such as the console output.
 */
export type StreamLoggerOptions<ContextKeyName extends string> =
  BaseLoggerOptions<ContextKeyName> & {
    stream?: pino.DestinationStream;
  };

/**
 * A FileLogger lets you store log entries in a file.
 */
export type FileLoggerOptions<ContextKeyName extends string> =
  BaseLoggerOptions<ContextKeyName> & {
    file: PathLike;
  };

/**
 * Combine all loggers into one to become even more powerful muhaha :D
 */
export type LoggerOptions<ContextKeyName extends string> =
  | StreamLoggerOptions<ContextKeyName>
  | FileLoggerOptions<ContextKeyName>;

type BaseLoggerOptions<ContextKeyName extends string> = Omit<
  pino.LoggerOptions,
  'level'
> & {
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
   * Customize the logger name in the request context
   *
   * @example
   * const app = new Elysia()
   * .use(logger({ contextKeyName: 'myLogger' }))
   * .get('/', (ctx) => {
   * // property "myLogger" is available instead of "log"
   *  ctx.myLogger.info(ctx.request, 'Request');
   *  // ...
   * }).listen(8080);
   */
  contextKeyName?: ContextKeyName;
  /**
   * This function will be invoked for each `log`-method called with `context`
   * where you can pass additional properties that need to be logged
   */
  customProps?: <Instance extends ElysiaInstance>(
    ctx: ElysiaContextForInstance<Instance>
  ) => object;
};

export type Logger = pino.Logger;

export type InferElysiaInstance<T> = T extends Elysia<infer _BasePath, infer U>
  ? U
  : never;

export type ElysiaContextForInstance<Instance extends ElysiaInstance> = Context<
  Instance['schema'],
  Instance['store']
> &
  Partial<Instance['request']>;

