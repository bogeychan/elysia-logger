import { Elysia } from "elysia";
import { logger, fileLogger } from "../src";

const app = new Elysia()
  .use(
    fileLogger({
      file: "./out.log",
      autoLogging: false,
    }).derive({ as: "global" }, ({ log, ...rest }) => ({
      fileLogger: log,
      ...rest,
    }))
  )
  .use(logger())
  .get("/", (context) => {
    context.fileLogger.error("file error");
    context.log.error("error");
  })
  .listen(8080);

console.log(`Listening on ${app.server?.url}`);
