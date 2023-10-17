# @bogeychan/elysia-logger

A plugin for [Elysia.js](https://elysiajs.com) for logging using the [pino](https://getpino.io) library.

## [Migration guide](./MIGRATION.md)

## Installation

```bash
bun add @bogeychan/elysia-logger
```

## Usage

```ts
import { Elysia } from 'elysia';
import { logger } from '@bogeychan/elysia-logger';

const app = new Elysia()
  .use(
    logger({
      level: 'error'
    })
  )
  .get('/', (ctx) => {
    ctx.log.error(ctx, 'Context');
    ctx.log.info(ctx.request, 'Request'); // noop

    return 'Hello World';
  })
  .listen(8080);

console.log(`Listening on http://${app.server!.hostname}:${app.server!.port}`);
```

### Log to a file, or

```ts
import { fileLogger } from '@bogeychan/elysia-logger';

fileLogger({
  file: './my.log'
});
```

### Pipe the log entries into a stream

```ts
import { logger } from '@bogeychan/elysia-logger';

logger({
  stream: ... // default -> console output
});
```

### Include additional request context info for debugging tools

```ts
import { logger, type InferContext } from '@bogeychan/elysia-logger';

const myPlugin = () => (app: Elysia) => app.decorate('myProperty', 42);

// ...

app = app.use(myPlugin());

app
  .use(
    logger({
      /**
       * This function will be invoked for each `log`-method called with `context`
       * where you can pass additional properties that need to be logged
       */
      customProps(ctx: InferContext<typeof app>) {
        return {
          params: ctx.params,
          query: ctx.query,
          myProperty: ctx.myProperty
        };
      }
    })
  )
  .get('/', (ctx) => {
    ctx.log.info(ctx, 'Context');

    return 'with-context';
  });
```

### Use the logger instance both `Standalone` and inside `Context`

```ts
import { createPinoLogger } from '@bogeychan/elysia-logger';

const log = createPinoLogger(/* ... */);

app
  .use(log.into(/* ... */))
  .onError((ctx) => {
    log.error(ctx, ctx.error.name);
    return 'onError';
  })
  .get('/', (ctx) => {
    ctx.log.info(ctx, 'Context');

    throw { message: '1234', name: 'MyError' };
  });
```

### Automatic `onResponse` logging by `default`; based on [pino-http](https://github.com/pinojs/pino-http)

```ts
import { logger } from '@bogeychan/elysia-logger';

app
  .use(
    logger({
      autoLogging: true, // default
      autoLogging: false, // disabled
      autoLogging: {
        ignore(ctx) {
          return true; // ignore logging for requests based on condition
        }
      }
    })
  )
  .get('/', (ctx) => 'autoLogging');
```

Checkout the [examples](./examples) folder on github for further use cases such as the integration of [pino-pretty](https://github.com/pinojs/pino-pretty) for readable console outputs.

## License

[MIT](LICENSE)

