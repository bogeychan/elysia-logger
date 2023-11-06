# 0.0.13 - 06 Nov 2023

Feature:

- export `pino`

Bug fix:

- allow using `fileLogger()` and `logger()` at the same time [#10](https://github.com/bogeychan/elysia-logger/issues/10)

# 0.0.12 - 18 Oct 2023

Breaking Change:

- automatic `onResponse` logging by `default`; based on [pino-http](https://github.com/pinojs/pino-http); [#6](https://github.com/bogeychan/elysia-logger/issues/6)

  For more details checkout the [migration guide](./MIGRATION.md)

# 0.0.11 - 02 Oct 2023

Feature:

- injecting logger as dependency [#7](https://github.com/bogeychan/elysia-logger/pull/7)

# 0.0.10 - 21 Sep 2023

Improvement:

- added [Migration guide](./MIGRATION.md)

Bug fix:

- update to elysia 0.7.6 [#5](https://github.com/bogeychan/elysia-logger/issues/5)

Breaking Change:

- removed the `contextKeyName` option
- updated typing to infer the elysia context

  For more details checkout the [migration guide](./MIGRATION.md)

# 0.0.9 - 13 Sep 2023

Improvement:

- using the new `ElysiaJS` plugin syntax
- exposing `LoggerOptions` and `Logger` types [#4](https://github.com/bogeychan/elysia-logger/issues/4)

# 0.0.8 - 12 Sep 2023

Improvement:

- auto completion for `level` option

# 0.0.7 - 11 Sep 2023

Bug fix:

- `createPinoLogger` options

# 0.0.6 - 10 Sep 2023

Feature:

- type safety with `contextKeyName` [#2](https://github.com/bogeychan/elysia-logger/issues/2)

# 0.0.5 - 08 Sep 2023

Feature:

- update to elysia 0.6.19

# 0.0.4 - 07 Aug 2023

Bug fix:

- add missing exports

# 0.0.3 - 06 Aug 2023

Feature:

- Include request context info for debugging tools
- Optional alternate name for logger in context

# 0.0.2 - 23 Apr 2023

Bug fix:

- optional `StreamLoggerOptions`

# 0.0.1 - 23 Apr 2023

Feature:

- `StreamLogger` & `FileLogger`

