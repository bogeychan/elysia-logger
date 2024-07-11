import { Elysia } from "elysia";

import {
  type InferContext,
  createPinoLogger,
  formatters,
  isContext,
} from "../src";

const myPlugin = () => (app: Elysia) => app.decorate("myProperty", 42);

const app = new Elysia().use(myPlugin());

type MyElysiaContext = InferContext<typeof app>;

const log = createPinoLogger({
  // this is an alternative to `customProps`
  formatters: {
    ...formatters,
    log(object) {
      if (isContext(object)) {
        // `false` on `onError` method
        return {
          myProperty: (object as MyElysiaContext).myProperty,
        };
      }

      return formatters.log(object);
    },
  },
});

app
  .use(log.into()) // Call `into` to use the logger instance in both `ctx` and standalone
  .onError((ctx) => {
    log.error(ctx, ctx.error.name);
    return "onError";
  })
  .get("/", (ctx) => {
    ctx.log.info(ctx, "Context");

    throw new Error("whelp");
  })
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
