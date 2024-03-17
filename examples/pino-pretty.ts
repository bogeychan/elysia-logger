import { Elysia } from "elysia";

import { logger } from "../src";

/**
 * make sure to install the `pino-pretty` library before running this example:
 *
 * `bun add pino-pretty`
 */
const app = new Elysia()
  .use(
    logger({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    })
  )
  .get("/", (ctx) => {
    ctx.log.error(ctx, "Context");
    ctx.log.info(ctx.request, "Request");

    return "pino-pretty";
  })
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
