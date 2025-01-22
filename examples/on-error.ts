import { Elysia } from "elysia";

import { createPinoLogger } from "../src";

const log = createPinoLogger();

const app = new Elysia()
  .onError((ctx) => {
    const { error } = ctx;

    if ("code" in error && "response" in error) {
      log.error(ctx, `HTTP ${error.code}: ${error.response}`);
    } else {
      log.error(ctx, error.name);
    }

    return "onError";
  })
  .get("/", (ctx) => {
    log.info(ctx, "Context");

    throw { message: "1234", name: "MyError" };
  })
  .listen(3000);

console.log(`Listening on ${app.server!.url}`);
