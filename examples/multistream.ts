import { Elysia } from "elysia";
import { logger, pino } from "../src";

// use a single `log` instance to write both to the console (`process.stdout`) and to a file (`pino.destination('./out.log')`)
const app = new Elysia()
  .use(
    logger({
      // @see https://getpino.io/#/docs/api?id=pinomultistreamstreamsarray-opts-gt-multistreamres
      stream: pino.multistream([process.stdout, pino.destination("./out.log")]),
    }).get("/", (ctx) => {
      ctx.log.error("multistream");
    })
  )
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);
