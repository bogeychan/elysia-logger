import { Elysia } from 'elysia';

import {
  ElysiaContextForInstance,
  InferElysiaInstance,
  createPinoLogger,
  formatters,
  isContext
} from '../src/index';

const myPlugin = () => (app: Elysia) => app.decorate('myProperty', 42);

const app = new Elysia().use(myPlugin());

type MyElysiaContext = ElysiaContextForInstance<
  InferElysiaInstance<typeof app>
>;

const log = createPinoLogger({
  // this is an alternative to `customProps`
  formatters: {
    ...formatters,
    log(object) {
      if (isContext(object)) {
        // `false` on `onError` method
        return {
          myProperty: (object as MyElysiaContext).myProperty
        };
      }

      return formatters.log(object);
    }
  }
});

app
  .onError((ctx) => {
    log.error(ctx, ctx.error.name);
    return 'onError';
  })
  .get('/', (ctx) => {
    log.info(ctx, 'Context');

    throw { message: '1234', name: 'MyError' };
  })
  .listen(8080);

console.log(`Listening on http://${app.server!.hostname}:${app.server!.port}`);
