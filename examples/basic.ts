import { Elysia } from "elysia";

import { logger } from "../src";

const app = new Elysia()
  .use(logger())
  .get("/", (ctx) => {
    ctx.log.info(ctx, "Context");

    return "basic";
  })
  .listen(3000);

console.log(`Listening on ${app.server!.url}`);
