# @bogeychan/elysia-logger

A plugin for [Elysia.js](https://elysiajs.com) for logging using the [pino](https://getpino.io) library.

## [Migration Guide](./MIGRATION.md)

## Installation

```bash
bun add @bogeychan/elysia-logger
```

## Usage

```ts
import { Elysia } from "elysia";
import { logger } from "@bogeychan/elysia-logger";

const app = new Elysia()
  .use(
    logger({
      level: "error",
    })
  )
  .get("/", (ctx) => {
    ctx.log.error(ctx, "Context");
    ctx.log.info(ctx.request, "Request"); // noop

    return "Hello World";
  })
  .listen(3000);

console.log(`Listening on ${app.server!.url}`);
```

### Log to a file, or

```ts
import { fileLogger } from "@bogeychan/elysia-logger";

fileLogger({
  file: "./my.log",
});
```

### Pipe the log entries into a stream

```ts
import { logger } from '@bogeychan/elysia-logger';

logger({
  stream: ... // default -> console output
});
```

### Include additional request context info

```ts
import { logger, type InferContext } from "@bogeychan/elysia-logger";

const myPlugin = () => new Elysia().decorate("myProperty", 42);

// ...

class MyError extends Error {
  constructor(message: string, public myValue: string) {
    super(message);
  }
}

app = app.error("myError", MyError).use(myPlugin());

app
  .use(
    logger({
      /**
       * This function will be invoked for each `log`-method called
       * where you can pass additional properties that need to be logged
       */
      customProps(ctx: InferContext<typeof app>) {
        if (ctx.isError && ctx.code === "myError") {
          return {
            myValue: ctx.error.myValue,
          };
        }

        return {
          params: ctx.params,
          query: ctx.query,
          myProperty: ctx.myProperty,
        };
      },
    })
  )
  .get("/", (ctx) => {
    ctx.log.info(ctx, "Context");

    return "with-context";
  })
  .get("/error", () => {
    throw new MyError("whelp", "yay");
  });
```

### Use the logger instance both `Standalone` and inside `Context`

```ts
import { createPinoLogger } from "@bogeychan/elysia-logger";

const log = createPinoLogger(/* ... */);

app
  .use(log.into(/* ... */))
  .onError((ctx) => {
    log.error(ctx, ctx.error.name);
    return "onError";
  })
  .get("/", (ctx) => {
    ctx.log.info(ctx, "Context");

    throw new Error("whelp");
  });
```

### Use existing `pino` logger

```ts
import { pino } from "pino";
import { wrap } from "@bogeychan/elysia-logger";

const logger = pino(/* ... */);

app
  .use(
    wrap(logger, {
      /* ... */
    })
  )
  .get("/", (ctx) => {
    ctx.log.info(ctx, "Context");

    return "wrapped!";
  });
```

### Automatic `onAfterResponse` & `onError` logging by `default`; based on [pino-http](https://github.com/pinojs/pino-http)

```ts
import { logger } from "@bogeychan/elysia-logger";

app
  .use(
    logger({
      autoLogging: true, // default
      autoLogging: false, // disabled
      autoLogging: {
        ignore(ctx) {
          return true; // ignore logging for requests based on condition
        },
      },
    })
  )
  .get("/", (ctx) => "autoLogging");
```

Checkout the [examples](./examples) folder on github for further use cases such as the integration of [pino-pretty](https://github.com/pinojs/pino-pretty) for readable console outputs.

## License

[MIT](LICENSE)
