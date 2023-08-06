import { Elysia } from 'elysia';
import { randomUUID } from 'node:crypto';

import { logger } from '../../src/index';
import type {
  ElysiaContextForInstance,
  InferElysiaInstance
} from '../../src/types';
import { serializers, serializeRequest } from '../../src/config/serializers';

const mySerializers = {
  ...serializers,
  request: (request: Request) => {
    const url = new URL(request.url);

    return {
      ...serializeRequest(request),
      // https://http.dev/x-request-id
      id: request.headers.get('X-Request-ID') ?? randomUUID(),
      path: url.pathname
    };
  }
};

const myPlugin = () => (app: Elysia) => app.decorate('myProperty', 42);

const app = new Elysia().use(myPlugin());

app
  .use(
    logger({
      serializers: mySerializers,
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

console.log(`Listening on http://${app.server!.hostname}:${app.server!.port}`);

