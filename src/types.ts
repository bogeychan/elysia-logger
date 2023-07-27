import type {
  DestinationStream,
  LoggerOptions as PinoLoggerOptions
} from 'pino';

/**
 * The StreamLogger is used to write log entries to a stream such as the console output.
 */
export type StreamLoggerOptions = PinoLoggerOptions & BaseLoggerOptions & {
  stream?: DestinationStream;
};

/**
 * A FileLogger lets you store log entries in a file.
 */
export type FileLoggerOptions = PinoLoggerOptions & BaseLoggerOptions & {
  file: PathLike;
};

/**
 * Combine all loggers into one to become even more powerful muhaha :D
 */
export type LoggerOptions = StreamLoggerOptions | FileLoggerOptions;

type BaseLoggerOptions = {
  contextKeyName?: string;
  includeRequestContext?: boolean;
}