import { Elysia } from 'elysia';

import { createPinoLogger } from '../src';

const log = createPinoLogger();

const app = new Elysia()
  .onError((ctx) => {
    log.error(ctx, ctx.error.name);
    return 'onError';
  })
  .get('/', (ctx) => {
    log.info(ctx, 'Context');

    throw { message: '1234', name: 'MyError' };
  })
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
