import type { Context, Elysia, ElysiaInstance } from 'elysia';
import type {
  DestinationStream,
  LoggerOptions as PinoLoggerOptions
} from 'pino';

/**
 * The StreamLogger is used to write log entries to a stream such as the console output.
 */
export type StreamLoggerOptions = BaseLoggerOptions & {
  stream?: DestinationStream;
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

type BaseLoggerOptions = PinoLoggerOptions & {
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
  contextKeyName?: string;
  /**
   * This function will be invoked for each `log`-method called with `context`
   * where you can pass additional properties that need to be logged
   */
  customProps?: <Instance extends ElysiaInstance>(
    ctx: ElysiaContextForInstance<Instance>
  ) => object;
};

export type InferElysiaInstance<T> = T extends Elysia<infer U> ? U : never;

export type ElysiaContextForInstance<Instance extends ElysiaInstance> = Context<
  Instance['schema'],
  Instance['store']
> &
  Partial<Instance['request']>;

