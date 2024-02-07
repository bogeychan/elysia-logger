import { Elysia } from 'elysia';
import { randomUUID } from 'node:crypto';

import {
  logger,
  serializers,
  serializeRequest,
  type InferContext
} from '../src';

/**
 * the following coding shows how you can influence what is logged out:
 *
 * - request id based on "X-Request-ID"-header or random generation
 * - additional properties based on your custom context
 */
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

const myPlugin = () => new Elysia().decorate('myProperty', 42);

const app = new Elysia().use(myPlugin());

app
  .use(
    logger({
      serializers: mySerializers,
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
  })
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
