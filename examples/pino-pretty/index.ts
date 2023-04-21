import { Elysia } from 'elysia';
import pretty from 'pino-pretty';

import { logger } from '../../src/index';

/**
 * `transport` doesn't work in bun atm
 *
 * you can get a nice console output as the following coding shows:
 */
const stream = pretty({
  colorize: true
});

const app = new Elysia()
  .use(logger({ stream }))
  .get('/', (ctx) => {
    ctx.log.error(ctx, 'Context');
    ctx.log.info(ctx.request, 'Request');

    return 'pino-pretty';
  })
  .listen(8080);

console.log(`Listening on http://${app.server!.hostname}:${app.server!.port}`);
