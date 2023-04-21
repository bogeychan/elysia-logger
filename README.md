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

Checkout the [examples](./examples) folder on github for further use cases such as the integration of [pino-pretty](https://github.com/pinojs/pino-pretty) for readable console outputs.

## Author

[bogeychan](https://github.com/bogeychan)

## License

[MIT](LICENSE)
