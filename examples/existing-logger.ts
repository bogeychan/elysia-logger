import { pino } from "pino";
import { Elysia } from "elysia";
import { wrap, serializers, formatters } from "../src";

const logger = pino({ serializers, formatters });

const app = new Elysia()
  .use(wrap(logger, { autoLogging: true }))
  .get("/", (ctx) => {
    ctx.log.info(ctx, "Context");

    return import.meta.file;
  })
  .listen(3000);

console.log(`Listening on ${app.server!.url}`);
