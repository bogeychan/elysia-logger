# 0.1.8 - 22 January 2025

Feature:

- new `wrap` function to wrap existing `pino` logger [#27](https://github.com/bogeychan/elysia-logger/issues/27)

Bug fix:

- bump `elysia` to `1.2.10`

# 0.1.7 - 24 December 2024

Bug fix:

- bump `elysia` to `1.2.2`

Improvement:

- bump `pino` to `9.6.0`

# 0.1.6 - 17 December 2024

Bug fix:

- Node.js module resolution (implicit index.js imports)

# 0.1.5 - 17 December 2024

Feature:

- new `useLevel` option [#24](https://github.com/bogeychan/elysia-logger/issues/24)

Improvement:

- bump `pino` to `9.5.0`

# 0.1.4 - 29 September 2024

Improvement:

- fix `types` entry in `package.json` [#22](https://github.com/bogeychan/elysia-logger/issues/22)

# 0.1.2 - 16 July 2024

Bug fix:

- pass `boolean` to `autoLogging` [#21](https://github.com/bogeychan/elysia-logger/issues/21)

# 0.1.1 - 16 July 2024

Bug fix:

- bump `elysia` to `1.1.0`

# 0.1.0 - 11 July 2024

Improvement:

- `formatters.ts` now logs `code` and `message` if `Context` is an error
- infer type in util functions of `formatters.ts`
- bump `pino` to `8.18.0`
- bump `elysia` to `1.0.27`

Breaking Change:

- automatic `onError` logging by `default`; [#18](https://github.com/bogeychan/elysia-logger/issues/18)

  For more details checkout the [migration guide](./MIGRATION.md)

- `InferContext` now contains either `Context` or `ErrorContext`

  For more details checkout the [migration guide](./MIGRATION.md)

# 0.0.22 - 24 Mai 2024

Improvement:

- bump `pino` to `9.1.0`

# 0.0.21 - 09 Apr 2024

Bug fix:

- undefined log during ParseError [#16](https://github.com/bogeychan/elysia-logger/issues/16)

# 0.0.20 - 26 Mar 2024

Bug fix:

- bump `elysia` to `1.0.9` and fixed InferContext [#14](https://github.com/bogeychan/elysia-logger/issues/14)

# 0.0.19 - 20 Mar 2024

Bug fix:

- auto logging [#14](https://github.com/bogeychan/elysia-logger/issues/14)

# 0.0.18 - 18 Mar 2024

Bug fix:

- bump `elysia` to `1.0.0` [#14](https://github.com/bogeychan/elysia-logger/issues/14)

# 0.0.17 - 07 Feb 2024

Improvement:

- bump `pino` to `8.18.0`
- bump `elysia` to `0.8.16`

# 0.0.16 - 18 Jan 2024

Bug fix:

- `createPinoLogger` omitting `file` & `stream` options
- remove `Bun`'s `PathLike` type [#11](https://github.com/bogeychan/elysia-logger/issues/11)

# 0.0.15 - 06 Jan 2024

Bug fix:

- replace default `elysia` import with named import [#12](https://github.com/bogeychan/elysia-logger/pull/12)

# 0.0.14 - 24 Dec 2023

Bug fix:

- update `elysia` and `pino`

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
