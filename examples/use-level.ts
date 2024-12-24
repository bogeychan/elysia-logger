import { Elysia } from "elysia";

import { logger } from "../src";

const app = new Elysia()
  .use(
    logger({
      level: "warn",
      useLevel: "warn",
    })
  )
  .get("/", () => "useLevel")
  .listen(8080);

console.log(`Listening on ${app.server!.url}`);