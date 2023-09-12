# @bogeychan/elysia-logger

A plugin for [Elysia.js](https://elysiajs.com) for logging using the [pino](https://getpino.io) library

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
import { logger } from '@bogeychan/elysia-logger';

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
      customProps(
        ctx: ElysiaContextForInstance<InferElysiaInstance<typeof app>>
      ) {
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
  })
  .listen(8080);
```

You can find the entire example in the [examples](./examples/with-context) folder.

### Customize the logger name in the request context

```ts
import { Elysia } from 'elysia';
import { logger } from '@bogeychan/elysia-logger';

const app = new Elysia()
  .use(
    logger({
      contextKeyName: 'myLogger'
    })
  )
  .get('/', (ctx) => {
    // property "myLogger" is available instead of "log"
    ctx.myLogger.info(ctx.request, 'Request');

    return 'Hello World';
  })
  .listen(8080);
```

Checkout the [examples](./examples) folder on github for further use cases such as the integration of [pino-pretty](https://github.com/pinojs/pino-pretty) for readable console outputs.

## Author

[bogeychan](https://github.com/bogeychan)

## License

[MIT](LICENSE)

