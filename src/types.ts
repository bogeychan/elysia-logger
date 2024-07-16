import type { pino } from "pino";
import type {
  Context,
  Elysia,
  RouteSchema,
  ErrorHandler,
  SingletonBase,
  EphemeralType,
} from "elysia";

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

export type ErrorContext<
  T extends Record<string, Error> = {},
  Route extends RouteSchema = RouteSchema,
  Singleton extends SingletonBase = SingletonBase,
  Ephemeral extends EphemeralType = EphemeralType,
  Volatile extends EphemeralType = EphemeralType
> = Parameters<ErrorHandler<T, Route, Singleton, Ephemeral, Volatile>>[0];

export type ElysiaLoggerContext<
  Route extends RouteSchema = {},
  Singleton extends SingletonBase = SingletonBase
> =
  | ({ isError: false } & Context<Route, Singleton>)
  | ({ isError: true } & ErrorContext);

export type ElysiaLoggerOptions = {
  /**
   * This function will be invoked for each `log`-method called with `context`
   * where you can pass additional properties that need to be logged
   */
  customProps?: (ctx: ElysiaLoggerContext) => object;
  /**
   * Disable the automatic "onAfterResponse" & "onError" logging
   *
   * @default true
   */
  autoLogging?: boolean | { ignore: (ctx: ElysiaLoggerContext) => boolean };
};

export interface ElysiaLogger<E = Elysia> extends Logger {
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

export type InferContext<T> = T extends Elysia<
  infer _Path,
  infer _Scoped,
  infer Singleton,
  infer Definitions,
  infer _Metadata,
  infer _Routes,
  infer Ephemeral,
  infer Volatile
>
  ?
      | ({
          isError: false;
        } & Context<
          RouteSchema,
          {
            decorator: Partial<Singleton["decorator"]>;
            store: Partial<Singleton["store"]>;
            derive: Partial<
              Singleton["derive"] & Ephemeral["derive"] & Volatile["derive"]
            >;
            resolve: Partial<
              Singleton["resolve"] & Ephemeral["resolve"] & Volatile["resolve"]
            >;
          }
        >)
      | ({
          isError: true;
        } & ErrorContext<
          Definitions["error"],
          RouteSchema,
          {
            decorator: Partial<Singleton["decorator"]>;
            store: Partial<Singleton["store"]>;
            derive: Partial<
              Singleton["derive"] & Ephemeral["derive"] & Volatile["derive"]
            >;
            resolve: Partial<
              Singleton["resolve"] & Ephemeral["resolve"] & Volatile["resolve"]
            >;
          }
        >)
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
  Store extends Elysia["store"] = Elysia["store"]
> = Elysia<
  "",
  false,
  {
    store: Store;
    derive: { readonly log: Logger };
    decorator: {};
    resolve: {};
  }
>;

export type _INTERNAL_ElysiaLoggerPluginAutoLoggingEnabledOptions<
  Options extends BaseLoggerOptions & ElysiaLoggerOptions
> = Omit<Options, "autoLogging"> & {
  autoLogging?: true | { ignore: (ctx: ElysiaLoggerContext) => boolean };
};

export type _INTERNAL_ElysiaLoggerPluginAutoLoggingDisabledOptions<
  Options extends BaseLoggerOptions & ElysiaLoggerOptions
> = Omit<Options, "autoLogging"> & { autoLogging: false };
